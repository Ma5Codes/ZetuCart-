import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/client";


export async function getMyOrders(userId: string) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    // define the Sanity query
    const MY_ORDERS_QUERY = defineQuery(`
        *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
            ...,
            products[] {
                ...,
                product-> // Expand product reference
            }
        }
    `);

    try {
        // execute the query
        const orders = await sanityFetch(MY_ORDERS_QUERY, { userId },{cache: "no-cache" });

        return orders || []; // Return an empty array if no orders are found
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Error fetching orders");
    }
}