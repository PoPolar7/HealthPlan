import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface BodyInfoPayload {
  userId: string;
  height: number;
  weight: number;
  bodyFat: number;
  muscleMass: number;
}

const BodyInputPage: React.FC = () => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [muscle, setMuscle] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!height || !weight || !fat || !muscle) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    const payload: BodyInfoPayload = {
      userId: "user123",
      height: Number(height),
      weight: Number(weight),
      bodyFat: Number(fat),
      muscleMass: Number(muscle),
    };

    console.log("전송할 데이터:", payload);

    try {
      await axios.post("http://localhost:3000/body-info", payload);
      navigate("/routine-result");
    } catch (err: any) {
      console.error("저장 실패:", err);
      alert("서버 저장 중 오류 발생");
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 relative";

  type Field = {
    label: string;
    value: string;
    setter: React.Dispatch<React.SetStateAction<string>>;
    unit: string;
  };

  const fields: Field[] = [
    { label: "키", value: height, setter: setHeight, unit: "cm" },
    { label: "몸무게", value: weight, setter: setWeight, unit: "kg" },
    { label: "체지방률", value: fat, setter: setFat, unit: "%" },
    { label: "근육량", value: muscle, setter: setMuscle, unit: "kg" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-full max-w-md space-y-6 text-center"
      >
        <p className="text-sm text-gray-400 mb-4">
          운동 루틴 추천을 위해 필요한 정보입니다.
        </p>

        {fields.map(({ label, value, setter, unit }) => (
          <div key={label} className="relative">
            <input
              type="number"
              placeholder={label}
              value={value}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setter(e.target.value)
              }
              className={inputClass}
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              {unit}
            </span>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          다음
        </button>
      </form>
    </div>
  );
};

export default BodyInputPage;
