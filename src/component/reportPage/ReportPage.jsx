import Header from "../Header";
import Footer from "../Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ReportPage.css";
export default function ReportPage() {
  const { contentType, contentId } = useParams();
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const body = { contentType, contentId, reportTitle, reportContent };
  const authorization = sessionStorage.getItem("Authorization");
  async function report() {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/reports`,
      body,
      {
        headers: { Authorization: authorization },
      }
    );
    if (response.status === 201 || response.status === 200) {
      alert("신고가 정상적으로 접수되었습니다.");
      window.history.back();
    } else {
      alert("신고가 정상적으로 접수되지 않았습니다. 다시 한 번 시도해 주세요.");
    }
  }

  return (
    <div>
      <Header />
      <div className="container">
        <div className="report-box">
          <h1>신고 작성</h1>
          <div className="report-inner-box">
            <label>신고 제목</label>
            <input
              className="report-input"
              type="text"
              onChange={(e) => {
                setReportTitle(e.target.value);
              }}
            />
          </div>
          <div className="report-inner-box">
            <label>신고 내용</label>
            <input
              className="report-input"
              type="text"
              onChange={(e) => {
                setReportContent(e.target.value);
              }}
            />
          </div>
          <button
            className="report-button"
            onClick={(e) => {
              e.preventDefault();
              report();
            }}
          >
            신고 제출
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}