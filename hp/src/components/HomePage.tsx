import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderButton = styled.button`
  background-color: transparent;
  color: #2563eb;
  font-weight: 600;
  margin-left: 1rem;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: white;
  padding: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin: 2rem 0;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  text-align: center;
  cursor: pointer;
`;

const Emoji = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Label = styled.p`
  font-weight: 600;
`;

const SubText = styled.p`
  color: #4b5563;
`;

const VideoBox = styled.div`
  width: 100%;
  height: 16rem;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const PlayButton = styled.button`
  font-size: 2rem;
  color: #4b5563;
  background: none;
  border: none;
  cursor: pointer;
`;

const Comment = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  text-align: left;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || localStorage.getItem("userEmail");
    setIsLoggedIn(!!email);
  }, []);

  return (
    <>
      <HeaderWrapper>
        {isLoggedIn ? (
          <HeaderButton onClick={() => {
            localStorage.removeItem("email");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsLoggedIn(false);
            navigate("/");
          }}>
            로그아웃
          </HeaderButton>
        ) : (
          <>
            <HeaderButton onClick={() => navigate("/login")}>로그인</HeaderButton>
            <HeaderButton onClick={() => navigate("/signup")}>회원가입</HeaderButton>
          </>
        )}
      </HeaderWrapper>

      <PageWrapper>
        <Title>
          {isLoggedIn
            ? "환영합니다! 루틴을 시작해볼까요?"
            : "로그인 후 루틴을 생성해보세요"}
        </Title>

        <Grid>
          <Card onClick={() => navigate("/routine-preview")}>  {/* 로그인 여부와 무관하게 이동 */}
            <Emoji>📅</Emoji>
            <Label>요일별 루틴추천</Label>
          </Card>

          <Card onClick={() => navigate("/dashboard")}> {/* 대시보드 접근 */}
            <Emoji>📊</Emoji>
            <Label>운동 통계 대시보드</Label>
            <SubText>운동 기록을 한눈에!</SubText>
          </Card>

          <Card onClick={() => navigate("/posts")}> {/* 커뮤니티 접근 */}
            <Emoji>📝</Emoji>
            <Label>커뮤니티</Label>
            <SubText>운동기록을 공유해요</SubText>
          </Card>

          <Card onClick={() => navigate("/mypage")}> {/* 마이페이지 접근 */}
            <Emoji>🙋‍♂️</Emoji>
            <Label>마이페이지</Label>
            <SubText>내 정보 바꾸기</SubText>
          </Card>
        </Grid>

        <VideoBox>
          <PlayButton>▶️</PlayButton>
        </VideoBox>

        <Comment>
          {isLoggedIn
            ? "👤 \"꾸준한 운동으로 목표를 이루고 있어요!\""
            : "👤 \"로그인 후 나만의 루틴을 만들어보세요!\""}
        </Comment>
      </PageWrapper>
    </>
  );
};

export default HomePage;
