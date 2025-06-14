import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface ExerciseDetail {
  part: string;
  name: string;
  sets: number;
  reps: number;
  difficulty: string;
}

type RoutineMap = Record<string, ExerciseDetail[]>;

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const levelColor: Record<string, string> = {
  쉬움: "#FEF3C7",
  보통: "#FFE8B3",
  어려움: "#FFD6A5",
};

const textColor: Record<string, string> = {
  쉬움: "#CA8A04",
  보통: "#D97706",
  어려움: "#EA580C",
};

const difficultyMap: Record<string, string> = {
  하: "쉬움",
  중: "보통",
  상: "어려움",
};

const Container = styled.div`
  min-height: 100vh;
  background-color: white;
  padding: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  background-color: #f9fafb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
  cursor: pointer;
  &:hover {
    background-color: #f3f4f6;
  }
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

const Badge = styled.span<{ color: string; text: string }>`
  background-color: ${(props) => props.color};
  color: ${(props) => props.text};
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
`;

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const RoutinePreviewPage: React.FC = () => {
  const [routine, setRoutine] = useState<RoutineMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userEmail") || "";

  const groupByDay = (
    list: { day: string; exercises: ExerciseDetail[] }[]
  ): RoutineMap => {
    return list.reduce<RoutineMap>((acc, { day, exercises }) => {
      acc[day] = exercises;
      return acc;
    }, {});
  };

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchAndGenerateRoutine = async () => {
      try {
        // ✅ 루틴 생성 시도 (절대 경로로 복구)
        await axios.post("http://localhost:3000/routine", { userId });

        // ✅ 루틴 데이터 가져오기 (절대 경로로 복구)
        const res = await axios.get(
          `http://localhost:3000/routine/${encodeURIComponent(userId)}`
        );
        const data = res.data || [];

        if (data.length === 0) {
          alert("루틴이 없어요! 먼저 목표를 설정해주세요.");
          navigate("/goal-setting");
          return;
        }

        setRoutine(groupByDay(data));
      } catch (err: any) {
        if (err.response?.status === 404) {
          alert("목표나 신체정보가 없습니다. 목표를 먼저 설정해 주세요.");
          navigate("/goal-setting");
        } else {
          console.error("❌ 루틴 로딩 실패:", err);
          alert("루틴 로딩 중 오류 발생");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerateRoutine();
  }, [userId, navigate]);

  return (
    <Container>
      <HeaderWrapper>
        <HeaderButton onClick={() => navigate("/")}>홈페이지</HeaderButton>
        <HeaderButton onClick={() => navigate("/dashboard")}>
          대시보드
        </HeaderButton>
        <HeaderButton onClick={() => navigate("/posts")}>커뮤니티</HeaderButton>
        <HeaderButton onClick={() => navigate("/mypage")}>
          마이페이지
        </HeaderButton>
      </HeaderWrapper>

      <Title>루틴 미리보기</Title>

      {loading ? (
        <p style={{ textAlign: "center", color: "#9CA3AF" }}>로딩 중...</p>
      ) : (
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          {weekdays.map((day) => (
            <Card
              key={day}
              onClick={() => {
                const exercises = routine[day];
                if (exercises?.length > 0) {
                  navigate("/routine-edit", {
                    state: { day, exercises },
                  });
                }
              }}
            >
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                {day}
              </h2>
              {routine[day] && routine[day].length > 0 ? (
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {routine[day].map((item, idx) => {
                    const translated = difficultyMap[item.difficulty] || "쉬움";
                    return (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 500, color: "#374151" }}>
                            {item.part}
                          </p>
                          <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                            {item.name} ({item.sets}세트 × {item.reps}회)
                          </p>
                        </div>
                        <Badge
                          color={levelColor[translated]}
                          text={textColor[translated]}
                        >
                          {translated}
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p style={{ color: "#9CA3AF" }}>휴식</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default RoutinePreviewPage;
