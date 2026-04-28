import { Appointment, TIME_SLOTS } from "./types";

type Props = {
  appointments: Appointment[];
  loading: boolean;
};

/** Returns the Mon–Sat Date objects for the current week */
function getCurrentWeekDays(): Date[] {
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon, ...
  const diffToMon = day === 0 ? 1 : 1 - day; // push Sun forward to next Mon
  const mon = new Date(today);
  mon.setHours(0, 0, 0, 0);
  mon.setDate(today.getDate() + diffToMon);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

/** Format a Date as YYYY-MM-DD to compare with appointment.date */
function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

/** "Mon", "Tue", ... */
function formatHeader(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function getWeekLabel(days: Date[]): string {
  const mon = days[0];
  const sat = days[5];
  if (mon.getMonth() === sat.getMonth()) {
    return `Week of ${mon.toLocaleDateString("en-US", { month: "long" })} ${mon.getDate()}–${sat.getDate()}, ${sat.getFullYear()}`;
  }
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `Week of ${fmt(mon)} – ${fmt(sat)}`;
}

function getAppointmentsForCell(
  appointments: Appointment[],
  date: Date,
  slotTime: string
): Appointment[] {
  const dateStr = toDateStr(date);
  return appointments.filter((a) => {
    // Normalise stored date to YYYY-MM-DD
    const apptDate = a.date.split("T")[0];
    if (apptDate !== dateStr) return false;
    const m = a.time.match(/^(\d+):\d+\s*(AM|PM)$/i);
    const normalized = m ? `${m[1]}:00 ${m[2].toUpperCase()}` : a.time;
    return normalized === slotTime;
  });
}

function shortName(first: string, last: string) {
  return `${first.split(" ")[0]} ${last.charAt(0)}.`;
}

export default function AppointmentCalendar({ appointments, loading }: Props) {
  const weekDays = getCurrentWeekDays();

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
        <p className="font-bold text-gray-900 text-lg">{getWeekLabel(weekDays)}</p>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-40 py-3 px-6 text-gray-500 font-medium text-right border-b border-gray-200">
                Time
              </th>
              {weekDays.map((day) => (
                <th key={toDateStr(day)} className="py-3 px-3 border-b border-gray-200">
                  <span className="inline-block bg-gray-100 text-gray-700 font-semibold text-sm rounded-lg px-6 py-1.5 w-full text-center">
                    {formatHeader(day)}
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
                {weekDays.map((day) => {
                  const appts = getAppointmentsForCell(appointments, day, time);
                  return (
                    <td key={toDateStr(day)} className="py-2 px-3 h-16 align-top pt-2">
                      <div className="flex flex-col gap-1">
                        {appts.map((appt) => (
                          <div
                            key={appt._id}
                            className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-colors text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap shadow-sm inline-block w-full"
                          >
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

