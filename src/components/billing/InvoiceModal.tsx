"use client";
import { useEffect, useState } from "react";
import { Invoice, InvoiceService } from "./types";
import { apiFetch } from "@/lib/api";

type Patient = { _id: string; firstName: string; lastName: string };

type Props = {
  onClose: () => void;
  onSaved: () => void;
  invoice?: Invoice | null;
  mode?: "create" | "edit" | "view";
};

const EMPTY_SERVICE: InvoiceService = { name: "", price: 0 };

export default function InvoiceModal({ onClose, onSaved, invoice, mode }: Props) {
  const resolvedMode = mode ?? (invoice ? "edit" : "create");
  const isView = resolvedMode === "view";
  const isEdit = resolvedMode === "edit";

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState(invoice?.patient?._id ?? "");
  const [services, setServices] = useState<InvoiceService[]>(
    invoice?.services.length ? invoice.services : [{ ...EMPTY_SERVICE }]
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    invoice?.paymentMethod ?? "cash"
  );
  const [status, setStatus] = useState<string>(invoice?.status ?? "unpaid");
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate ? invoice.dueDate.slice(0, 10) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ patients: Patient[] } | Patient[]>("/api/patients")
      .then((data) => {
        if (Array.isArray(data)) setPatients(data);
        else setPatients((data as { patients: Patient[] }).patients ?? []);
      })
      .catch(console.error);
  }, []);

  const totalAmount = services.reduce((s, svc) => s + Number(svc.price), 0);

  function updateService(idx: number, field: keyof InvoiceService, value: string | number) {
    setServices((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  }

  function addService() {
    setServices((prev) => [...prev, { ...EMPTY_SERVICE }]);
  }

  function removeService(idx: number) {
    setServices((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!patientId) return setError("Please select a patient.");
    if (services.some((s) => !s.name || Number(s.price) <= 0))
      return setError("All services must have a name and a price > 0.");

    setSaving(true);
    try {
      const body = { patient: patientId, services, paymentMethod, status, dueDate: dueDate || undefined, totalAmount };
      if (isEdit) {
        await apiFetch(`/api/invoices/${invoice!._id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await apiFetch("/api/invoices", { method: "POST", body: JSON.stringify(body) });
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save invoice.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isView ? "View Invoice" : isEdit ? "Edit Invoice" : "Generate Invoice"}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={isView}
              required
            >
              <option value="">Select patient…</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Services</label>
              {!isView && (
                <button
                  type="button"
                  onClick={addService}
                  className="text-xs text-teal-600 hover:underline font-medium"
                >
                  + Add service
                </button>
              )}
            </div>
            <div className="space-y-2">
              {services.map((svc, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Service name"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={svc.name}
                    onChange={(e) => updateService(idx, "name", e.target.value)}
                    disabled={isView}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    min={0}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={svc.price || ""}
                    onChange={(e) => updateService(idx, "price", parseFloat(e.target.value) || 0)}
                    disabled={isView}
                    required
                  />
                  {!isView && services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="p-1.5 text-red-400 hover:text-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total: <span className="font-semibold text-gray-700">₱{totalAmount.toLocaleString()}</span>
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={isView}
            >
              <option value="cash">Cash</option>
              <option value="gcash">GCash</option>
              <option value="card">Card</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isView}
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (optional)</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isView}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {isView ? "Close" : "Cancel"}
          </button>
          {!isView && (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Update Invoice" : "Generate Invoice"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
