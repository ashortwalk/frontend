import Footer from "../Footer";
import Header from "../Header";
import "./SignUp.css";
import React, { useEffect, useState } from "react";

export default function SignOut() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [id, setId] = useState("");
  const [text, setText] = useState("");
  const word = "회원을 탈퇴합니다.";

  const token = window.sessionStorage.getItem("Authorization");

  useEffect(() => {
    // 컴포넌트가 마운트될 때 API 호출
    const fetchData = async () => {
      fetch("http://localhost:8000/api/users", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("네트워크 응답에 문제가 있습니다.");
          }
          return response.json();
        })
        .then((data) => {
          setEmail(data.email);
          setId(data.id);
        })
        .catch((error) => {});
    };

    fetchData();
  }, []); // 빈 배열을 넣어 컴포넌트 마운트 시 한 번만 실행되도록 함

  const handleInputChange = (e) => {
    setText(e.target.value.trim());
  };

  const handleUserEditSubmit = (e) => {
    if (word != text) {
      alert("[]안의 문구를 정확히 입력하세요.");
      return;
    }

    e.preventDefault(); // 기본 폼 제출 동작 방지

    fetch(`http://localhost:8000/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ nickname }),
    })
      .then((response) => {
        if (!response.ok) {
          alert("회원 탈퇴에 실패하였습니다.");
        }
        return response.json();
      })
      .then((data) => {
        alert("회원 탈퇴되었습니다.");
        window.location.href = "/";
        window.sessionStorage.removeItem("Authorization");
        window.sessionStorage.removeItem("token");
      })
      .catch((error) => {});
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="form-container">
          <h1>회원 탈퇴</h1>
          <div className="form-row">
            <label>E-mail</label>
            <input type="text" id="email" value={email} disabled></input>
          </div>
          <br />
          탈퇴를 원하신다면 다음 문구를 정확히 입력하세요.
          <br /> [회원을 탈퇴합니다.]
          <div className="form-row">
            <input type="text" id="text" onChange={handleInputChange}></input>
          </div>
          <button className="special-button" onClick={handleUserEditSubmit}>
            저장
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
