import { Suspense } from "react";
import { SiteLayout } from "@/components/shared/site-layout";
import { AllRestaurantContent } from "@/features/resto/all-restaurant-content";

export default function AllRestaurantPage() {
  return (
    <SiteLayout>
      <Suspense fallback={null}>
        <AllRestaurantContent />
      </Suspense>
    </SiteLayout>
  );
}
