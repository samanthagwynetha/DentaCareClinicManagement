type Patient = {
  id: string;
  name: string;
  initials: string;
  lastVisit: string;
  nextAppointment?: string;
  bgColor: string;
};

export default function RecentPatients() {
  const patients: Patient[] = [
    {
      id: "1",
      name: "Amanda Roberts",
      initials: "AR",
      lastVisit: "Dec 10, 2025",
      nextAppointment: "Dec 18, 2025",
      bgColor: "bg-teal-100",
    },
    {
      id: "2",
      name: "Robert Martinez",
      initials: "RM",
      lastVisit: "Dec 6, 2025",
      nextAppointment: "Jan 5, 2026",
      bgColor: "bg-cyan-100",
    },
    {
      id: "3",
      name: "Jennifer Lee",
      initials: "JL",
      lastVisit: "Dec 8, 2025",
      bgColor: "bg-blue-100",
    },
    {
      id: "4",
      name: "David Thompson",
      initials: "DT",
      lastVisit: "Dec 7, 2025",
      nextAppointment: "Dec 20, 2025",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
        <button className="text-teal-600 text-sm font-medium hover:text-teal-700">
          View All
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Latest patient activity</p>

      <div className="space-y-3">
        {patients.map((patient) => (
          <div 
            key={patient.id} 
            className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full ${patient.bgColor} flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0`}
              >
                {patient.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">
                  {patient.name}
                </p>
                <p className="text-xs text-gray-500">
                  Last visit: {patient.lastVisit}
                </p>
                {patient.nextAppointment && (
                  <p className="text-xs text-gray-900 mt-1">
                    Next appointment: <span className="font-medium">{patient.nextAppointment}</span>
                  </p>
                )}
              </div>
              
              {/* Hover Icons */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button className="w-9 h-9 bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="w-9 h-9 bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
