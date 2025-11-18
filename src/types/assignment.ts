export type QuestionType = "short" | "mcq";

export interface Question {
  type: QuestionType;
  question: string;
  answer: string;
  options?: string[];
}

export interface Assignment {
  _id?: string;
  title: string;
  description?: string;
  dueDate: string;
  file?: string;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignmentResponse {
  message: string;
  assignment: Assignment;
}

export interface AssignmentsListResponse {
  assignments: Assignment[];
}
