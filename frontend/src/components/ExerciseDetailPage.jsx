import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

function ExerciseDetailPage() {
  const [params] = useSearchParams();
  const name = params.get('name');
  const partParam = params.get('part');
  const userId = 'user123'; // 실제 사용자 ID로 수정 가능

  const [exercise, setExercise] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    console.log('📌 name param:', name);
    console.log('📌 part param:', partParam);

    axios
      .get(`http://localhost:3000/routine/exercise-info?name=${name}&userId=${userId}`)
      .then((res) => {
        const ex = res.data;
        setExercise(ex);

        const partToUse = partParam || ex.part;
        if (!partToUse) return;

        axios
          .get(`http://localhost:3000/routine/exercise-list/Normal/${partToUse}/중`, {
            params: { userId }
          })
          .then((r) => {
            const filtered = r.data.filter((e) => e.name !== name && !e.isCompleted);
            setRelated(filtered);
          });
      })
      .catch((err) => {
        console.error('❌ 운동 정보 로딩 실패:', err);
      });
  }, [name, partParam]);

  const handleComplete = async () => {
    try {
      await axios.post('http://localhost:3000/routine/complete', {
        userId,
        name,
        date: new Date().toISOString().split('T')[0],
      });

      setExercise((prev) => ({
        ...prev,
        isCompleted: true,
      }));
    } catch (err) {
      console.error('❌ 운동 완료 실패:', err);
    }
  };

  if (!exercise) return <p className="p-4">로딩 중이거나 운동 정보를 찾을 수 없습니다.</p>;

  const partToShow = partParam || exercise.part;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-2">{exercise.name}</h1>

      <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full mb-2">
        {partToShow}
      </button>

      <p className="mb-4 text-gray-600">{exercise.description}</p>

     <a
  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="block bg-red-100 border border-red-400 rounded-lg p-4 text-center shadow hover:bg-red-200 transition mb-6"
>
  <p className="text-red-700 font-semibold">🎬 유튜브에서 "{exercise.name}" 검색</p>
</a>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {related.map((ex, idx) => (
          <Link
            to={`/exercise-detail?name=${encodeURIComponent(ex.name)}&part=${encodeURIComponent(partToShow)}`}
            key={idx}
            className="bg-white border rounded-lg p-4 shadow-sm text-center block"
          >
            <p className="font-bold">{ex.name}</p>
            <p className="text-sm text-gray-500">{partToShow}</p>
          </Link>
        ))}
      </div>

      {exercise.isCompleted ? (
        <div className="text-green-600 text-center font-semibold">
          ✅ 이미 완료된 운동입니다
        </div>
      ) : (
        <button
          onClick={handleComplete}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
        >
          운동 완료
        </button>
      )}
    </div>
  );
}

export default ExerciseDetailPage;
