import { Suspense } from "react";
import { SiteLayout } from "@/components/shared/site-layout";
import { OrdersContent } from "@/features/orders/orders-content";

export default function OrdersPage() {
  return (
    <SiteLayout>
      <Suspense fallback={null}>
        <OrdersContent />
      </Suspense>
    </SiteLayout>
  );
}
