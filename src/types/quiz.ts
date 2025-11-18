// src/types/quiz.ts

export type Question = {
  type: "mcq" | "short";
  question: string;
  answer: string;
  choices?: string[];
};

export type Quiz = {
  id?: string; // keep your id
  _id?: string; // in case backend sends Mongo _id
  title: string;
  description: string;
  validTill: string;
  totalMarks: number;
  allowMultiple: boolean;
  file?: File | null; // keep file support
  questions: Question[];
};