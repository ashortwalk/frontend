import "./KakaoLogin.css";

function KakaoLogin() {
  const { Kakao } = window;
  async function StartKakao() {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/kakaokey`, {
        method: "POST",
      });
      const result = await response.json();

      await Kakao.init(result.kakaoJSKey);
      await Kakao.Auth.authorize({
        redirectUri: result.kakaoRedirectURI,
      });
    } catch (err) {}
  }

  StartKakao();

  return (
    <div className="kakao-container">
      <div className="kakao-box">
        <p>카카오 로그인이 진행 중입니다...</p>
      </div>
    </div>
  );
}

export default KakaoLogin;
