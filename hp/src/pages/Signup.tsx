import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import api from "../api/axiosInstance";
import "../styles/AuthForm.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ 추가

  const handleSignup = async () => {
    try {
      await api.post("/auth/signup", {
        email,
        password,
      });
      alert("회원가입 성공!");
      navigate("/login"); // ✅ 로그인 페이지로 이동
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 실패");
    }
  };

  return (
    <div className="auth-container">
      <h2>회원가입</h2>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>회원가입</button>
    </div>
  );
}
