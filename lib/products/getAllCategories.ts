import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

export const getCategories = async () => { 
  const ALL_PRODUCT_QUERY = defineQuery
  (`*[_type == "category"]
    | order(name asc )
  `);
  try {
    const categories = await sanityFetch({ query: ALL_CATEGORY_QUERY, });
    return categories.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
 };