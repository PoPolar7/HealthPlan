import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

interface Exercise {
  name: string;
  part: string;
  difficulty: string;
  sets: number;
  reps: number;
}

interface ExerciseOption {
  name: string;
  difficulty: string;
  [key: string]: any;
}

interface LocationState {
  day: string;
  exercises: Exercise[];
}

const Container = styled.div`
  min-height: 100vh;
  background: white;
  padding: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
`;

const RoutineTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
`;

const SaveButton = styled.button`
  margin-top: 1.5rem;
  background-color: #2563eb;
  color: white;
  width: 100%;
  padding: 0.75rem;
  border-radius: 1rem;
  font-weight: 600;
`;

const ToggleButton = styled.div`
  text-align: center;
  margin: 1rem 0;
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
`;

const RoutineEditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { day, exercises: initial = [] } = (location.state || {}) as LocationState;

  const [currentExercises, setCurrentExercises] = useState<Exercise[]>(initial);
  const [addList, setAddList] = useState<ExerciseOption[]>([]);
  const [showAddList, setShowAddList] = useState<boolean>(false);

 const userId = localStorage.getItem("userEmail") || "";
  const goal = "Normal";

  useEffect(() => {
    if (currentExercises.length === 0) return;
    const { part, difficulty } = currentExercises[0];
    const levelMap: Record<string, string> = {
      쉬움: "하",
      보통: "중",
      어려움: "상",
      하: "하",
      중: "중",
      상: "상",
    };
    const level = levelMap[difficulty] || "하";

    axios
      .get<ExerciseOption[]>(
        `http://localhost:3000/routine/exercise-list/${goal}/${encodeURIComponent(
          part
        )}/${level}`
      )
      .then((res) => setAddList(res.data || []))
      .catch((err) => console.error("관련 운동 로딩 실패:", err));
  }, [currentExercises, goal]);

  const handleAdd = (exercise: ExerciseOption): void => {
    const newEx: Exercise = {
      name: exercise.name,
      difficulty: exercise.difficulty,
      sets: exercise.difficulty === "상" ? 4 : 3,
      reps: exercise.difficulty === "상" ? 8 : 12,
      part: currentExercises[0]?.part || "전신",
    };
    setCurrentExercises((prev) => [...prev, newEx]);
    setShowAddList(false);
  };

  const handleDelete = (index: number): void => {
    setCurrentExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (): Promise<void> => {
    try {
      await axios.patch(`http://localhost:3000/routine/${userId}/${day}`, {
        exercises: currentExercises,
      });
      alert("✅ 루틴이 저장되었습니다!");
      navigate("/routine-preview");
    } catch (err) {
      console.error("루틴 저장 실패:", err);
      alert("❌ 저장 실패");
    }
  };

  return (
    <Container>
      <RoutineTitle>{day}요일 루틴</RoutineTitle>

      <SectionTitle>현재 루틴</SectionTitle>
      {currentExercises.map((ex, idx) => (
        <Card key={idx}>
          <div>
            <p
              style={{ fontWeight: 600, color: "#2563eb", cursor: "pointer" }}
              onClick={() =>
                navigate(
                  `/exercise-detail?name=${encodeURIComponent(
                    ex.name
                  )}&part=${encodeURIComponent(ex.part)}`
                )
              }
            >
              {ex.name}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              {ex.sets}세트 · {ex.reps}회
            </p>
          </div>
          <button style={{ color: "#ef4444" }} onClick={() => handleDelete(idx)}>
            <Trash2 size={18} />
          </button>
        </Card>
      ))}

      <ToggleButton onClick={() => setShowAddList(!showAddList)}>
        {showAddList ? "▲ 접기" : "+ 운동 추가 ▼"}
      </ToggleButton>

      {showAddList && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {addList.map((ex, idx) => (
            <Card key={idx}>
              <div>
                <p style={{ fontWeight: 600 }}>{ex.name}</p>
                <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>{ex.difficulty} 난이도</p>
              </div>
              <AddButton onClick={() => handleAdd(ex)}>+ 추가</AddButton>
            </Card>
          ))}
        </div>
      )}

      <SaveButton onClick={handleSave}>루틴 저장</SaveButton>
    </Container>
  );
};

export default RoutineEditPage;