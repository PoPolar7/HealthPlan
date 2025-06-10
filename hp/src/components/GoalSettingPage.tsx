import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface GoalSettingPayload {
  goal: string;
  difficulty: string;
  frequency: number;
  userId: string;
}

interface GoalOption {
  label: string;
  icon: string;
}

const GoalSettingPage: React.FC = () => {
  const [goal, setGoal] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!goal || !difficulty || !frequency) {
      alert("모든 항목을 선택해 주세요!");
      return;
    }

    const payload: GoalSettingPayload = {
      goal,
      difficulty,
      frequency: parseInt(frequency, 10),
      userId: "user123", // 실제 사용자 ID로 변경하세요
    };

    try {
      const response = await axios.post("http://localhost:3000/cats", payload);
      console.log("서버 응답:", response.data);
      navigate("/body-input");
    } catch (err: any) {
      console.error("서버 요청 실패:", err);
      alert("저장 실패! 서버 확인 필요");
    }
  };

  const goalOptions: GoalOption[] = [
    { label: "체지방 감량", icon: "🔥" },
    { label: "근육 증가", icon: "💪" },
    { label: "체력 강화", icon: "❤️" },
  ];
  const difficultyOptions: string[] = ["Easy", "Normal", "Hard"];
  const frequencyOptions: string[] = ["2", "3", "4", "5", "6"];

  const isSelected = (state: string, value: string): string =>
    state === value
      ? "bg-blue-500 text-white border-blue-500"
      : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300";

  const buttonClass = "w-full py-3 rounded-lg font-medium border transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-8 text-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            운동 목표를 설정해주세요
          </h1>
          <p className="text-sm text-gray-500">
            본인의 주요 운동 목표를 선택하세요.
          </p>
        </div>

        <div className="flex justify-between gap-3">
          {goalOptions.map((option) => (
            <button
              type="button"
              key={option.label}
              onClick={() => setGoal(option.label)}
              className={`${buttonClass} ${isSelected(goal, option.label)}`}
            >
              <span className="text-3xl">{option.icon}</span>
              <span className="mt-2 text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <div className="w-1/2 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              난이도
            </label>
            <select
              value={difficulty}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setDifficulty(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택</option>
              {difficultyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주당 운동일
            </label>
            <select
              value={frequency}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFrequency(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택</option>
              {frequencyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}일
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 w-full rounded-xl transition"
        >
          다음
        </button>
      </form>
    </div>
  );
};

export default GoalSettingPage;
