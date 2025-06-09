import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../styles/AuthForm.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("userEmail", email);
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그인 실패", error);
      alert("이메일 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    <div className="auth-container">
      <div className="login-container">
        <h2>로그인</h2>
        <input
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>

        <p style={{ marginTop: "10px" }}>
          비밀번호를 잊으셨나요?{" "}
          <span
            style={{ color: "#1d4ed8", cursor: "pointer" }}
            onClick={() => navigate("/forgot-password")}
          >
            비밀번호 찾기
          </span>
        </p>
      </div>
    </div>
  );
}
