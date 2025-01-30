import { getAllProducts } from "@/lib/products/getAllProducts";
import { Button } from "../../components/ui/button";
import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/lib/products/getAllCategories";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  return (
    <div>
      <h1>Hello,MA5 Next.js!</h1>
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <ProductsView products={products}  categories={categories} />
      </div>
    </div>
  );
}