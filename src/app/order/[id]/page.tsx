import { notFound } from "next/navigation";
import { getOrderById } from "@/server/services/order.service";
import { serializeOrder } from "@/server/db/serializers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderStatusView from "@/features/orders/components/OrderStatusView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const serialized = serializeOrder(order as any);

  return (
    <main className="min-h-screen bg-[#171918] text-white">
      <Navbar />
      <div className="pt-24 pb-20">
        <OrderStatusView initialOrder={serialized as any} />
      </div>
      <Footer />
    </main>
  );
}
