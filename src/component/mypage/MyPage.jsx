import Header from "../Header";
import Footer from "../Footer";
import Chart from "./Chart";
import Map from "./Map";
import "./MyPage.css";
import axios from "axios";
import { useState } from "react";
export default function MyPage() {
  const [nickname, setNickname] = useState("");
  const authorization = sessionStorage.getItem("Authorization");
  try {
    const findNickname = async () => {
      const response = await axios.get(`http://127.0.0.1:8000/api/users`, {
        headers: { authorization },
      });
      setNickname(response.data.nickname);
    };
    findNickname();
  } catch (err) {}
  return (
    <div>
      <Header />
      <div className="mypage-container">
        {/* <iframe src="map.html" title="Tmap Map" allowfullscreen></iframe> */}
        <Map />
        <Chart />
        <div className="mypage-button-box">
          <button
            className="user-edit-btn"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/user/edit";
            }}
          >
            회원 정보 수정
          </button>
          <button
            className="user-delete-btn"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/user/signout";
            }}
          >
            회원 탈퇴
          </button>
          <div className="greet-box">
            <p className="mypage-greet">
              <strong>{nickname}</strong> 님 안녕하세요!
            </p>
            <p className="mypage-greet">오늘은 어떤 산책을 해 볼까요?</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
