import Footer from "../Footer";
import Header from "../Header";
import React, { useState } from "react";
import "./Mission.css";
import { useParams } from "react-router-dom";

export default function MissionCreate() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const token = window.sessionStorage.getItem("Authorization");
    const { groupId } = useParams()
    const handleInputChange = (e) => {
        if ("title" === e.target.id) {
            setTitle(e.target.value.trim());
        }
        if ("content" === e.target.id) {
            setContent(e.target.value.trim());
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        fetch(
            `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/groups/${groupId}/missions`,
            {
                method: "POST", // POST 요청
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({ title, content }),
            }
        )
            .then((response) => {
                if (300 > response.status >= 200) {
                    window.location.href = "/groups";
                    alert("미션 생성 완료되었습니다.");
                } else {
                    alert("미션 생성 실패되었습니다.");
                }
                return response.json();
            })
            .then((data) => {

            })
            .catch((error) => { });
    };

    return (
        <div>
            <Header />
            <div className="container">
                <div className="form-container">
                    <h1>미션 생성</h1>
                    <div className="form-row">
                        <label>제목</label>
                        <input
                            type="text"
                            id="title"
                            className="input2"
                            onChange={handleInputChange}
                        ></input>
                    </div>
                    <div className="form-row">
                        <label>내용</label>
                        <textarea
                            type="text"
                            id="content"
                            className="textarea2"
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <button onClick={handleSubmit}>생성</button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

