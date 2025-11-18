// src/services/quiz.api.ts
import http from "./http";
import { Quiz } from "@/types/quiz";

export async function getQuizzes() {
  const res = await http.get("/quizzes");
  return res.data; // expected { quizzes: Quiz[] }
}

export async function createQuiz(data: Quiz) {
  const res = await http.post("/quizzes", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data; // { quiz: Quiz }
}

export async function updateQuiz(id: string, data: Quiz) {
  const res = await http.put(`/quizzes/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data; // { quiz: Quiz }
}

export async function deleteQuiz(id: string) {
  const res = await http.delete(`/quizzes/${id}`);
  return res.data; // { success: boolean }
}
