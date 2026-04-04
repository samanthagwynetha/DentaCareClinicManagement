"use client";
import { User } from "./types";

type Props = {
  user: User;
  deletingId: string | null;
  error: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteStaffModal({ user, deletingId, error, onConfirm, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Delete Staff Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Delete <span className="font-medium text-gray-700">{user.name}</span>&apos;s account? This cannot be undone.
          </p>
        </div>
        <div className="px-6 py-5">
          {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={deletingId === user._id}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deletingId === user._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
