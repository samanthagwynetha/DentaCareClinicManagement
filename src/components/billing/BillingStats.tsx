"use client";
import { Invoice } from "./types";

type Props = {
  invoices: Invoice[];
};

export default function BillingStats({ invoices }: Props) {
  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const pendingAmount = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalInvoices = invoices.length;

  const fmt = (n: number) =>
    `₱${n.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Revenue */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-teal-500 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{fmt(totalRevenue)}</p>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-yellow-500 font-medium">Pending Amount</p>
          <p className="text-2xl font-bold text-gray-900">{fmt(pendingAmount)}</p>
        </div>
      </div>

      {/* Total Invoices */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-teal-500 font-medium">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
        </div>
      </div>
    </div>
  );
}
