import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY){
    throw new Error("STRIPE_SECRET_KEY is not set!");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia",//Use the latest version of the API
});
export default stripe;