import "./PostEdit.css";
import Header from "../Header";
import Footer from "../Footer";
import "./EditImage.css";
import "./EditText.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // match 대신 useParams 사용
import axios from "axios";

export default function PostEdit() {
  const { id: postId } = useParams(); // URL에서 게시물 ID 추출

  const authorization = window.sessionStorage.getItem("Authorization");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/posts/${postId}`,
          {
            headers: {
              Authorization: authorization,
            },
          }
        );
        const { title, content, category, image_url } = response.data;
        setFormData({ title, content, category });
        if (image_url) setPreview(image_url); // 기존 이미지 설정
      } catch (error) {
        alert(
          error.response?.data?.message || "게시물 정보를 가져오지 못했습니다."
        );
      }
    };
    fetchPost();
  }, [postId, authorization]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        setFile(null);
        setPreview(null);
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    if (file) data.append("file", file);

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/posts/${postId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authorization,
          },
        }
      );

      alert("게시물이 수정되었습니다!");
      window.location.href = `/posts/${postId}`;
    } catch (error) {
      alert(error.response?.data?.message || "게시물 수정에 실패했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="PostWrite">
          <h2>게시글 수정하기</h2>
          <div className="PWmain-content">
            <div className="EditImage">
              {preview ? (
                <img src={preview} alt="" className="preview" />
              ) : (
                <div className="WimageBox"></div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="EditText">
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
                    type="text"
                    placeholder="카테고리를 입력해 주세요"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    className="content"
                    placeholder="본문을 입력해 주세요"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div className="write-button-box">
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href = `/posts/${postId}`;
                      }}
                    >
                      취소
                    </button>
                    <button type="submit">수정</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
