import "./Section01.css";

export default function Section01() {
  return (
    <div className="Section01">
      <div className="S1imageContent">
        <img src="section01.png" alt="section01.pngs" />
      </div>
      <div className="S1textContent">
        <h3>
          산책 릴레이로 이어가는 <br />
          일상의 여유
        </h3>
        <ul>
          <li>AI에게 산책 코스를 추천받을 수 있어요!</li>
          <li>추첨을 통해 다음 릴레이가 이어집니다.</li>
          <li>그룹 채팅을 통해 주변의 산책인과 가까워지세요!</li>
          <li>여유로운 소통을 통해 일상의 여유를 가져보세요.</li>
        </ul>
      </div>
    </div>
  );
}
