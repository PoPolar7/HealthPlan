import React, { useState } from "react";
import api from "../api/axiosInstance";
import "../styles/AuthForm.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      await api.post("http://localhost:3000/auth/forgot-password", { email });
      alert("임시 비밀번호를 이메일로 전송했습니다!");
    } catch (error) {
      console.error("비밀번호 찾기 실패:", error);
      alert("비밀번호 찾기에 실패했습니다.");
    }
  };

  return (
    <div className="auth-container">
      <h2>비밀번호 찾기</h2>
      <input
        type="email"
        placeholder="이메일을 입력하세요"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>비밀번호 찾기</button>
    </div>
  );
}
