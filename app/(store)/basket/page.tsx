'use client'

import AddToBasketButton from "@/components/AddToBasketButton";
import Loader from "@/components/Loader";
import useBasketStore from "@/store/store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image"; // Import Sanity image helper

import { Metadata } from "@/actions/createCheckoutSession";
import { createCheckoutSession } from "@/actions/createCheckoutSession";

function BasketPage() {
    const groupedItems = useBasketStore((state) => state.getGroupedItems());
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { setIsClient(true); }, []);

    if (!isClient) {
        return <Loader />;
    }

    if (groupedItems.length === 0) {
        return (
            <div className="container mx-auto p-4 flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold mb-8 text-gray-800">Your Basket</h1>
                <p className="text-gray-600 text-lg">Your basket is empty.</p>
            </div>
        );
    }

    const handleCheckOut = async () => {
        if (!isSignedIn) return;
        setIsLoading(true);

        try {
            const metadata: Metadata = {
                orderNumber: crypto.randomUUID(),
                customerName: user?.fullName ?? "Unknown",
                customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
                clerkUserId: user!.id,
            };
            const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error("Error creating checkout session:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Your Basket</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow">
                    {groupedItems?.map((item) => (
                        <div key={item.product._id} className="mb-4 p-4 border rounded justify-between items-center">
                            <div 
                                className="flex items-center cursor-pointer flex-1 min-w-0" 
                                onClick={() => router.push(`/product/${item.product.slug?.current}`)}
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                                    {item.product.image && (
                                        <Image 
                                            src={urlFor(item.product.image)?.url() ?? "/fallback.png"} 
                                            alt={item.product.name ?? "Product image"} 
                                            className="w-full h-full object-cover rounded" 
                                            width={96} 
                                            height={96} 
                                        />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm-text-xl font-semibold truncate">
                                        {item.product.name}
                                    </h2>
                                    <p className="text-sm sm:text-base">
                                        Price: ${((item.product.price ?? 0) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center ml-4 flex-shrink-0">
                                <AddToBasketButton product={item.product} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full lg:sticky lg:w-80 lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
                    <h3 className="text-xl font-semibold">Order Summary</h3>
                    <div className="mt-4 space-y-2">
                        <p className="flex justify-between">
                            <span>Items:</span>
                            <span>${groupedItems.reduce((total, item) => total + item.quantity, 0)}</span>
                        </p>
                        <p className="flex justify-between text-2xl font-bold border-t pt-2">
                            <span>Total:</span>
                            <span>
                                ${useBasketStore.getState().getTotalPrice().toFixed(2)}
                            </span>
                        </p>
                    </div>
                    {isSignedIn ? (
                        <button 
                            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400" 
                            onClick={handleCheckOut} 
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Checkout"}
                        </button>
                    ) : (
                        <SignInButton mode="modal">
                            <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                                Sign in to checkout
                            </button>
                        </SignInButton>
                    )}
                </div>

                <div className="h-64 lg:h-0">
                    {/* Spacer for fixed checkout on mobile */}
                </div>
            </div>
        </div>
    );
}

export default BasketPage;
