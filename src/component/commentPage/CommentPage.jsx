import Header from "../Header";
import Footer from "../Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CommentPage.css";

export default function CommentPage() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  useEffect(() => {
    async function fetchComment() {
      const response = await axios.get(
        `http://20.41.86.171:8000/api/comments/${id}`,
        {
          headers: { Authorization: sessionStorage.getItem("Authorization") },
        }
      );
      setComment(response.data);
    }
    fetchComment();
  }, [id]);

  return (
    <div>
      <Header />
      <div className="container">
        <div className="comment-box">
          <h1>댓글 조회</h1>
          <div className="comment-inner-box">
            <label>작성자</label>
            <p>{comment.nickname}</p>
          </div>
          <div className="comment-inner-box">
            <label>작성 내용</label>
            <p>{comment.content}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
