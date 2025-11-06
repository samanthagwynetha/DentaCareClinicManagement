import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-5">
      <h2 className="text-lg font-semibold mb-6">Menu</h2>
      <nav className="flex flex-col space-y-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/patients">Patients</Link>
        <Link href="/appointments">Appointments</Link>
        <Link href="/billing">Billing</Link>
      </nav>
    </aside>
  );
}
