import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductsByName = async (searchTerm: string) => {
  
  const PRODUCT_SEARCH_QUERY = defineQuery(`
    *[
        _type == "product"
        && name match $name
    ] | order(name asc)
  `);

  try {
    console.log("Fetching products for:", searchTerm); // Debugging: Log search term before fetching

    const products = await sanityFetch({
      query: PRODUCT_SEARCH_QUERY,
      params: {
        name: `${searchTerm}*`, // Ensuring partial match search
      },
    });

    // Return products or an empty array if none found
    return products.data || [];
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return [];
  }
};
