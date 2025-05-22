import React from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await api.delete("/auth/delete");
      alert("회원 탈퇴 완료");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/signup");
    } catch (error) {
      console.error("회원 탈퇴 실패", error);
      alert("회원 탈퇴 실패");
    }
  };

  return (
    <div>
      <h2>정말 탈퇴하시겠습니까?</h2>
      <button onClick={handleDelete}>회원 탈퇴</button>
    </div>
  );
}
