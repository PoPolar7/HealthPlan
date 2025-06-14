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
  쉬움: "#fef3c7",
  보통: "#fde68a",
  어려움: "#fdba74",
};

const levelText: Record<string, string> = {
  쉬움: "#ca8a04",
  보통: "#d97706",
  어려움: "#c2410c",
};

const difficultyMap: Record<string, string> = {
  하: "쉬움",
  중: "보통",
  상: "어려움",
};

const Page = styled.div`
  min-height: 100vh;
  background-color: white;
  padding: 1.5rem;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const RoutineContainer = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DayCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const DayTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ExerciseList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ExerciseItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ExerciseInfo = styled.div`
  text-align: left;
`;

const Part = styled.p`
  font-weight: 500;
  color: #374151;
`;

const Name = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const LevelBadge = styled.span<{ level: string }>`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  background-color: ${(props) => levelColor[props.level] || "#f3f4f6"};
  color: ${(props) => levelText[props.level] || "#6b7280"};
`;

const EmptyText = styled.p`
  color: #9ca3af;
`;

const ButtonWrap = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 1rem;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const RecommendationPage: React.FC = () => {
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
    const fetchRoutine = async () => {
      try {
        const res = await axios.get<
          { day: string; exercises: ExerciseDetail[] }[]
        >(`http://localhost:3000/routine/${userId}`);

        const data = res.data || [];

        if (data.length === 0) {
          const createRes = await axios.post<{
            routine: Record<string, ExerciseDetail[]>;
          }>(`http://localhost:3000/routine`, { userId });
          const days = createRes.data.routine || {};
          const transformed = Object.entries(days).map(([day, exercises]) => ({
            day,
            exercises,
          }));
          setRoutine(groupByDay(transformed));
        } else {
          setRoutine(groupByDay(data));
        }
      } catch (err) {
        console.error("❌ 루틴 데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
  }, [userId]);

  return (
    <Page>
      <Title>추천 운동 루틴이 완성되었습니다.</Title>

      {loading ? (
        <EmptyText style={{ textAlign: "center" }}>로딩 중...</EmptyText>
      ) : Object.keys(routine).length === 0 ? (
        <EmptyText style={{ textAlign: "center", color: "red" }}>
          ❗ 루틴 데이터가 없습니다.
        </EmptyText>
      ) : (
        <RoutineContainer>
          {weekdays.map((day) => (
            <DayCard key={day}>
              <DayTitle>{day}</DayTitle>
              {routine[day] && routine[day].length > 0 ? (
                <ExerciseList>
                  {routine[day].map((item, idx) => {
                    const translated = difficultyMap[item.difficulty] || "쉬움";
                    return (
                      <ExerciseItem key={idx}>
                        <ExerciseInfo>
                          <Part>{item.part}</Part>
                          <Name>
                            {item.name} ({item.sets}세트 × {item.reps}회)
                          </Name>
                        </ExerciseInfo>
                        <LevelBadge level={translated}>{translated}</LevelBadge>
                      </ExerciseItem>
                    );
                  })}
                </ExerciseList>
              ) : (
                <EmptyText>휴식</EmptyText>
              )}
            </DayCard>
          ))}

          <ButtonWrap>
            <ActionButton onClick={() => navigate("/")}>
              🏋️ 운동하러 가기
            </ActionButton>
          </ButtonWrap>
        </RoutineContainer>
      )}
    </Page>
  );
};

export default RecommendationPage;
