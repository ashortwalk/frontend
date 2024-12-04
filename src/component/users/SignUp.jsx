import Footer from "../Footer";
import Header from "../Header";
import "./SignUp.css";
import React, { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState(""); // 이메일 상태 관리
  const [number, setNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleInputChange = (e) => {
    if ("email" === e.target.id) {
      setEmail(e.target.value.trim()); // input 값이 변경될 때 상태 업데이트
    }
    if ("number" === e.target.id) {
      setNumber(e.target.value.trim());
    }
    if ("nickname" === e.target.id) {
      setNickname(e.target.value.trim());
    }
    if ("password" === e.target.id) {
      setPassword(e.target.value.trim());
    }
    if ("confirm" === e.target.id) {
      setConfirm(e.target.value.trim());
    }
  };
  const handleEmailSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지d

    fetch("http://20.41.86.171:8000/api/auth/email", {
      method: "POST", // POST 요청
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 전송
      },
      body: JSON.stringify({ email }), // 이메일을 JSON 형태로 전송
    })
      .then((response) => {
        if (response.status == 409) alert("중복된 계정이 존재합니다.");
        if (!response.ok) {
          throw new Error("네트워크 응답에 문제가 있습니다.");
        }
        return response;
      })
      .then((data) => {
        alert("메일로 전송된 인증번호를 입력해 주세요");
      })
      .catch((error) => {});
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    fetch("http://20.41.86.171:8000/api/auth/signup", {
      method: "POST", // POST 요청
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 전송
      },
      body: JSON.stringify({ email, nickname, password }), // 이메일을 JSON 형태로 전송
    })
      .then((response) => {
        if (response.status == 409) alert("중복된 계정이 존재합니다.");

        if (!response.ok) {
          throw new Error("네트워크 응답에 문제가 있습니다.");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          alert("회원가입 되었습니다.");
          window.sessionStorage.setItem("Authorization", data.accessToken);
          window.location.href = "/";
        }
      })
      .catch((error) => {});
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    fetch("http://20.41.86.171:8000/api/auth/verify", {
      method: "POST", // POST 요청
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 전송
      },
      body: JSON.stringify({ email, number }), // 이메일을 JSON 형태로 전송
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("네트워크 응답에 문제가 있습니다.");
        }
        return response;
      })
      .then((data) => {
        alert("인증되었습니다.");
      })
      .catch((error) => {});
  };
  return (
    <div>
      <Header />
      <div className="container">
        <div className="form-container">
          <h1>회원가입</h1>
          <div className="form-row">
            <label>E-mail</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={handleInputChange}
            ></input>
            <button
              className="singup-verify-button"
              onClick={handleEmailSubmit}
            >
              전송
            </button>
          </div>
          <div className="form-row">
            <label>인증번호</label>
            <input
              type="text"
              id="number"
              value={number}
              onChange={handleInputChange}
            ></input>
            <button
              className="singup-verify-button"
              onClick={handleVerifySubmit}
            >
              인증
            </button>
          </div>
          <div className="form-row">
            <label>닉네임</label>
            <input
              type="text"
              id="nickname"
              onChange={handleInputChange}
            ></input>
          </div>
          <div className="form-row">
            <label>비밀번호</label>
            <input
              type="password"
              id="password"
              onChange={handleInputChange}
            ></input>
          </div>
          <div className="form-row">
            <label>비밀번호 확인</label>
            <input
              type="password"
              id="confirm"
              onChange={handleInputChange}
            ></input>
          </div>
          <button className="signup-button" onClick={handleSignupSubmit}>
            이메일 회원 가입
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
