"use client";

import { useEffect } from "react";
import { useCart, TableContextType } from "@/components/providers/CartProvider";

export default function TableSessionInitializer({
  context,
  children,
}: {
  context: TableContextType;
  children: React.ReactNode;
}) {
  const { setTableContext } = useCart();

  useEffect(() => {
    setTableContext(context);
  }, [context, setTableContext]);

  return <>{children}</>;
}
