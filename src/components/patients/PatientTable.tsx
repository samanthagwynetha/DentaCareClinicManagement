"use client";

import { useState } from "react";
import type { Patient } from "./types";

type Props = {
  patients: Patient[];
  loading: boolean;
  role?: string | null;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
};

export default function PatientTable({ patients, loading, role, onEdit, onDelete }: Props) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-8 text-center text-gray-500">
          Loading patients...
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-8 text-center text-gray-500">
          No patients found
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(patients.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, patients.length);
  const visiblePatients = patients.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 w-16">#</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Contact</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Gender</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Birth Date</th>
              {role !== "dentist" && (
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 w-32">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visiblePatients.map((patient, index) => (
              <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500">{startIndex + index + 1}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{patient.phone || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{patient.gender || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {patient.birthDate
                    ? new Date(patient.birthDate).toLocaleDateString()
                    : "N/A"}
                </td>
                {role !== "dentist" && (
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(patient)}
                      className="text-teal-500 hover:text-teal-700 mr-3 transition-colors inline-flex"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    {role === "admin" && (
                      <button
                        onClick={() => onDelete(patient)}
                        className="text-red-500 hover:text-red-700 transition-colors inline-flex"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between mt-4 px-1">
        {/* Left: rows per page + count */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>
            Showing {patients.length === 0 ? 0 : startIndex + 1}–{endIndex} of {patients.length}
          </span>
        </div>

        {/* Right: page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={safePage === 1}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={safePage === totalPages}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
