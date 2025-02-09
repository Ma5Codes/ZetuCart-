import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMyOrders } from "@/sanity/lib/orders/getMyOrders";
import { formatCurrency } from "@/lib/formatCurrency";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client as sanityClient } from "@/sanity/lib/client";
// Image URL Builder
const builder = imageUrlBuilder(sanityClient);
function urlFor(source: string | object): string {
    return builder.image(source).url();
}

async function Orders() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Fetch Orders
    const orders = await getMyOrders(userId);

    console.log("Fetched orders:", orders); // Debugging

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center text-gray-600">
                        <p>You have not placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6 sm:space-y-8">
                        {orders.map((order) => (
                            <div key={order.orderNumber} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4 sm:p-6 border-b border-gray-200">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1 font-bold">Order Number</p>
                                            <p className="text-sm font-mono text-green-600 break-all">{order.orderNumber}</p>
                                        </div>
                                        <div className="sm:text-right">
                                            <p className="text-sm text-gray-600 mb-1">Order Date</p>
                                            <p className="font-medium">
                                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                                        <div className="flex items-center">
                                            <span className="text-sm mr-2">Status:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                order.status === "paid"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="sm:text-right">
                                            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                            <p className="font-bold text-lg">
                                                {formatCurrency(order.totalPrice ?? 0, order.currency)}
                                            </p>
                                        </div>
                                    </div>

                                    {order.amountDiscount ? (
                                        <div className="mt-4 p-3 sm:p-4 bg-red-50 rounded-lg">
                                            <p className="text-red-600 font-medium mb-1 text-sm sm:text-base">
                                                Discount Applied:{" "}
                                                {formatCurrency(order.amountDiscount, order.currency)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Original Subtotal:{" "}
                                                {formatCurrency(
                                                    (order.totalPrice ?? 0) + order.amountDiscount,
                                                    order.currency
                                                )}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Order Items */}
                                <div className="px-4 py-4 sm:px-6 sm:py-4">
                                    <p className="text-sm font-semibold text-gray-600 mb-3 sm:mb-4">Order Items</p>
                                    <div className="space-y-3 sm:space-y-4">
                                        {order.products?.map((product) => (
                                            <div
                                                key={product.product?._id}
                                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b last:border-b-0"
                                            >
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    {product.product?.image && (
                                                        <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-md overflow-hidden">
                                                            <Image
                                                                src={urlFor(product.product.image)}
                                                                alt={product.product?.name ?? ""}
                                                                className="object-cover"
                                                                fill
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-sm sm:text-base">
                                                            {product.product?.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Quantity: {product.quantity ?? "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-right">
                                                    {product.product?.price && product.quantity
                                                        ? formatCurrency(
                                                              product.product.price * product.quantity,
                                                              order.currency
                                                          )
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;
