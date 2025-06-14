import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

interface Exercise {
  name: string;
  part: string;
  description: string;
  isCompleted: boolean;
}

interface RelatedExercise {
  name: string;
  isCompleted: boolean;
}

const Container = styled.div`
  padding: 1.5rem;
  background: white;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Badge = styled.button`
  background-color: #2563eb;
  color: white;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  margin-bottom: 1rem;
  color: #4b5563;
`;

const YoutubeLink = styled.a`
  display: block;
  background-color: #fee2e2;
  border: 1px solid #f87171;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  color: #b91c1c;
  font-weight: 600;
  transition: background-color 0.2s;
  margin-bottom: 1.5rem;
  &:hover {
    background-color: #fecaca;
  }
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const RelatedCard = styled(Link)`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
`;

const CompleteButton = styled.button`
  width: 100%;
  background-color: #2563eb;
  color: white;
  padding: 0.75rem;
  font-weight: 600;
  border-radius: 1rem;
`;

const ExerciseDetailPage: React.FC = () => {
  const [params] = useSearchParams();
  const name = params.get("name");
  const partParam = params.get("part");
  const userId = localStorage.getItem("userEmail") || "";

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [related, setRelated] = useState<RelatedExercise[]>([]);

  useEffect(() => {
    if (!name) return;

    axios
      .get<Exercise>("http://localhost:3000/routine/exercise-info", {
        params: { name, userId },
      })
      .then((res) => {
        const ex = res.data;
        setExercise(ex);

        const partToUse = partParam || ex.part;
        if (!partToUse) return;

        axios
          .get<RelatedExercise[]>(
            `http://localhost:3000/routine/exercise-list/Normal/${encodeURIComponent(
              partToUse
            )}/중`,
            { params: { userId } }
          )
          .then((r) => {
            const filtered = r.data.filter(
              (e) => e.name !== name && !e.isCompleted
            );
            setRelated(filtered);
          })
          .catch((err) => {
            console.error("❌ 관련 운동 목록 로딩 실패:", err);
          });
      })
      .catch((err) => {
        console.error("❌ 운동 정보 로딩 실패:", err);
      });
  }, [name, partParam, userId]);

  const handleComplete = async (): Promise<void> => {
    if (!name) return;
    try {
      await axios.post("http://localhost:3000/routine/complete", {
        userId,
        name,
        date: new Date().toISOString().split("T")[0],
      });
      setExercise((prev) => (prev ? { ...prev, isCompleted: true } : prev));
    } catch (err) {
      console.error("❌ 운동 완료 실패:", err);
    }
  };

  if (!exercise) {
    return <Container>로딩 중이거나 운동 정보를 찾을 수 없습니다.</Container>;
  }

  const partToShow = partParam || exercise.part;

  return (
    <Container>
      <Title>{exercise.name}</Title>
      <Badge>{partToShow}</Badge>
      <Description>{exercise.description}</Description>

      <YoutubeLink
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
          exercise.name
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        🎬 유튜브에서 "{exercise.name}" 검색
      </YoutubeLink>

      <RelatedGrid>
        {related.map((ex, idx) => (
          <RelatedCard
            to={`/exercise-detail?name=${encodeURIComponent(
              ex.name
            )}&part=${encodeURIComponent(partToShow)}`}
            key={idx}
          >
            <p style={{ fontWeight: 700 }}>{ex.name}</p>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{partToShow}</p>
          </RelatedCard>
        ))}
      </RelatedGrid>

      {exercise.isCompleted ? (
        <div style={{ color: "#16a34a", textAlign: "center", fontWeight: 600 }}>
          ✅ 이미 완료된 운동입니다
        </div>
      ) : (
        <CompleteButton onClick={handleComplete}>운동 완료</CompleteButton>
      )}
    </Container>
  );
};

export default ExerciseDetailPage;
