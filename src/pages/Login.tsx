import React, { useState } from "react";
import api from "../api/axiosInstance";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const token = res.data.accessToken;
      localStorage.setItem("accessToken", token); // 토큰 저장
      alert("로그인 성공!");
      window.location.href = "/"; // 로그인 후 메인으로 이동
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패");
    }
  };

  return (
    <div>
      <h2>로그인</h2>
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
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}
