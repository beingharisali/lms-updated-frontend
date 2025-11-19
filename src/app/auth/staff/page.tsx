"use client";
import AuthForm from "../../../components/forms/AuthForm";

export default function Page() {
  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-white">
        <AuthForm
          title="Staff Sign In"
          role="staff"
          forgotPasswordLink="/staff/forgot-password"
        />
      </div>
    </>
  );
}
