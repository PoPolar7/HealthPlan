import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../styles/Community.css";

interface Reply {
  email: string;
  comment: string;
  createdAt: string;
}

interface Comment {
  email: string;
  comment: string;
  createdAt: string;
  replies?: Reply[];
}

interface Post {
  _id: string;
  title: string;
  content: string;
  authorEmail: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [voted, setVoted] = useState<"like" | "dislike" | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
      setNewTitle(res.data.title);
      setNewContent(res.data.content);
      setComments(res.data.comments ?? []);
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      const email = localStorage.getItem("userEmail");
      const voter = res.data.voters?.find((v: any) => v.email === email);
      if (voter) setVoted(voter.vote);
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await api.delete(`/posts/${id}`);
      alert("삭제 완료");
      navigate("/posts");
    }
  };

  const handleUpdate = async () => {
    await api.patch(`/posts/${id}`, {
      title: newTitle,
      content: newContent,
    });
    alert("수정 완료");
    setEditing(false);
    setPost((prev) =>
      prev ? { ...prev, title: newTitle, content: newContent } : null
    );
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return alert("댓글을 입력하세요");
    const res = await api.patch(`/posts/${id}/comments`, { comment });
    setComments(res.data.comments);
    setComment("");
  };

  const handleDeleteComment = async (createdAt: string) => {
    const res = await api.delete(`/posts/${id}/comments`, {
      data: { createdAt },
    });
    setComments(res.data.comments);
  };

  const handleAddReply = async (commentIndex: number, replyText: string) => {
    try {
      const userEmail = localStorage.getItem("userEmail") || "익명";
      const res = await api.patch(
        `/posts/${id}/comments/${commentIndex}/replies`,
        {
          email: userEmail,
          comment: replyText,
        }
      );
      setComments((prev) => {
        const newComments = [...prev];
        newComments[commentIndex] = res.data;
        return newComments;
      });
      setReplyInputs((prev) => ({ ...prev, [commentIndex]: "" }));
    } catch (error) {
      console.error("답글 등록 실패", error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await api.patch(`/posts/${id}/like`);
      if (!res.data.voted) return;
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setVoted(res.data.voteType);
    } catch (e) {
      console.error("좋아요 실패", e);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await api.patch(`/posts/${id}/dislike`);
      if (!res.data.voted) return;
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setVoted(res.data.voteType);
    } catch (e) {
      console.error("싫어요 실패", e);
    }
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <div className="post-detail-container">
      <h2>📄 게시글 상세</h2>
      {editing ? (
        <>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <br />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <br />
          <button onClick={handleUpdate}>저장</button>
          <button onClick={() => setEditing(false)}>취소</button>
        </>
      ) : (
        <>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>
            작성자: {post.authorEmail} <br />
            작성일: {new Date(post.createdAt).toLocaleString()}
          </p>
          <div>
            <button onClick={handleLike} disabled={voted !== null}>
              👍 좋아요 ({likes})
            </button>
            <button onClick={handleDislike} disabled={voted !== null}>
              👎 싫어요 ({dislikes})
            </button>
          </div>

          <button onClick={() => setEditing(true)}>수정</button>
          <button onClick={handleDelete}>삭제</button>

          <hr />
          <h3>💬 댓글</h3>
          {comments.map((c, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid #ccc", marginBottom: "8px" }}
            >
              <p>{c.comment}</p>
              <small>
                {c.email} | {new Date(c.createdAt).toLocaleString()}
              </small>
              <br />
              <button onClick={() => handleDeleteComment(c.createdAt)}>
                삭제
              </button>

              {c.replies?.map((r, j) => (
                <div
                  key={j}
                  style={{
                    marginLeft: "20px",
                    borderLeft: "2px solid #ddd",
                    paddingLeft: "8px",
                  }}
                >
                  <p>{r.comment}</p>
                  <small>
                    {r.email} | {new Date(r.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}

              <div style={{ marginLeft: "20px", marginTop: "4px" }}>
                <input
                  placeholder="답글 입력"
                  value={replyInputs[i] || ""}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({
                      ...prev,
                      [i]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => handleAddReply(i, replyInputs[i] || "")}>
                  답글 등록
                </button>
              </div>
            </div>
          ))}

          <input
            placeholder="댓글 입력"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleAddComment}>댓글 등록</button>
        </>
      )}
    </div>
  );
}
