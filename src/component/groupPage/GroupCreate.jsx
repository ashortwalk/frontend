import Footer from "../Footer";
import Header from "../Header";
import React, { useState } from "react";
import "./GroupCreate.css";

export default function GroupCreate() {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const token = window.sessionStorage.getItem("Authorization");

  const handleInputChange = (e) => {
    if ("groupName" === e.target.id) {
      setGroupName(e.target.value.trim());
    }
    if ("description" === e.target.id) {
      setDescription(e.target.value.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    fetch("https://20.41.86.171:8000/api/groups", {
      method: "POST", // POST 요청
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ groupName, description }),
    })
      .then((response) => {
        if (response.ok) {
          alert("그룹생성 완료되었습니다.");
        } else {
          alert("그룹생성 실패하였습니다.");
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = "/groups";
      })
      .catch((error) => {});
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="form-container">
          <h1>그룹 생성</h1>
          <div className="form-row">
            <label>그룹 이름</label>
            <input
              type="text"
              id="groupName"
              className="input2"
              onChange={handleInputChange}
            ></input>
          </div>
          <div className="form-row">
            <label>그룹 설명</label>
            <input
              type="text"
              id="description"
              className="input2"
              onChange={handleInputChange}
            ></input>
          </div>
          <button onClick={handleSubmit}>그룹 생성하기</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
