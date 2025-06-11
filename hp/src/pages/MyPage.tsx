import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../api/axiosInstance";
import "../styles/MyPage.css";

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderButton = styled.button`
  background-color: transparent;
  color: #111827;
  font-weight: 600;
  margin-left: 1rem;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    text-decoration: underline;
  }
`;

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
      <HeaderWrapper>
        <HeaderButton onClick={() => navigate("/")}>홈페이지</HeaderButton>
        <HeaderButton onClick={() => navigate("/dashboard")}>대시보드</HeaderButton>
        <HeaderButton onClick={() => navigate("/posts")}>커뮤니티</HeaderButton>
     
      </HeaderWrapper>

      <h1>My Page</h1>

      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={() => navigate("/goal-edit")}>목표 수정</button>
      <button onClick={() => navigate("/change-password")}>비밀번호 변경</button>
      <button onClick={() => navigate("/body-edit")}>신체정보 수정</button>
      <button className="delete-account" onClick={handleDeleteAccount}>
        회원 탈퇴
      </button>
    </div>
  );
}
