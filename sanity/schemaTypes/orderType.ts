import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
        name: "orderNumber",
        title: "Order Number",
        type: "string",
        validation: (Rule) => Rule.required()
    }),
    defineField({
        name: "stripeCheckoutSessionId",
        title: "Stripe Checkout Session ID",
        type: "string",
    }),
    defineField({
        name: "stripeCustioemrId",
        title: "Stripe Customer ID",
        type: "string",
        validation: (Rule) => Rule.required()
    }),
    defineField({
        name: "ClerkUserId",
        title: "Store User ID",
        type: "string",
        validation: (Rule) => Rule.required()
    }),
    defineField({
        name: "customerName",
        title: "Customer Name",
        type: "string",
        validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: "email",
        title: "Customer Email",
        type: "string",
        validation: (Rule) => Rule.required().email(),
    }),
    defineField({
        name: "stripePaymentIntentId",
        title: "Stripe Payment Intent ID",
        type: "string",
        validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: "products",
        title: "Products",
        type: "array",
        of: [
            defineArrayMember({
                type: "object",
                fields: [
                    defineField({
                        name: "product",
                        title: "Product Bought",
                        type: "reference",
                        to: [{type: "product"}],
                    }),
                    defineField({
                        name: "quantity",
                        title: "Quantity Purchased",
                        type: "number",
                    }),
                ],
                preview: {
                    select: {
                        product: "product.name",
                        quantity: "quantity",
                        image: "product.image",
                        price: "product.price",
                        currency: "product.currency",
                    },
                    prepare(select) {
                        return {
                            title: `${select.product} x ${select.quantity}`,
                            subtitle: `${select.price} * ${select.quantity}`,
                            media: select.image,
                        };
                    },
                },
            }),
        ],
    }),
    defineField({
        name: "totalPrice",
        title: "Total Price",
        type: "number",
        validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
        name: "currency",
        title: "Currency",
        type: "string",
        validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: "amountDiscount",
        title: "Amount Discount",
        type: "number",
        validation: (Rule) => Rule.required().min(0),
    }),
  ],
});
