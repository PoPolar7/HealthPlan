import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// 요청 보내기 전에 항상 accessToken 붙이기
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답이 오는데 401 Unauthorized라면 → 자동으로 refresh 시도
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 반복 방지
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          "http://localhost:3000/auth/refresh",
          {
            refreshToken,
          }
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        // 새 accessToken으로 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("자동 재로그인 실패", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // 강제 로그인 페이지 이동
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
