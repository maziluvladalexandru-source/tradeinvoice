"use client";

import { useEffect } from "react";

export default function ViewTracker({ invoiceId }: { invoiceId: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/invoice/${invoiceId}/viewed`, { method: "POST" }).catch(
        () => {}
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [invoiceId]);

  return null;
}
