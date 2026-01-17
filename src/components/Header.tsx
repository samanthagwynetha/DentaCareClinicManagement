import LogoutButton from "./LogoutButton";

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white shadow p-4">
      <h1 className="text-xl font-semibold text-gray-700">Dental Clinic System</h1>
      {/* <LogoutButton /> */}
    </header>
  );
}
