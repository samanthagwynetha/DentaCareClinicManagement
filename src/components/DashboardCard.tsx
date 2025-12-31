type DashboardCardProps = {
  title: string;
  value: number | string;
};

export default function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
