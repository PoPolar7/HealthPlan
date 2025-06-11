import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface BodyInfoPayload {
  userId: string;
  height: number;
  weight: number;
  bodyFat: number;
  muscleMass: number;
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: black;
`;

const Form = styled.form`
  background-color: white;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Notice = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  padding-right: 3rem;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.4);
  }
`;

const Unit = styled.span`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #2563eb;
  color: white;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1e40af;
  }
`;

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

   const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("로그인이 필요합니다.");
      return;
    }

    const payload: BodyInfoPayload = {
      userId: email,
      height: Number(height),
      weight: Number(weight),
      bodyFat: Number(fat),
      muscleMass: Number(muscle),
    };

    try {
      await axios.post("http://localhost:3000/body-info", payload);
      navigate("/routine-result");
    } catch (err: any) {
      console.error("저장 실패:", err);
      alert("서버 저장 중 오류 발생");
    }
  };

  const fields = [
    { label: "키", value: height, setter: setHeight, unit: "cm" },
    { label: "몸무게", value: weight, setter: setWeight, unit: "kg" },
    { label: "체지방률", value: fat, setter: setFat, unit: "%" },
    { label: "근육량", value: muscle, setter: setMuscle, unit: "kg" },
  ];

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Notice>운동 루틴 추천을 위해 필요한 정보입니다.</Notice>

        {fields.map(({ label, value, setter, unit }) => (
          <InputGroup key={label}>
            <Input
              type="number"
              placeholder={label}
              value={value}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setter(e.target.value)
              }
            />
            <Unit>{unit}</Unit>
          </InputGroup>
        ))}

        <SubmitButton type="submit">다음</SubmitButton>
      </Form>
    </Container>
  );
};

export default BodyInputPage;
