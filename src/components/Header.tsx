export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white shadow p-4">
      <h1 className="text-xl font-semibold text-gray-700">Dental Clinic System</h1>
      <button className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg">
        Logout
      </button>
    </header>
  );
}
