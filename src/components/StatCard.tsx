type StatCardProps = {
  title: string;
  value: number | string;
  change?: string;
  changeType?: "increase" | "decrease";
  icon: React.ReactNode;
  iconBg: string;
};

export default function StatCard({
  title,
  value,
  change,
  changeType = "increase",
  icon,
  iconBg,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {change && (
            <p
              className={`text-sm font-medium ${
                changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}
            >
              {changeType === "increase" ? "+" : "-"}
              {change}
            </p>
          )}
        </div>
        <div className={`${iconBg} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}
