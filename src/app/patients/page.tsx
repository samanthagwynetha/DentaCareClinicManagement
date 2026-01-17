"use client";
import { useRoleGuard } from "@/utils/roleGuard";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PatientForm, { PatientFormValues } from "@/components/patients/PatientForm";
import PatientTable from "@/components/patients/PatientTable";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Patient } from "@/components/patients/types";
import { apiFetch } from "@/lib/api";

export default function Patients() {
  useRoleGuard(["dentist", "receptionist", "admin"]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Dummy data
  const dummyPatients: Patient[] = [
    {
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      birthDate: "1990-05-15",
      phone: "0912-345-6789",
      email: "john.doe@example.com",
      address: "123 Main St",
    },
    {
      _id: "2",
      firstName: "Jane",
      lastName: "Cruz",
      gender: "Female",
      birthDate: "1985-08-22",
      phone: "0906-789-1234",
      email: "jane.cruz@example.com",
      address: "456 Oak Ave",
    },
    {
      _id: "3",
      firstName: "Michael",
      lastName: "Santos",
      gender: "Male",
      birthDate: "1992-03-10",
      phone: "0917-456-7890",
      email: "michael.santos@example.com",
      address: "789 Pine Rd",
    },
    {
      _id: "4",
      firstName: "Sarah",
      lastName: "Garcia",
      gender: "Female",
      birthDate: "1988-11-30",
      phone: "0923-678-9012",
      email: "sarah.garcia@example.com",
      address: "321 Elm St",
    },
    {
      _id: "5",
      firstName: "Robert",
      lastName: "Chen",
      gender: "Male",
      birthDate: "1995-07-18",
      phone: "0935-234-5678",
      email: "robert.chen@example.com",
      address: "654 Maple Dr",
    },
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setError("");
    try {
      const data = await apiFetch<Patient[]>("/api/patients");
      // Use backend data if available, otherwise use dummy data
      setPatients(Array.isArray(data) && data.length > 0 ? data : dummyPatients);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      // Use dummy data on error
      setPatients(dummyPatients);
      setLoading(false);
    }
  };

  const handleCreate = async (values: PatientFormValues) => {
    setSubmitting(true);
    setError("");
    try {
      await apiFetch("/api/patients", {
        method: "POST",
        body: JSON.stringify(values),
      });
      await fetchPatients();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating patient:", error);
      setError(error instanceof Error ? error.message : "Failed to create patient.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values: PatientFormValues) => {
    if (!editing) return;
    setSubmitting(true);
    setError("");
    try {
      await apiFetch(`/api/patients/${editing._id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });
      setEditing(null);
      await fetchPatients();
    } catch (error) {
      console.error("Error updating patient:", error);
      setError(error instanceof Error ? error.message : "Failed to update patient.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (patient: Patient) => {
    setPatientToDelete(patient);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;

    setError("");
    try {
      await apiFetch(`/api/patients/${patientToDelete._id}`, {
        method: "DELETE",
      });
      await fetchPatients();
      setPatientToDelete(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
      setError(error instanceof Error ? error.message : "Failed to delete patient.");
      setPatientToDelete(null);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditing(patient);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditing(null);
    setError("");
  };

  const filteredPatients = Array.isArray(patients)
    ? patients.filter((patient) =>
        `${patient.firstName} ${patient.lastName} ${patient.phone} ${patient.email}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>Home</span>
                <span className="mx-2">›</span>
                <span className="text-gray-900">Patients</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>
              <p className="text-gray-600 mt-1">Manage patient records and information</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              {/* <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients, appointments..."
                  className="w-64 pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-600"
                />
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div> */}

              {/* Calendar Icon */}
              <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>

              {/* Notifications */}
              <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors relative">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Vertical Divider */}
              <div className="h-10 w-px bg-gray-300"></div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                  DA
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">Dr. Anderson</p>
                  <p className="text-xs text-gray-500">General Dentist</p>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Divider with spacing */}
          <div className="w-full h-px bg-gray-200 my-6"></div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search patients by name or contact..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-teal-500 text-white px-5 py-2.5 rounded-lg hover:bg-teal-600 flex items-center transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Patient
              </button>
            </div>

            <PatientTable
              patients={filteredPatients}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <div className="px-1 py-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {filteredPatients.length} of {patients.length} patients
              </p>
            </div>
          </div>

          {/* Add Patient Form Modal */}
          {showForm && (
            <PatientForm
              mode="create"
              onSubmit={handleCreate}
              onCancel={handleCancelForm}
              submitting={submitting}
            />
          )}

          {/* Edit Patient Form Modal */}
          {editing && (
            <PatientForm
              mode="edit"
              initial={editing}
              onSubmit={handleUpdate}
              onCancel={handleCancelForm}
              submitting={submitting}
            />
          )}

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={!!patientToDelete}
            title="Delete Patient"
            message={
              patientToDelete
                ? `Are you sure you want to delete ${patientToDelete.firstName} ${patientToDelete.lastName}? This action cannot be undone.`
                : ""
            }
            onConfirm={confirmDelete}
            onCancel={() => setPatientToDelete(null)}
            confirmText="Delete"
            cancelText="Cancel"
            isDestructive={true}
          />
        </main>
      </div>
    </div>
  );
}
