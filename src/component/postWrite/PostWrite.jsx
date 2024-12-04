//PostWrite.jsx
import "./PostWrite.css";
import Header from "../Header";
import Footer from "../Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import "./WriteText.css";
import "./WriteImage.css";

export default function PostWrite() {
  const authorization = window.sessionStorage.getItem("Authorization");

  // Form 데이터 상태 관리
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 상태 업데이트 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // 첫 번째 파일 선택
    if (selectedFile) {
      // 이미지 파일 확인
      if (!selectedFile.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
      }

      // 상태 업데이트
      setFile(selectedFile); // 파일 상태 저장
      setPreview(URL.createObjectURL(selectedFile)); // 미리 보기 URL 생성
    }
  };
  // FormData POST 요청
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지

    // FormData 객체 생성
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    if (file) {
      data.append("file", file);
    }

    try {
      // 서버로 POST 요청
      alert("게시글을 작성 중입니다. 잠시만 기다려 주세요.");
      const response = await axios.post(
        "https://ashortwalk.store/api/posts",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authorization,
          },
        }
      );
      alert("게시글을 작성이 완료되었습니다.");
      window.location.href = `/posts`;
    } catch (error) {
      alert("게시글 작성에 실패하였습니다.");
    }
  };

  return (
    <div>
      <Header></Header>
      <div className="container">
        <div className="PostWrite">
          <h2>게시글 작성하기</h2>

          <div className="PWmain-content">
            <div className="WriteImage">
              {preview ? (
                <img src={preview} alt="" />
              ) : (
                <div className=""></div>
              )}
              <input
                className="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="WimageInfo"></div>
            </div>

            <div className="WriteText">
              <form onSubmit={handleSubmit}>
                <div className="text-box">
                  <input
                    type="text"
                    placeholder="제목을 입력해 주세요"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="category"
                    placeholder="카테고리를 입력해 주세요"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    className="WTcontent"
                    type="text"
                    placeholder="본문을 입력해 주세요"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div className="write-button-box">
                    <button
                      onClick={() => {
                        window.location.href = `/posts`;
                      }}
                    >
                      취소
                    </button>
                    <button type="submit">완료</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
