import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import "./AdminPage.css";
import Pagination from "../posts/Pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 추가

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reports, setReports] = useState([]);
  const [groupName, setGroupName] = useState("");
  const authorization = sessionStorage.getItem("Authorization");
  const [currentPath, setCurrentPath] = useState("");

  const navigate = useNavigate(); // navigate 함수 추가

  // fetchTotalPages와 fetchReports 함수들을 useEffect로 이동
  useEffect(() => {
    setCurrentPath(window.location.pathname);
    async function fetchTotalPages() {
      try {
        const response = await axios.get(
          "https://ashortwalk.store/api/reports/count",
          {
            headers: { Authorization: authorization },
          }
        );
        if (response.status === 200 || response.status === 201) {
          setTotalPages(Math.ceil(response.data / 3)); // 총 페이지 수 계산
        } else {
          navigate("/");
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate("/");
        } else {
          navigate("/"); // 다른 오류 발생 시 홈 페이지로 이동
        }
      }
    }

    async function fetchReports() {
      try {
        const response = await axios.get(
          `https://ashortwalk.store/api/reports?page=${currentPage}`,
          {
            headers: { Authorization: authorization },
          }
        );
        setReports(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate("/");
        } else {
          navigate("/"); // 다른 오류 발생 시 홈 페이지로 이동
        }
      }
    }

    if (authorization) {
      fetchTotalPages();
      fetchReports();
    } else {
      navigate("/"); // 인증 토큰이 없으면 로그인 페이지로 이동
    }
  }, [authorization, currentPage, navigate]);

  // 신고 처리 함수
  async function deleteContent(reportId) {
    try {
      const response = await axios.delete(
        `https://ashortwalk.store/api/reports/${reportId}`,
        { headers: { Authorization: authorization } }
      );
      if (response.status >= 200 && response.status < 300) {
        alert("신고가 처리되어 콘텐츠가 삭제되었습니다.");
        navigate(0); // 페이지를 새로고침 하는 방법 (리로드)
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("권한이 없습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        alert("콘텐츠 삭제에 실패했습니다.");
      }
    }
  }

  // 그룹 삭제 함수
  async function deleteGroup() {
    try {
      const response = await axios.delete(
        `https://ashortwalk.store/api/groups/${groupName}`,
        { headers: { Authorization: authorization } }
      );
      if (response.status >= 200 && response.status < 300) {
        alert("그룹이 삭제되었습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("권한이 없습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        alert("그룹 삭제에 실패했습니다.");
      }
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
              {reports.length === 0 ? (
                <p>신고 내역이 없습니다.</p>
              ) : (
                reports.map((report) => (
                  <div className="report-content-box" key={report.id}>
                    <h3>제목 : {report.reportTitle}</h3>
                    <p>내용 : {report.reportContent}</p>
                    <div className="report-button-box">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(
                            `/${report.contentType}/${report.contentId}`
                          ); // react-router로 조회 페이지로 이동
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
                ))
              )}
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
