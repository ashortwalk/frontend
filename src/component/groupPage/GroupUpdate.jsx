import Footer from "../Footer";
import Header from "../Header";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function GroupUpdate() {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const token = window.sessionStorage.getItem("Authorization");

  const location = useLocation(); // useLocation을 사용해 state 가져오기
  const data = location.state; // 전달된 state 데이터

  useEffect(() => {
    // 컴포넌트가 마운트될 때 API 호출
    const fetchData = async () => {
      fetch(`https://ashortwalk.store/api/groups/${data.id}`, {
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
          setGroupName(data.groupName);
          setDescription(data.description);
        })
        .catch((error) => {});
    };

    fetchData();
  }, []); // 빈 배열을 넣어 컴포넌트 마운트 시 한 번만 실행되도록 함

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

    fetch(`https://ashortwalk.store/api/groups/${data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ groupName, description }),
    })
      .then((response) => {
        if (response.ok) {
          alert("그룹수정 완료되었습니다.");
        } else {
          alert("그룹수정 실패하였습니다.");
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
          <h1>그룹 수정</h1>
          <div className="form-row">
            <label>그룹 이름</label>
            <input
              type="text"
              id="groupName"
              className="input2"
              value={groupName}
              onChange={handleInputChange}
            ></input>
          </div>
          <div className="form-row">
            <label>그룹 설명</label>
            <input
              type="text"
              id="description"
              className="input2"
              value={description}
              onChange={handleInputChange}
            ></input>
          </div>
          <button onClick={handleSubmit}>그룹 수정하기</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
