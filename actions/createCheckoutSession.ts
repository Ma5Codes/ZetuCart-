"use server";
import stripe from "@/lib/stripe";
import { imageUrl } from "@/lib/imageUrl";
import { BasketItem } from "@/store/store";

export type Metadata = {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId: string;
};

export type GroupedBasketItem = {
    product: BasketItem["product"];
    quantity: number;
};

export async function createCheckoutSession(
    items: GroupedBasketItem[],
    metadata: Metadata
) {
    try {
        // Check if any group items don't have a price
        const itemsWithoutPrice = items.filter((item) => !item.product.price);
        if (itemsWithoutPrice.length > 0) {
            throw new Error("Some items do not have a price.");
        }

        // Find or create a customer in Stripe
        const customers = await stripe.customers.list({
            email: metadata.customerEmail,
            limit: 1,
        });

        let customerId: string | undefined = undefined;
        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        }
       const baseUrl= process.env.NODE_ENV === "production" ? `https://${process.env.VERCEL_URL}`: `${process.env.NEXT_PUBLIC_BASE_URL}`;

       const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;

       const cancelUrl = `${baseUrl}/basket`

       console.log("SUCESS URL <<<", successUrl);
       console.log("CANCEL URL <<<", cancelUrl);
        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            customer_creation: customerId ? undefined : "always",
            customer_email: !customerId ? metadata.customerEmail : undefined,
            metadata,
            mode: "payment",
            allow_promotion_codes: true,
            success_url: successUrl,
            cancel_url: cancelUrl,
            line_items: items.map((item) => ({
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round((item.product.price ?? 0) * 100),
                    product_data: {
                        name: item.product.name || "Unnamed Product",
                        description: `Product ID: ${item.product._id}`,
                        metadata: {
                            id: item.product._id,
                        },
                        images: item.product.image ? [imageUrl(item.product.image)] : [],
                    },
                },
                quantity: item.quantity,
            })),
        });

        return session.url;
    } catch (error) {
        console.error("Error while creating checkout session:", error);
        throw error;
    }
}
