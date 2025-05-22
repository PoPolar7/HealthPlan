import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Link } from "react-router-dom";

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
      const res = await api.get("/posts");
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>📃 게시글 목록</h2>
      <Link to="/create-post">➕ 새 글 쓰기</Link>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/posts/${post._id}`}>
              {post.title} ({post.authorEmail}) -{" "}
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
