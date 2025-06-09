import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header>
      <Link to="/">홈</Link>
      {isLoggedIn ? null : <Link to="/login">로그인</Link>}
    </header>
  );
}
