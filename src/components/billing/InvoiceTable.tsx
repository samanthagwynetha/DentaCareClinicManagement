"use client";
import { useState } from "react";
import { Invoice } from "./types";
import ConfirmDialog from "../ConfirmDialog";
import { apiFetch } from "@/lib/api";

type Props = {
  invoices: Invoice[];
  allInvoices: Invoice[];
  loading: boolean;
  role?: string | null;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onRefresh: () => void;
};

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-orange-100 text-orange-700",
  overdue: "bg-red-100 text-red-700",
  pending: "bg-teal-100 text-teal-700",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function downloadInvoice(inv: Invoice) {
  const patientName = inv.patient
    ? `${inv.patient.firstName} ${inv.patient.lastName}`
    : "Unknown Patient";

  const servicesRows = inv.services
    .map(
      (s) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${s.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">&#8369;${s.price.toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Invoice - ${patientName}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 0; padding: 40px; }
    h1 { color: #0d9488; margin-bottom: 4px; }
    .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 32px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 28px; font-size: 14px; }
    .info-grid span { color: #6b7280; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    thead tr { background: #f9fafb; }
    th { padding: 10px 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #374151; }
    th:last-child { text-align: right; }
    .total-row td { padding: 12px; font-weight: bold; font-size: 15px; border-top: 2px solid #0d9488; }
    .total-row td:last-child { text-align: right; color: #0d9488; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
    .paid   { background:#dcfce7; color:#15803d; }
    .unpaid { background:#ffedd5; color:#c2410c; }
    .overdue{ background:#fee2e2; color:#b91c1c; }
    .pending{ background:#ccfbf1; color:#0f766e; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>DentaCare</h1>
  <p class="subtitle">Official Invoice</p>
  <div class="info-grid">
    <div><span>Patient: </span><strong>${patientName}</strong></div>
    <div><span>Status: </span><span class="badge ${inv.status}">${inv.status}</span></div>
    <div><span>Issued Date: </span>${new Date(inv.issuedDate).toLocaleDateString()}</div>
    <div><span>Payment Method: </span>${inv.paymentMethod ?? "—"}</div>
    ${inv.dueDate ? `<div><span>Due Date: </span>${new Date(inv.dueDate).toLocaleDateString()}</div>` : ""}
  </div>
  <table>
    <thead><tr><th>Service</th><th style="text-align:right;">Price</th></tr></thead>
    <tbody>${servicesRows}</tbody>
    <tfoot>
      <tr class="total-row">
        <td>Total Amount</td>
        <td>&#8369;${inv.totalAmount.toLocaleString()}</td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

export default function InvoiceTable({
  invoices,
  allInvoices,
  loading,
  role,
  onView,
  onEdit,
  onRefresh,
}: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalRevenuePaid = allInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/api/invoices/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      {loading ? (
        <div className="p-10 text-center text-gray-400">Loading invoices…</div>
      ) : invoices.length === 0 ? (
        <div className="p-10 text-center text-gray-400">No invoices found.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-600">
              <th className="px-6 py-3 font-medium w-12">#</th>
              <th className="px-6 py-3 font-medium">Patient</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv, idx) => (
              <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-500">{idx + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {inv.patient
                    ? `${inv.patient.firstName} ${inv.patient.lastName}`
                    : "—"}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  ₱{inv.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDate(inv.issuedDate)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[inv.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* View */}
                    <button
                      title="View"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                      onClick={() => onView(inv)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {/* Download */}
                    <button
                      title="Download"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => downloadInvoice(inv)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    {/* Edit */}
                    {role !== "dentist" && (
                      <button
                        title="Edit"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
                        onClick={() => onEdit(inv)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    {/* Delete */}
                    {role === "admin" && (
                      <button
                        title="Delete"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => setDeletingId(inv._id)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
        <span>
          Showing {invoices.length} of {allInvoices.length} invoices
        </span>
        <span className="font-medium text-gray-700">
          Total Revenue (Paid): ₱{totalRevenuePaid.toLocaleString()}
        </span>
      </div>

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
