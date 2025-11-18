export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  phone?: string;
  photo?: string | { url: string };
  status?: "Active" | "Inactive";
  courses?: {
    selectedCourse: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
