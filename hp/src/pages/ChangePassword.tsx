import React, { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    try {
      await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      alert("비밀번호 변경 완료. 다시 로그인해주세요.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error) {
      console.error("비밀번호 변경 실패", error);
      alert("비밀번호 변경 실패");
    }
  };

  return (
    <div>
      <h2>비밀번호 변경</h2>
      <input
        type="password"
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>변경하기</button>
    </div>
  );
}
