import { Appointment, DAYS, TIME_SLOTS } from "./types";

type Props = {
  appointments: Appointment[];
  loading: boolean;
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDay(dateStr: string): string {
  return DAY_NAMES[new Date(dateStr).getDay()];
}

function getAppointments(appointments: Appointment[], day: string, slotTime: string) {
  return appointments.filter((a) => {
    if (getDay(a.date) !== day) return false;
    const m = a.time.match(/^(\d+):\d+\s*(AM|PM)$/i);
    const normalized = m ? `${m[1]}:00 ${m[2].toUpperCase()}` : a.time;
    return normalized === slotTime;
  });
}

function shortName(first: string, last: string) {
  return `${first.split(" ")[0]} ${last.charAt(0)}.`;
}

function getWeekLabel(): string {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const diffToMon = day === 0 ? -6 : 1 - day;
  const mon = new Date(today);
  mon.setDate(today.getDate() + diffToMon);
  const sat = new Date(mon);
  sat.setDate(mon.getDate() + 5);
  if (mon.getMonth() === sat.getMonth()) {
    return `Week of ${mon.toLocaleDateString("en-US", { month: "long" })} ${mon.getDate()}-${sat.getDate()}, ${sat.getFullYear()}`;
  }
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `Week of ${fmt(mon)} - ${fmt(sat)}`;
}

export default function AppointmentCalendar({ appointments, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-400">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Week label */}
      <div className="px-6 py-4">
        <p className="font-bold text-gray-900 text-lg">{getWeekLabel()}</p>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-40 py-3 px-6 text-gray-500 font-medium text-right border-b border-gray-200">
                Time
              </th>
              {DAYS.map((day) => (
                <th key={day} className="py-3 px-3 border-b border-gray-200">
                  <span className="inline-block bg-gray-100 text-gray-700 font-semibold text-sm rounded-lg px-6 py-1.5 w-full text-center">
                    {day}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((time) => (
              <tr key={time} className="border-b border-gray-100">
                <td className="py-5 px-6 text-gray-400 font-medium whitespace-nowrap text-right align-middle">
                  {time}
                </td>
                {DAYS.map((day) => {
                  const appts = getAppointments(appointments, day, time);
                  return (
                    <td key={day} className="py-2 px-3 h-16 align-top pt-2">
                      <div className="flex flex-col gap-1">
                        {appts.map((appt) => (
                          <div key={appt._id} className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-colors text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap shadow-sm inline-block w-full">
                            {shortName(appt.patient.firstName, appt.patient.lastName)}
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
