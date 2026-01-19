import { Suspense } from "react";
import PaymentClient from "./PaymentClient";

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center text-gray-700 dark:text-gray-300 gap-2">
        <span>Loading...</span>
      </div>
    }>
      <PaymentClient />
    </Suspense>
  );
}
