export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to Dental Clinic Management System
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Patients</h2>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Appointments</h2>
          <p className="text-gray-600">Schedule and manage appointments</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Billing</h2>
          <p className="text-gray-600">Handle invoices and payments</p>
        </div>
      </div>
    </div>
  );
}
