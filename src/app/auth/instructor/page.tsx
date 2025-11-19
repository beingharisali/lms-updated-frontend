"use client";
import AuthForm from "../../../components/forms/AuthForm";

export default function Page() {
  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-white">
        <AuthForm
          title="Instructor Sign In"
          role="instructor"
          forgotPasswordLink="/instructor/forgot-password"
        />
      </div>
    </>
  );
}
