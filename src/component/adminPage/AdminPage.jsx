import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import "./AdminPage.css";
import Pagination from "../posts/Pagination";
import axios from "axios";

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reports, setReports] = useState([]);
  const [groupName, setGroupName] = useState("");
  const authorization = sessionStorage.getItem("Authorization");
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    // 관리자 여부 체크
    async function fetchTotalPages() {
      const response = await axios.get(
        "https://ashortwalk.store/api/reports/count",
        {
          headers: { Authorization: authorization },
        }
      );

      // 서버 응답이 200, 201일 때만 관리자로 설정
      if (response.status === 200 || response.status === 201) {
        setTotalPages(Math.ceil(response.data / 3)); // 총 페이지 수 계산
      } else if (response.status == 401 || response.status == 403) {
        window.location.href = "https://ashortwalk.store";
      }
    }

    async function fetchReports() {
      const response = await axios.get(
        `https://ashortwalk.store/api/reports?page=${currentPage}`,
        {
          headers: { Authorization: authorization },
        }
      );
      setReports(response.data);
    }

    fetchTotalPages();
    fetchReports();
  }, [currentPage]);

  // 신고 처리 함수
  async function deleteContent(reportId) {
    const response = await axios.delete(
      `https://ashortwalk.store/api/reports/${reportId}`,
      { headers: { Authorization: authorization } }
    );
    if (response.status >= 200 && response.status < 300) {
      alert("신고가 처리되어 콘텐츠가 삭제되었습니다.");
      window.location.reload();
    }
  }

  // 그룹 삭제 함수
  async function deleteGroup() {
    const response = await axios.delete(
      `https://ashortwalk.store/api/groups/${groupName}`,
      { headers: { Authorization: authorization } }
    );
    if (response.status >= 200 && response.status < 300) {
      alert("그룹이 삭제되었습니다.");
    }
  }

  return (
    <div>
      <Header />
      <div className="group-outer-box">
        <h1 className="admin-title">Admin</h1>
        <div className="group-inner-box">
          <div className="group-box">
            <div className="group-border-box">
              {/* 그룹삭제 */}
              <div className="admin-box">
                <h2 className="admin-subtitle">그룹 삭제</h2>
                <div className="group-name-box">
                  <label className="admin-label">그룹 이름</label>
                  <input
                    className="group-name"
                    onChange={(e) => {
                      e.preventDefault();
                      setGroupName(e.target.value);
                    }}
                  />
                </div>
                <button
                  className="group-delete-button"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteGroup();
                  }}
                >
                  그룹 삭제
                </button>
              </div>
            </div>
          </div>

          <div className="group-border-box">
            <h2 className="report-subtitle">신고 내역</h2>
            <div id="report-list">
              {reports.map((report) => {
                return (
                  <div
                    className={`report-content-box ${
                      reports.length === 0 ? "empty" : ""
                    }`}
                    key={report.id}
                  >
                    <h3>제목 : {report.reportTitle}</h3>
                    <p>내용 : {report.reportContent}</p>
                    <div className="report-button-box">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/${report.contentType}/${report.contentId}`;
                        }}
                      >
                        조회
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteContent(report.id);
                        }}
                      >
                        처리
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="report-pagination">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
