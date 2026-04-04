export type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "dentist" | "receptionist";
  phone?: string;
};

export type FormValues = {
  name: string;
  email: string;
  password: string;
  role: "dentist" | "receptionist";
  phone: string;
};

export type EditValues = {
  name: string;
  email: string;
  role: "dentist" | "receptionist";
  phone: string;
};

export function roleClasses(role: User["role"]) {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-700";
    case "dentist":
      return "bg-teal-100 text-teal-700";
    case "receptionist":
    default:
      return "bg-blue-100 text-blue-700";
  }
}
