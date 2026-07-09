import { SiteLayout } from "@/components/shared/site-layout";
import { CheckoutContent } from "@/features/checkout/checkout-content";

export default function CheckoutPage() {
  return (
    <SiteLayout>
      <div className="bg-neutral-50">
        <CheckoutContent />
      </div>
    </SiteLayout>
  );
}
