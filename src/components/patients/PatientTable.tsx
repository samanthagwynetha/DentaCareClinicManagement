"use client";

import type { Patient } from "./types";

type Props = {
  patients: Patient[];
  loading: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
};

export default function PatientTable({ patients, loading, onEdit, onDelete }: Props) {
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

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full table-auto">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 w-16">#</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Name</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Contact</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Gender</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Birth Date</th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 w-32">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient, index) => (
            <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
