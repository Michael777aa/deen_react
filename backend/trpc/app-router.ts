import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import scanProductRoute from "./routes/products/scan/route";
import reportProductRoute from "./routes/products/report/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  products: createTRPCRouter({
    scan: scanProductRoute,
    report: reportProductRoute,
  }),
});

export type AppRouter = typeof appRouter;