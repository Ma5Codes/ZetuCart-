import { Product } from "@/sanity.types";

interface ProductsViewProps {
    products: Product[];
   categories: Category[];
  }
const ProductView = ({products,categories}:ProductsViewProps) => {
    return (
        <div className="flex flex-col ">
            {/* <h1>Categories1> */}
            <div className="w-full sm:w-3/4">
               {/*CategorySelectorComponent categories={categories} /> */}
            </div>

            {/* <h1>Products</h1> */}
            <div className="flex-1">
                <div>
                  {/* <ProductGrid products={products} />*/}

                    <hr className="w-1/2 sm:w-3/4" />
                </div>
            </div>
        </div>
        
    );
};
export default ProductView;