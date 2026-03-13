export type InvoicePatient = {
  _id: string;
  firstName: string;
  lastName: string;
};

export type InvoiceService = {
  name: string;
  price: number;
};

export type Invoice = {
  _id: string;
  patient: InvoicePatient;
  appointment?: string;
  services: InvoiceService[];
  totalAmount: number;
  status: "paid" | "unpaid" | "overdue" | "pending";
  paymentMethod?: "cash" | "gcash" | "card";
  issuedDate: string;
  dueDate?: string;
};
