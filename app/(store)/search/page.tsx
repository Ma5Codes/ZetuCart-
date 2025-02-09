import ProductGrid from "@/components/ProductGrid";
import { searchProductsByName } from "@/sanity/lib/products/searchProductsByName";

async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  // Removed 'await' from searchParams since it's already an object
  const { query } = searchParams;

  //Handle empty search query to prevent unnecessary API calls
  if (!query || query.trim() === "") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Please enter a search term.
          </h1>
        </div>
      </div>
    );
  }

  console.log("Search query:", query); // Debugging: Log query before fetching

  const products = await searchProductsByName(query);

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-center">
            No product found for: {query}
          </h1>
          <p className="text-gray-600 text-center">
            Please try searching with different keywords.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Search Results for: {query}
        </h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

export default SearchPage;
