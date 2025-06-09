import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../styles/MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      try {
        await api.delete("/auth/delete");
        localStorage.clear();
        alert("회원 탈퇴 완료");
        navigate("/signup");
      } catch (e) {
        console.error("회원 탈퇴 실패", e);
        alert("탈퇴 실패");
      }
    }
  };

  return (
    <div className="mypage-container">
      <h1>My Page</h1>

      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={() => navigate("/edit-goal")}>목표 수정</button>
      <button onClick={() => navigate("/change-password")}>
        비밀번호 변경
      </button>
      <button onClick={() => navigate("/edit-body")}>신체정보 수정</button>

      <button className="delete-account" onClick={handleDeleteAccount}>
        회원 탈퇴
      </button>
    </div>
  );
}
