"use client";
import AuthForm from "../../../components/forms/AuthForm";

export default function Page() {
  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-white">
        <AuthForm
          title="Student Sign In"
          role="student"
          forgotPasswordLink="/student/forgot-password"
        />
      </div>
    </>
  );
}
