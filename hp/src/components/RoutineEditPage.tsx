import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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
  // 기타 필드가 있을 경우 추가
  [key: string]: any;
}

interface LocationState {
  day: string;
  exercises: Exercise[];
}

const RoutineEditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { day, exercises: initial = [] } = location.state || {};

  const [currentExercises, setCurrentExercises] = useState<Exercise[]>(initial);
  const [addList, setAddList] = useState<ExerciseOption[]>([]);
  const [showAddList, setShowAddList] = useState<boolean>(false);

  const userId = "user123";
  const goal = "Normal"; // 필요시 API나 Context에서 받아오세요

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
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-xl font-bold mb-4">{day}요일 루틴</h2>

      <h3 className="font-semibold mb-2 text-gray-700">현재 루틴</h3>
      {currentExercises.map((ex, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-2 flex justify-between items-center"
        >
          <div>
            <p
              className="font-semibold cursor-pointer text-blue-600"
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
            <p className="text-sm text-gray-500">
              {ex.sets}세트 · {ex.reps}회
            </p>
          </div>
          <button className="text-red-500" onClick={() => handleDelete(idx)}>
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <div
        onClick={() => setShowAddList(!showAddList)}
        className="text-blue-600 text-center my-4 cursor-pointer font-semibold"
      >
        {showAddList ? "▲ 접기" : "+ 운동 추가 ▼"}
      </div>

      {showAddList && (
        <div className="space-y-2">
          {addList.map((ex, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border p-4 rounded-md"
            >
              <div>
                <p className="font-semibold">{ex.name}</p>
                <p className="text-sm text-gray-500">{ex.difficulty} 난이도</p>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded-md"
                onClick={() => handleAdd(ex)}
              >
                + 추가
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="mt-6 bg-blue-600 text-white w-full py-3 rounded-xl font-semibold"
        onClick={handleSave}
      >
        루틴 저장
      </button>
    </div>
  );
};

export default RoutineEditPage;
