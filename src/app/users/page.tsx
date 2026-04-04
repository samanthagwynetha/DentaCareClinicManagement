"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { apiFetch } from "@/lib/api";
import { useRoleGuard } from "@/utils/roleGuard";
import { User, FormValues, EditValues } from "@/components/users/types";
import StaffTable from "@/components/users/StaffTable";
import AddStaffModal from "@/components/users/AddStaffModal";
import EditStaffModal from "@/components/users/EditStaffModal";
import ResetPasswordModal from "@/components/users/ResetPasswordModal";
import DeleteStaffModal from "@/components/users/DeleteStaffModal";

type RoleFilter = "all" | "dentist" | "receptionist" | "hygienist" | "assistant";

const ROLE_FILTER_OPTIONS: Array<{ value: RoleFilter; label: string }> = [
  { value: "all", label: "All Roles" },
  { value: "dentist", label: "Dentist" },
  { value: "receptionist", label: "Receptionist" },
  { value: "hygienist", label: "Hygienist" },
  { value: "assistant", label: "Assistant" },
];

export default function UsersPage() {
  useRoleGuard(["admin"]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const roleMenuRef = useRef<HTMLDivElement | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<User[]>("/api/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load staff accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredUsers = users
    .filter((u) => u.role !== "admin")
    .filter((u) => roleFilter === "all" || u.role === roleFilter)
    .filter((u) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || (u.phone?.toLowerCase().includes(term) ?? false);
    });

  async function handleCreate(values: FormValues) {
    setError(""); setSuccess("");
    try {
      setSaving(true);
      await apiFetch<User>("/api/users", { method: "POST", body: JSON.stringify(values) });
      setSuccess(`${values.role === "dentist" ? "Dentist" : "Receptionist"} account created.`);
      setIsAddStaffOpen(false);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit(values: EditValues) {
    if (!editingUser) return;
    setError(""); setSuccess("");
    try {
      setSaving(true);
      await apiFetch<User>(`/api/users/${editingUser._id}`, { method: "PUT", body: JSON.stringify(values) });
      setSuccess("Staff account updated.");
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update account.");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword(userId: string, newPassword: string) {
    setError(""); setSuccess("");
    try {
      setResettingId(userId);
      await apiFetch(`/api/users/${userId}/reset-password`, { method: "PUT", body: JSON.stringify({ password: newPassword }) });
      setSuccess(`Password reset successfully.`);
      setResetPasswordUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setResettingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteUser) return;
    setError(""); setSuccess("");
    try {
      setDeletingId(deleteUser._id);
      await apiFetch(`/api/users/${deleteUser._id}`, { method: "DELETE" });
      setSuccess("Staff account deleted.");
      setDeleteUser(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-4">
          <p className="text-sm text-gray-400 mb-1">
            <span className="hover:text-teal-500 cursor-pointer">Home</span>
            <span className="mx-1">›</span>Staff
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500">Create dentist and receptionist accounts</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon="users" label="Total Staff" value={users.filter((u) => u.role !== "admin").length} color="teal" />
            <StatCard icon="calendar" label="Dentists" value={users.filter((u) => u.role === "dentist").length} color="emerald" />
            <StatCard icon="check" label="Active" value={users.filter((u) => u.role !== "admin").length} color="green" />
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative w-full max-w-sm">
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search staff..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Role filter dropdown */}
              <div className="relative" ref={roleMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsRoleMenuOpen((p) => !p)}
                  className="inline-flex min-w-[170px] items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  <span>{ROLE_FILTER_OPTIONS.find((o) => o.value === roleFilter)?.label ?? "All Roles"}</span>
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isRoleMenuOpen && (
                  <div className="absolute left-0 top-12 z-30 w-[190px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    {ROLE_FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setRoleFilter(opt.value); setIsRoleMenuOpen(false); }}
                        className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors ${roleFilter === opt.value ? "bg-teal-50 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center text-gray-700">
                          {roleFilter === opt.value && (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => { setError(""); setSuccess(""); setIsAddStaffOpen(true); }}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z" />
              </svg>
              Add Staff
            </button>
          </div>

          {/* Staff Directory */}
          <div>
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Staff Directory</h2>
                <span className="text-xs text-gray-400">{filteredUsers.length} accounts</span>
              </div>

              {error && !isAddStaffOpen && !editingUser && !resetPasswordUser && !deleteUser && (
                <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
              )}
              {success && !isAddStaffOpen && !editingUser && !resetPasswordUser && !deleteUser && (
                <div className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">{success}</div>
              )}

              <StaffTable
                users={filteredUsers}
                loading={loading}
                deletingId={deletingId}
                resettingId={resettingId}
                onEdit={setEditingUser}
                onResetPassword={setResetPasswordUser}
                onDelete={setDeleteUser}
              />
            </section>
          </div>
        </div>

      </div>

      {/* Modals */}
      {isAddStaffOpen && (
        <AddStaffModal
          onSubmit={handleCreate}
          onClose={() => setIsAddStaffOpen(false)}
          saving={saving}
          error={error}
          success={success}
        />
      )}
      {editingUser && (
        <EditStaffModal
          user={editingUser}
          onSave={handleSaveEdit}
          onClose={() => setEditingUser(null)}
          saving={saving}
          error={error}
          success={success}
        />
      )}
      {resetPasswordUser && (
        <ResetPasswordModal
          user={resetPasswordUser}
          resettingId={resettingId}
          error={error}
          onSubmit={handleResetPassword}
          onClose={() => setResetPasswordUser(null)}
        />
      )}
      {deleteUser && (
        <DeleteStaffModal
          user={deleteUser}
          deletingId={deletingId}
          error={error}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
}

// ─── Inline mini helper ───────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    teal: "bg-teal-50 text-teal-600",
    emerald: "bg-emerald-50 text-emerald-600",
    green: "bg-green-50 text-green-600",
  };
  const icons: Record<string, React.ReactNode> = {
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    ),
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icons[icon]}
        </svg>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}