import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
`;

const Form = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const SubText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const GoalButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 1rem 0.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  border: 1px solid ${({ selected }) => (selected ? "#3b82f6" : "#d1d5db")};
  background-color: ${({ selected }) => (selected ? "#3b82f6" : "#f3f4f6")};
  color: ${({ selected }) => (selected ? "#fff" : "#1f2937")};
  transition: 0.2s;

  &:hover {
    background-color: ${({ selected }) => (selected ? "#2563eb" : "#e5e7eb")};
  }
`;

const Icon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`;

const Label = styled.span`
  display: block;
  font-size: 0.875rem;
`;

const SelectRow = styled.div`
  display: flex;
  gap: 1rem;
  text-align: left;
  margin-bottom: 1.5rem;
`;

const SelectWrapper = styled.div`
  flex: 1;
`;

const SelectLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
  display: block;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #10b981;
  color: white;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #059669;
  }
`;

const GoalEditPage: React.FC = () => {
  const [goal, setGoal] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:3000/goal/${email}`)
        .then((res) => {
          setGoal(res.data.goal);
          setDifficulty(res.data.difficulty);
          setFrequency(String(res.data.frequency));
        })
        .catch(() => {
          alert("목표 정보를 불러오지 못했습니다.");
        });
    }
  }, [email]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!goal || !difficulty || !frequency || !email) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const payload: GoalSettingPayload = {
      goal,
      difficulty,
      frequency: parseInt(frequency, 10),
      userId: email,
    };

    try {
      await axios.post("http://localhost:3000/goal", payload);
      alert("목표가 수정되었습니다.");
      navigate("/mypage");
    } catch (err: any) {
      console.error("수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const goalOptions: GoalOption[] = [
    { label: "체지방 감량", icon: "🔥" },
    { label: "근육 증가", icon: "💪" },
    { label: "체력 강화", icon: "❤️" },
  ];

  const difficultyOptions: string[] = ["Easy", "Normal", "Hard"];
  const frequencyOptions: string[] = ["2", "3", "4", "5", "6"];

  return (
    <PageWrapper>
      <Form onSubmit={handleSubmit}>
        <Title>운동 목표 수정</Title>
        <SubText>기존 목표를 변경할 수 있습니다.</SubText>

        <ButtonRow>
          {goalOptions.map((option) => (
            <GoalButton
              key={option.label}
              type="button"
              selected={goal === option.label}
              onClick={() => setGoal(option.label)}
            >
              <Icon>{option.icon}</Icon>
              <Label>{option.label}</Label>
            </GoalButton>
          ))}
        </ButtonRow>

        <SelectRow>
          <SelectWrapper>
            <SelectLabel>난이도</SelectLabel>
            <Select
              value={difficulty}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setDifficulty(e.target.value)
              }
            >
              <option value="">선택</option>
              {difficultyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </SelectWrapper>

          <SelectWrapper>
            <SelectLabel>주당 운동일</SelectLabel>
            <Select
              value={frequency}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFrequency(e.target.value)
              }
            >
              <option value="">선택</option>
              {frequencyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}일
                </option>
              ))}
            </Select>
          </SelectWrapper>
        </SelectRow>

        <SubmitButton type="submit">수정 완료</SubmitButton>
      </Form>
    </PageWrapper>
  );
};

export default GoalEditPage;
