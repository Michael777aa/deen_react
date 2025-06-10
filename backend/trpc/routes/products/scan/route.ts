import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { mockProducts } from "@/mocks/productData";

export default publicProcedure
  .input(
    z.object({
      barcode: z.string(),
    })
  )
  .query(async ({ input }) => {
    // Simulate a database lookup
    const product = mockProducts.find(p => p.barcode === input.barcode);
    
    if (!product) {
      return {
        found: false,
        message: "Product not found in our database",
      };
    }
    
    return {
      found: true,
      product,
    };
  });