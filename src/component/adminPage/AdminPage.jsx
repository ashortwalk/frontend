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
  useEffect(() => {
    async function fetchReports() {
      const response = await axios.get(
        `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/reports?page=${currentPage}`,
        {
          headers: { Authorization: authorization },
        }
      );
      setReports(response.data);
    }
    async function fetchTotalPages() {
      const response = await axios.get(
        "https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/reports/count",
        { headers: { Authorization: authorization } }
      );
      setTotalPages(response.data.count);
    }
    fetchTotalPages();
    fetchReports();
  }, [authorization, currentPage]);

  async function deleteContent(reportId) {
    const response = await axios.delete(
      `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/reports/${reportId}`,
      {
        headers: { Authorization: authorization },
      }
    );
    if (300 > response.status >= 200) {
      alert("신고가 처리되어 콘텐츠가 삭제되었습니다.");
      window.location.reload();
    }
  }
  async function deleteGroup() {
    const response = await axios.delete(
      `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/groups/${groupName}`,
      { headers: { Authorization: authorization } }
    );
    if (300 > response.status >= 200) {
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
            <div id="report-list">
              {reports.map((report) => {
                return (
                  <div className="report-content-box">
                    <h3>{report.reportTitle}</h3>
                    <p>{report.reportContent}</p>
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
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            ></Pagination>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
