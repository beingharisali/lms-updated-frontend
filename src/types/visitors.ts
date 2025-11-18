export interface Visitor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  staffId: string;
  phone?: string;
  role?: string;
  status?: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}
