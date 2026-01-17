type Appointment = {
  id: string;
  patientName: string;
  initials: string;
  procedure: string;
  time: string;
  duration: string;
  status: "Confirmed" | "In Progress" | "Pending";
};

export default function TodayAppointments() {
  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      initials: "SJ",
      procedure: "Teeth Cleaning",
      time: "09:00 AM",
      duration: "30 min",
      status: "Confirmed",
    },
    {
      id: "2",
      patientName: "Michael Chen",
      initials: "MC",
      procedure: "Root Canal",
      time: "10:30 AM",
      duration: "90 min",
      status: "In Progress",
    },
    {
      id: "3",
      patientName: "Emily Davis",
      initials: "ED",
      procedure: "Consultation",
      time: "12:00 PM",
      duration: "30 min",
      status: "Confirmed",
    },
    {
      id: "4",
      patientName: "James Wilson",
      initials: "JW",
      procedure: "Cavity Filling",
      time: "02:30 PM",
      duration: "45 min",
      status: "Pending",
    },
    {
      id: "5",
      patientName: "Lisa Anderson",
      initials: "LA",
      procedure: "Braces Adjustment",
      time: "04:00 PM",
      duration: "60 min",
      status: "Confirmed",
    },
  ];

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-teal-50 text-teal-600";
      case "In Progress":
        return "bg-blue-50 text-blue-600";
      case "Pending":
        return "bg-orange-50 text-orange-600";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Today's Appointments
          </h2>
          <p className="text-sm text-gray-400">December 11, 2025</p>
        </div>
        <button className="text-teal-600 text-sm font-medium hover:text-teal-700">
          View All
        </button>
      </div>

      <div className="space-y-0 mt-4">
        {appointments.map((appointment, index) => (
          <div
            key={appointment.id}
            className={`flex items-center justify-between py-4 hover:bg-gray-50 rounded-lg px-2 transition-colors group ${
              index !== appointments.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                {appointment.initials}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {appointment.patientName}
                </p>
                <p className="text-sm text-gray-400">{appointment.procedure}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-right">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.time}
                  </p>
                  <p className="text-xs text-gray-400">{appointment.duration}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-medium min-w-[90px] text-center ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
