"use client";
import { useState, useEffect, useCallback } from "react";
import { getRole } from "@/utils/auth";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileHeader from "@/components/UserProfileHeader";
import { useRoleGuard } from "@/utils/roleGuard";
import { Invoice } from "@/components/billing/types";
import BillingStats from "@/components/billing/BillingStats";
import InvoiceTable from "@/components/billing/InvoiceTable";
import InvoiceModal from "@/components/billing/InvoiceModal";
import { apiFetch } from "@/lib/api";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "overdue", label: "Overdue" },
  { value: "pending", label: "Pending" },
];

export default function BillingPage() {
  const isChecking = useRoleGuard(["receptionist", "admin", "dentist"]);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (isChecking) return;
    if (typeof window !== "undefined") {
      setRole(getRole());
    }
  }, [isChecking]);

  const loadInvoices = useCallback(async () => {
    if (isChecking) return;
    setLoading(true);
    try {
      const data = await apiFetch<Invoice[]>("/api/invoices");
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  }, [isChecking]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices, isChecking]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
      </div>
    );
  }

  const filtered = invoices
    .filter((i) => !statusFilter || i.status === statusFilter)
    .filter((i) => {
      if (!search) return true;
      const q = search.toLowerCase();
      const name = `${i.patient?.firstName ?? ""} ${i.patient?.lastName ?? ""}`.toLowerCase();
      return name.includes(q);
    });

  function openCreate() {
    setModalMode("create");
    setEditingInvoice(null);
    setShowModal(true);
  }

  function openView(invoice: Invoice) {
    setModalMode("view");
    setEditingInvoice(invoice);
    setShowModal(true);
  }

  function openEdit(invoice: Invoice) {
    setModalMode("edit");
    setEditingInvoice(invoice);
    setShowModal(true);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                <span className="hover:text-teal-500 cursor-pointer">Home</span>
                <span className="mx-1">›</span>
                Billing
              </p>
              <h1 className="text-2xl font-bold text-gray-900">Billing &amp; Invoices</h1>
              <p className="text-sm text-gray-500">Manage payments and invoices</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search patients, appointments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-72 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Calendar icon */}
              <button className="p-2 hover:bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Notification bell */}
              <NotificationBell />

              {/* User profile */}
              <UserProfileHeader />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="px-8 py-6">
          <BillingStats invoices={invoices} />

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {role !== "dentist" && (
                <button
                  onClick={openCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Generate Invoice
                </button>
              )}
            </div>

            <InvoiceTable
              invoices={filtered}
              allInvoices={invoices}
              loading={loading}
              role={role}
              onView={openView}
              onEdit={openEdit}
              onRefresh={loadInvoices}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <InvoiceModal
          mode={modalMode}
          invoice={editingInvoice}
          onClose={() => setShowModal(false)}
          onSaved={loadInvoices}
        />
      )}

      
    </div>
  );
}
