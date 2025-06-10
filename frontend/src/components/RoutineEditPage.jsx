import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function RoutineEditPage() {
  const { state } = useLocation();
  const { day, exercises: initial } = state || {};
  const [currentExercises, setCurrentExercises] = useState(initial || []);
  const [addList, setAddList] = useState([]);
  const [showAddList, setShowAddList] = useState(false);
  const userId = 'user123';
  const goal = 'Normal'; // 또는 context나 API로 추후 받아오기
  const navigate = useNavigate();

  useEffect(() => {
    if (currentExercises.length === 0) return;

    const part = currentExercises[0].part;
    const difficulty = currentExercises[0].difficulty;

    const levelMap = {
      '쉬움': '하',
      '보통': '중',
      '어려움': '상',
      '하': '하',
      '중': '중',
      '상': '상'
    };

    const level = levelMap[difficulty] || '하';

    axios
      .get(`http://localhost:3000/routine/exercise-list/${goal}/${part}/${level}`)
      .then((res) => setAddList(res.data || []))
      .catch((err) => console.error(err));
  }, [currentExercises]);

  const handleAdd = (exercise) => {
    setCurrentExercises([...currentExercises, {
      ...exercise,
      sets: exercise.difficulty === '상' ? 4 : 3,
      reps: exercise.difficulty === '상' ? 8 : 12,
      part: currentExercises[0]?.part || '전신',
    }]);
    setShowAddList(false);
  };

  const handleDelete = (index) => {
    const updated = [...currentExercises];
    updated.splice(index, 1);
    setCurrentExercises(updated);
  };

  const handleSave = async () => {
    try {
      await axios.patch(`http://localhost:3000/routine/${userId}/${day}`, {
        exercises: currentExercises,
      });
      alert('✅ 루틴이 저장되었습니다!');
      window.location.href = '/routine-preview';
    } catch (err) {
      console.error(err);
      alert('❌ 저장 실패');
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
  navigate(`/exercise-detail?name=${encodeURIComponent(ex.name)}&part=${encodeURIComponent(ex.part)}`)
}

            >
              {ex.name}
            </p>
            <p className="text-sm text-gray-500">{ex.sets}세트 · {ex.reps}회</p>
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
        {showAddList ? '▲ 접기' : '+ 운동 추가 ▼'}
      </div>

      {showAddList && (
        <div className="space-y-2">
          {addList.map((ex, idx) => (
            <div key={idx} className="flex justify-between items-center border p-4 rounded-md">
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
}

export default RoutineEditPage;
