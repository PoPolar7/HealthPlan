import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardPage() {
  const userId = 'user123'; // ← 반드시 저장된 userId와 일치해야 함
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/dashboard/summary/${userId}`)
      .then((res) => setSummary(res.data))
      .catch((err) => {
        console.error('❌ 요약 정보 불러오기 실패:', err.response?.data || err.message || err);
        setError('데이터 로딩 중 오류가 발생했습니다.');
      });
  }, []);

  if (error) {
    return <div className="p-6 text-red-600 font-semibold">{error}</div>;
  }

  if (!summary) {
    return <div className="p-6 text-gray-600">📊 대시보드 로딩 중...</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📊 운동 통계 대시보드</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card title="총 완료한 운동 수" value={`${summary.totalExercises}개`} />
        <Card title="현재 체중" value={`${summary.currentWeight.toFixed(2)} kg`} />
        <Card title="현재 근육량" value={`${summary.currentMuscle.toFixed(2)} kg`} />
        <Card
          title="체중 변화량"
          value={`${summary.totalWeightChange >= 0 ? '+' : ''}${summary.totalWeightChange.toFixed(2)} kg`}
        />
        <Card
          title="근육량 변화량"
          value={`+${summary.totalMuscleChange.toFixed(2)} kg`}
        />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-xl font-bold text-blue-700">{value}</p>
    </div>
  );
}

export default DashboardPage;
