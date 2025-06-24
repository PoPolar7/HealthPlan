import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

interface Summary {
  totalExercises: number;
  currentWeight: number;
  currentMuscle: number;
  totalWeightChange: number;
  totalMuscleChange: number;
}

const Container = styled.div`
  padding: 1.5rem;
  background: white;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const CardContainer = styled.div`
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const CardTitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const CardValue = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1d4ed8;
`;

const DashboardPage: React.FC = () => {
  const userId = localStorage.getItem("userEmail") || "";

  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Summary>(`http://localhost:3000/dashboard/summary/${userId}`)
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => {
        console.error(
          "❌ 요약 정보 불러오기 실패:",
          err.response?.data || err.message || err
        );
        setError("데이터 로딩 중 오류가 발생했습니다.");
      });
  }, [userId]);

  if (error) {
    return <Container style={{ color: "#dc2626", fontWeight: 600 }}>{error}</Container>;
  }

  if (!summary) {
    return <Container style={{ color: "#4b5563" }}>📊 대시보드 로딩 중...</Container>;
  }

  return (
    <Container>
      <Title>📊 운동 통계 대시보드</Title>
      <Grid>
        <Card title="총 완료한 운동 수" value={`${summary.totalExercises}개`} />
        <Card title="현재 체중" value={`${summary.currentWeight.toFixed(2)} kg`} />
        <Card title="현재 근육량" value={`${summary.currentMuscle.toFixed(2)} kg`} />
        <Card
          title="체중 변화량"
          value={`${summary.totalWeightChange >= 0 ? "+" : ""}${summary.totalWeightChange.toFixed(2)} kg`}
        />
        <Card
          title="근육량 변화량"
          value={`+${summary.totalMuscleChange.toFixed(2)} kg`}
        />
      </Grid>
    </Container>
  );
};

interface CardProps {
  title: string;
  value: string;
}

const Card: React.FC<CardProps> = ({ title, value }) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <CardValue>{value}</CardValue>
    </CardContainer>
  );
};

export default DashboardPage;