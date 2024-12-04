import { useEffect, useState } from "react";
import axios from "axios";
import "./Header.css";

export default function Header() {
  const authorization = window.sessionStorage.getItem("Authorization");
  const token = window.sessionStorage.getItem("token");
  const [isLogined, setIsLogined] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // 로그인되지 않은 경우 경로를 체크하고 로그인 페이지로 리디렉션
    const checkRedirect = () => {
      const currentPath = window.location.pathname;
      if (
        !isLogined &&
        ![
          "/",
          "/posts",
          "/login",
          "/login/email",
          "/login/kakao",
          "/signup",
        ].includes(currentPath)
      ) {
        window.location.href = "/login";
      }
    };

    async function authCheck() {
      try {
        const response = await axios.get(
          "https://ashortwalk.store/api/auth/check",
          {
            headers: { Authorization: authorization },
          }
        );
        if (response.status === 200) {
          if (!isLogined) setIsLogined(true); // 로그인 상태 변경
        } else if (response.status === 401) {
          await refreshAccessToken(); // 토큰 갱신 시도
        }
      } catch (err) {}
    }

    // `authorization` 또는 `token`이 존재할 때만 authCheck 호출
    if (authorization || token) {
      authCheck();
      checkRedirect();
    } else {
      setIsLogined(false);
      checkRedirect();
    }

    // refreshAccessToken 함수 정의
    async function refreshAccessToken() {
      try {
        const response = await fetch(
          "https://ashortwalk.store/api/auth/refresh",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token, // `Bearer` 방식으로 전달
            },
          }
        );
        console.log("리프레시 토큰 작동");

        if (response.status === 401) {
          // 토큰이 만료된 경우
          sessionStorage.removeItem("Authorization");
          sessionStorage.removeItem("token");
          setIsLogined(false);
          alert("세션이 만료되었습니다. 재로그인 해 주세요.");
        } else {
          const data = await response.json();
          if (response.status >= 200 && response.status < 300) {
            // 토큰 갱신 후, 새로운 accessToken을 세션 스토리지에 저장
            sessionStorage.setItem("Authorization", data.accessToken);
            setIsLogined(true); // 로그인 상태 갱신
          }
        }
      } catch (err) {}
    }
  }, [authorization, token, isLogined]);

  function logout() {
    sessionStorage.removeItem("Authorization");
    sessionStorage.removeItem("token");
    setIsLogined(false); // 로그아웃 시 상태 변경
    window.location.reload();
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <header>
        <nav>
          <h1
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
          >
            짧은 산책
          </h1>

          <div className="hamburger" onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className={`navMenu ${isMenuOpen ? "active" : ""}`}>
            {isLogined ? (
              <div className="buttonBox">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/posts";
                  }}
                >
                  게시판
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/groups";
                  }}
                >
                  그룹
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  로그아웃
                </button>
                <button
                  className="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/mypage";
                  }}
                >
                  My Page
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.25 22V20.75C3.25 19.6009 3.47633 18.4631 3.91605 17.4015C4.35578 16.3399 5.0003 15.3753 5.81282 14.5628C6.62533 13.7503 7.58992 13.1058 8.65152 12.6661C9.71312 12.2263 10.8509 12 12 12C13.1491 12 14.2869 12.2263 15.3485 12.6661C16.4101 13.1058 17.3747 13.7503 18.1872 14.5628C18.9997 15.3753 19.6442 16.3399 20.0839 17.4015C20.5237 18.4631 20.75 19.6009 20.75 20.75V22"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 12C13.3261 12 14.5979 11.4732 15.5355 10.5355C16.4732 9.59785 17 8.32608 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2C10.6739 2 9.40215 2.52678 8.46447 3.46447C7.52678 4.40215 7 5.67392 7 7C7 8.32608 7.52678 9.59785 8.46447 10.5355C9.40215 11.4732 10.6739 12 12 12V12Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="buttonBox">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/posts";
                  }}
                >
                  게시판
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/login";
                  }}
                >
                  로그인
                </button>
                <button
                  className="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/signup";
                  }}
                >
                  회원 가입
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
      {isMenuOpen && (
        <div className="hamburger-buttonBox">
          {isLogined ? (
            <>
              <button>채팅</button>
              <button>로그아웃</button>
              <button
                className="blue"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/mypage";
                }}
              >
                My Page
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/login";
                }}
              >
                로그인
              </button>
              <button
                className="blue"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/signup";
                }}
              >
                회원 가입
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
