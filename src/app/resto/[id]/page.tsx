import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/shared/site-layout";
import { RestaurantDetailContent } from "@/features/resto/restaurant-detail-content";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    notFound();
  }

  return (
    <SiteLayout>
      <RestaurantDetailContent id={restaurantId} />
    </SiteLayout>
  );
}
