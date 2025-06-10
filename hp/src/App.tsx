import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import DeleteAccount from "./pages/DeleteAccount";
import PostList from "./pages/PostList";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import MyPage from "./pages/MyPage";
import GoalSettingPage from "./components/GoalSettingPage";
import BodyInputPage from "./components/BodyInputPage";
import RecommendationPage from "./components/RecommendationPage";
import RoutineEditPage from "./components/RoutineEditPage";
import HomePage from "./components/HomePage";
import ExerciseDetailPage from "./components/ExerciseDetailPage";
import RoutinePreviewPage from "./components/RoutinePreviewPage";
import DashboardPage from "./components/DashboardPage";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        {
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/goal-setting" element={<GoalSettingPage />} />
            <Route path="/body-input" element={<BodyInputPage />} />
            <Route path="/routine-result" element={<RecommendationPage />} />
            <Route path="/routine-edit" element={<RoutineEditPage />} />{" "}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/exercise-detail" element={<ExerciseDetailPage />} />
            <Route
              path="/exercise-feedback"
              element={<div>운동 피드백 입력 페이지</div>}
            />
            <Route path="/routine-preview" element={<RoutinePreviewPage />} />
          </Routes>
        }
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
