export type Patient = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
};

export type DentistUser = {
  _id: string;
  name: string;
};

export type Appointment = {
  _id: string;
  patient: Patient;
  dentist: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

export const BOOKING_SLOTS = [
  "9:00 AM",  "9:15 AM",  "9:30 AM",  "9:45 AM",
  "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
  "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
  "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
  "1:00 PM",  "1:15 PM",  "1:30 PM",  "1:45 PM",
  "2:00 PM",  "2:15 PM",  "2:30 PM",  "2:45 PM",
  "3:00 PM",  "3:15 PM",  "3:30 PM",  "3:45 PM",
  "4:00 PM",
];

