import React, { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/Community.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post("/posts", { title, content });
      alert("작성 완료!");
      navigate("/posts");
    } catch (error) {
      alert("작성 실패");
      console.error(error);
    }
  };

  return (
    <div className="create-post-container">
      <h2>✍️ 게시글 작성</h2>
      <input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>작성하기</button>
    </div>
  );
}
