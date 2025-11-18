// src/hooks/useQuizzes.ts
import { useEffect, useState } from "react";
import {
  createQuiz,
  deleteQuiz,
  getQuizzes,
  updateQuiz,
} from "../services/quiz.api";
import { Quiz } from "../types/quiz";

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);

  // Load quizzes
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getQuizzes();
        setQuizzes(res.quizzes ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Add quiz
  async function addQuiz(data: Quiz) {
    const res = await createQuiz(data);
    setQuizzes((prev) => [...prev, res.quiz]);
  }

  // ✅ Update quiz
  async function editQuiz(id: string, data: Quiz) {
    const res = await updateQuiz(id, data);
    setQuizzes((prev) => prev.map((q) => (q._id === id || q.id === id ? res.quiz : q)));
  }

  // ✅ Delete quiz
  async function removeQuiz(id: string) {
    await deleteQuiz(id);
    setQuizzes((prev) => prev.filter((q) => q._id !== id && q.id !== id));
  }

  return { quizzes, loading, addQuiz, editQuiz, removeQuiz };
}
