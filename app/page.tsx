import React from "react";
import LoginPage from "./auth/login/page";
import AuthLayout from "./auth/layout";

export default function Home() {
  return (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  );
}
