'use client'

import { Product } from "@/sanity.types";
import {AnimatePresence,motion} from "framer-motion";
import ProductThumb from "./ProductThumb";

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {products?.map((product) => {
        return (<AnimatePresence key={product._id}>
            <motion.div layout initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center">
             <ProductThumb key={product._id} product={product} />
             </motion.div>
            </AnimatePresence>
            
            );
      })}
    </div>
  );
}
export default ProductGrid;