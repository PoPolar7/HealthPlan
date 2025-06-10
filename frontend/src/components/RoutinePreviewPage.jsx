// RoutinePreviewPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RoutinePreviewPage() {
  const [routine, setRoutine] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = 'user123';

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const groupByDay = (list) => {
    const result = {};
    for (const item of list) {
      result[item.day] = item.exercises;
    }
    return result;
  };

  useEffect(() => {
    const fetchRoutine = async () => {
      const res = await axios.get(`http://localhost:3000/routine/${userId}`);
      const data = res.data || [];

      if (data.length === 0) {
        const createRes = await axios.post(`http://localhost:3000/routine`, { userId });
        const days = createRes.data?.routine || {};
        const transformed = Object.entries(days).map(([day, exercises]) => ({ day, exercises }));
        setRoutine(groupByDay(transformed));
      } else {
        setRoutine(groupByDay(data));
      }

      setLoading(false);
    };

    fetchRoutine();
  }, []);

  const levelColor = {
    '쉬움': 'bg-yellow-100 text-yellow-600',
    '보통': 'bg-amber-100 text-amber-600',
    '어려움': 'bg-orange-100 text-orange-600',
  };

  const difficultyMap = {
    '하': '쉬움',
    '중': '보통',
    '상': '어려움',
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-semibold text-center mb-8">
         <nav className="flex justify-between items-center mb-6 text-sm space-x-6">
        <button onClick={() => navigate('/')}>홈페이지</button>
        <button onClick={() => navigate('/dashboard')}>대시보드</button>
        <button>커뮤니티</button>
        <button>마이페이지</button>
      </nav>
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
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => {
                const exercises = routine[day];
                if (exercises?.length > 0) {
                  navigate('/routine-edit', {
                    state: { day, exercises },
                  });
                }
              }}
            >
              <h2 className="text-lg font-bold mb-2">{day}</h2>
              {routine[day] && routine[day].length > 0 ? (
                <ul className="space-y-2">
                  {routine[day].map((item, idx) => {
                    const translated = difficultyMap[item.difficulty] || '쉬움';
                    return (
                      <li key={idx} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-700">{item.part}</p>
                          <p className="text-sm text-gray-500">
                            {item.name} ({item.sets}세트 × {item.reps}회)
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            levelColor[translated] || 'bg-gray-100 text-gray-500'
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
        </div>
      )}
      <div className="text-center mt-8">
            
          </div>
    </div>
    
  );
}

export default RoutinePreviewPage;
