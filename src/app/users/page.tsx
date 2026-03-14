"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { apiFetch } from "@/lib/api";
import { useRoleGuard } from "@/utils/roleGuard";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "dentist" | "receptionist";
};

type FormValues = {
  name: string;
  email: string;
  password: string;
  role: "dentist" | "receptionist";
};

type EditValues = {
  name: string;
  email: string;
  role: "dentist" | "receptionist";
};

const INITIAL_FORM: FormValues = {
  name: "",
  email: "",
  password: "",
  role: "dentist",
};

function roleClasses(role: User["role"]) {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-700";
    case "dentist":
      return "bg-teal-100 text-teal-700";
    case "receptionist":
    default:
      return "bg-blue-100 text-blue-700";
  }
}

export default function UsersPage() {
  useRoleGuard(["admin"]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<FormValues>(INITIAL_FORM);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditValues | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<User[]>("/api/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err instanceof Error ? err.message : "Failed to load staff accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);
      await apiFetch<User>("/api/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess(`${form.role === "dentist" ? "Dentist" : "Receptionist"} account created.`);
      setForm(INITIAL_FORM);
      await loadUsers();
    } catch (err) {
      console.error("Failed to create user:", err);
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(user: User) {
    if (user.role === "admin") return;
    setEditingUserId(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  function cancelEdit() {
    setEditingUserId(null);
    setEditForm(null);
  }

  async function saveEdit(userId: string) {
    if (!editForm) return;
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await apiFetch<User>(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setSuccess("Staff account updated.");
      cancelEdit();
      await loadUsers();
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(err instanceof Error ? err.message : "Failed to update account.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user: User) {
    if (user.role === "admin") {
      setError("Admin accounts cannot be deleted from this screen.");
      return;
    }

    const confirmed = window.confirm(`Delete ${user.name}'s account? This cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeletingId(user._id);
      setError("");
      setSuccess("");
      await apiFetch(`/api/users/${user._id}`, { method: "DELETE" });
      setSuccess("Staff account deleted.");
      await loadUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError(err instanceof Error ? err.message : "Failed to delete account.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleResetPassword(user: User) {
    const newPassword = window.prompt(`Enter a new password for ${user.name} (min 6 chars):`);
    if (!newPassword) return;

    try {
      setResettingId(user._id);
      setError("");
      setSuccess("");
      await apiFetch(`/api/users/${user._id}/reset-password`, {
        method: "PUT",
        body: JSON.stringify({ password: newPassword }),
      });
      setSuccess(`Password reset for ${user.name}.`);
    } catch (err) {
      console.error("Failed to reset password:", err);
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setResettingId(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <div className="bg-white border-b border-gray-100 px-8 py-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">
              <span className="hover:text-teal-500 cursor-pointer">Home</span>
              <span className="mx-1">›</span>
              Staff
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-sm text-gray-500">Create dentist and receptionist accounts</p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 xl:grid-cols-[380px,1fr] gap-6">
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Add Staff Account</h2>
            <p className="text-sm text-gray-500 mb-5">Only admins can create login accounts.</p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
            )}
            {success && (
              <div className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">{success}</div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Dr. Jane Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      role: e.target.value as FormValues["role"],
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="dentist">Dentist</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Account"}
              </button>
            </form>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Current Staff</h2>
                <p className="text-sm text-gray-500">Existing login accounts in the system</p>
              </div>
              <button
                onClick={loadUsers}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-gray-400">Loading staff accounts...</div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">No staff accounts found.</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {editingUserId === user._id ? (
                            <input
                              type="text"
                              value={editForm?.name ?? ""}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev ? { ...prev, name: e.target.value } : prev
                                )
                              }
                              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                            />
                          ) : (
                            user.name
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {editingUserId === user._id ? (
                            <input
                              type="email"
                              value={editForm?.email ?? ""}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev ? { ...prev, email: e.target.value } : prev
                                )
                              }
                              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingUserId === user._id ? (
                            <select
                              value={editForm?.role ?? "dentist"}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        role: e.target.value as EditValues["role"],
                                      }
                                    : prev
                                )
                              }
                              className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                            >
                              <option value="dentist">dentist</option>
                              <option value="receptionist">receptionist</option>
                            </select>
                          ) : (
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${roleClasses(user.role)}`}>
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {editingUserId === user._id ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => saveEdit(user._id)}
                                disabled={saving}
                                title="Save"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={cancelEdit}
                                title="Cancel"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end items-center gap-3">
                              <button
                                onClick={() => startEdit(user)}
                                disabled={user.role === "admin"}
                                title="Edit"
                                className="inline-flex h-7 w-7 items-center justify-center text-teal-600 hover:text-teal-700 disabled:opacity-40"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleResetPassword(user)}
                                disabled={resettingId === user._id}
                                title="Reset Password"
                                className="inline-flex h-7 w-7 items-center justify-center text-sky-600 hover:text-sky-700 disabled:opacity-50"
                              >
                                {resettingId === user._id ? (
                                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                ) : (
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 10-8 0v3H6a2 2 0 00-2 2v5a2 2 0 002 2h6m8-1v-3m0 0h-3m3 0l-3-3m3 3l-3 3" />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
                                disabled={deletingId === user._id || user.role === "admin"}
                                title="Delete"
                                className="inline-flex h-7 w-7 items-center justify-center text-red-500 hover:text-red-600 disabled:opacity-40"
                              >
                                {deletingId === user._id ? (
                                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                ) : (
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}