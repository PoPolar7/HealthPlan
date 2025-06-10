import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoalSettingPage from './components/GoalSettingPage';
import BodyInputPage from './components/BodyInputPage';
import RecommendationPage from './components/RecommendationPage';
import RoutineEditPage from './components/RoutineEditPage'; // ✅ 추가
import HomePage from './components/HomePage';
import ExerciseDetailPage from './components/ExerciseDetailPage';
import RoutinePreviewPage from './components/RoutinePreviewPage';
import DashboardPage from './components/DashboardPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* ✅ 여기에 적용 */}
        <Route path="/goal-setting" element={<GoalSettingPage />} />
        <Route path="/body-input" element={<BodyInputPage />} />
        <Route path="/routine-result" element={<RecommendationPage />} />
        <Route path="/routine-edit" element={<RoutineEditPage />} /> {/* ✅ 요일 클릭 이동 경로 */}
        <Route path="/dashboard" element={<DashboardPage />} />
       <Route path="/exercise-detail" element={<ExerciseDetailPage />} />
        <Route path="/exercise-feedback" element={<div>운동 피드백 입력 페이지</div>} />
        <Route path="/routine-preview" element={<RoutinePreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
