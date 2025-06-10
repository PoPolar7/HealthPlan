import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-4">지금 루틴을 만들지 않으면 몸이 무너집니다</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        {/* 요일별 루틴 추천 */}
        <div
          className="text-center cursor-pointer"
          onClick={() => navigate('/routine-preview')}
        >
          <div className="text-2xl mb-2">🧘‍♂️</div>
          <p className="font-semibold">요일별 루틴추천</p>
        </div>

        {/* 운동 통계 대시보드 */}
        <div
          className="text-center cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="text-2xl mb-2">📊</div>
          <p className="font-semibold">운동 통계 대시보드</p>
          <p className="text-gray-600">운동 기록을 한눈에!</p>
        </div>

        {/* 마이페이지 */}
        <div className="text-center">
          <div className="text-2xl mb-2">🥂</div>
          <p className="font-semibold">마이페이지</p>
          <p className="text-gray-600">직전 분류 10지점</p>
        </div>
      </div>

      <div className="w-full h-64 bg-gray-200 flex items-center justify-center mb-6">
        <button className="text-gray-600 text-2xl">▶️</button>
      </div>

      <div className="text-left mb-6">
        <p className="text-sm text-gray-500">👤 "목표 달성합니다!"</p>
      </div>

      <div className="text-right">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          onClick={() => navigate('/goal-setting')}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default HomePage;
