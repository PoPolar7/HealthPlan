import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Link } from "react-router-dom";
import "../styles/Community.css";

interface Post {
  _id: string;
  title: string;
  authorEmail: string;
  createdAt: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("게시글 로딩 오류:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="post-list-container">
      <h2>📃 게시글 목록</h2>
      <Link className="new-post-link" to="/create-post">
        ➕ 새 글 쓰기
      </Link>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/posts/${post._id}`}>
              {post.title} ({post.authorEmail}) - {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}