import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ExerciseDetail {
  part: string;
  name: string;
  sets: number;
  reps: number;
  difficulty: string;
  // 추가 필드가 있으면 여기에 정의하세요
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
  쉬움: "bg-yellow-100 text-yellow-600",
  보통: "bg-amber-100 text-amber-600",
  어려움: "bg-orange-100 text-orange-600",
};

const difficultyMap: Record<string, string> = {
  하: "쉬움",
  중: "보통",
  상: "어려움",
};

const RecommendationPage: React.FC = () => {
  const [routine, setRoutine] = useState<RoutineMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const userId = "user123";

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
          console.log("📭 루틴 없음 → 생성 시도");
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
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-semibold text-center mb-8">
        추천 운동 루틴이 완성되었습니다.
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">로딩 중...</p>
      ) : Object.keys(routine).length === 0 ? (
        <p className="text-center text-red-500">❗ 루틴 데이터가 없습니다.</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {weekdays.map((day) => (
            <div
              key={day}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50"
            >
              <h2 className="text-lg font-bold mb-2">{day}</h2>
              {routine[day] && routine[day].length > 0 ? (
                <ul className="space-y-2">
                  {routine[day].map((item, idx) => {
                    const translated = difficultyMap[item.difficulty] || "쉬움";
                    return (
                      <li
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-700">
                            {item.part}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.name} ({item.sets}세트 × {item.reps}회)
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            levelColor[translated] ||
                            "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {translated}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-400">휴식</p>
              )}
            </div>
          ))}

          {/* 운동하러 가기 버튼 */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 transition"
            >
              🏋️ 운동하러 가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
