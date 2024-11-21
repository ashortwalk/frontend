import "./Header.css";

export default function Header() {
  const authorization = window.sessionStorage.getItem("Authorization");
  return (
    <header>
      <nav>
        <h1>짧은 산책</h1>

        {authorization ? (
          <div className="buttonBox">
            <button>채팅</button>
            <button>로그아웃</button>
            <button className="blue">
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
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 12C13.3261 12 14.5979 11.4732 15.5355 10.5355C16.4732 9.59785 17 8.32608 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2C10.6739 2 9.40215 2.52678 8.46447 3.46447C7.52678 4.40215 7 5.67392 7 7C7 8.32608 7.52678 9.59785 8.46447 10.5355C9.40215 11.4732 10.6739 12 12 12V12Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="buttonBox">
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
      </nav>
    </header>
  );
}
