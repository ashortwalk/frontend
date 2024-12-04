// import WriteComment from "./commentsidebar/WriteComment";
// import CommentList from "./commentsidebar/CommentList";
import "./PostCommentContent.css";
import "./commentsidebar/WriteComment.css";
import "./commentsidebar/CommentList.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PostCommentContent() {
  const { id: postId } = useParams();
  // id:postid 유저아이디
  // id 댓글 아이디
  const authorization = window.sessionStorage.getItem("Authorization");

  const [content, setContent] = useState(""); //댓글입력 상태
  const [comments, setComments] = useState([]); //댓글목록 상태

  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editingContent, setEditingContent] = useState(""); // 수정 중인 댓글 내용
  const [user, setUser] = useState("");
  //===댓글 입력창===
  const handleSubmin = (e) => {
    e.preventDefault();
    if (!content) {
      alert("댓글 내용을 입력해주세요."); // 빈 댓글 방지
      return;
    }

    try {
      const commentwite = async () => {
        const response = await axios.post(
          `http://20.41.86.171:8000/api/posts/${postId}/comments`,
          { content },
          {
            headers: {
              Authorization: authorization,
            },
          }
        );
        setContent("");
      };

      setComments([...comments]);
      commentwite();
    } catch (error) {}
  };

  //===댓글 목록===
  useEffect(() => {
    const findComments = async () => {
      try {
        const response = await axios.get(
          `http://20.41.86.171:8000/api/posts/${postId}/comments`,
          {}
        );
        setComments(response.data);
      } catch (error) {}
    };
    const findUser = async () => {
      const response = await axios.get(`http://20.41.86.171:8000/api/users`, {
        headers: { authorization },
      });
      setUser(response.data);
    };
    findComments();
    findUser();
  }, [content]);

  // 댓글 수정 시작
  const startEditing = (id, currentContent) => {
    setEditingCommentId(id);
    setEditingContent(currentContent);
  };

  // 댓글 수정 저장
  const saveEditing = async (id) => {
    try {
      const response = await axios.patch(
        `http://20.41.86.171:8000/api/posts/${postId}/comments/${id}`,
        { content: editingContent },
        {
          headers: {
            Authorization: authorization,
          },
        }
      );

      setComments(
        comments.map((comment) =>
          comment.id === id
            ? { ...comment, content: response.data.content }
            : comment
        )
      );
      setEditingCommentId(null); // 수정 모드 종료
    } catch (error) {}
  };

  // 댓글 수정 취소
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  return (
    <div className="PostCommentContent">
      {/* ====댓글쓰기==== */}
      <div className="WriteContent">
        <form onSubmit={handleSubmin}>
          <input
            value={content}
            type="text"
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 작성해 주세요."
            onKeyDown={(e) => {
              if (e.key == "Enter") handleSubmin();
            }}
          />
          <button type="submit">작성</button>
        </form>
      </div>

      {/* ====댓글목록===수정=삭제==== */}
      <div className="CommentList">
        {comments.map((comm) => {
          const { content, nickname, createdAt } = comm;
          return (
            <div key={comm.id} className="CommentListContent">
              <div className="CLCdetail">
                {editingCommentId === comm.id ? (
                  <div>
                    <input
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") saveEditing(comm.id);
                      }}
                    />
                    <button onClick={() => saveEditing(comm.id)}>저장</button>
                    <button onClick={cancelEditing}>취소</button>
                  </div>
                ) : (
                  <>
                    <h3>{content}</h3>
                    <p>{nickname}</p>
                    <p>{createdAt.split("T")[0]}</p>
                    <div className="CLCbutton">
                      {user.id == comm.userId ? (
                        <>
                          {" "}
                          {/* 댓글 수정 */}
                          {editingCommentId !== comm.id && (
                            <button
                              onClick={() => startEditing(comm.id, content)}
                            >
                              수정
                            </button>
                          )}
                          {/* =====댓글삭제 */}
                          <button
                            onClick={async () => {
                              if (window.confirm("댓글을 삭제하시겠습니까?")) {
                                try {
                                  await axios.delete(
                                    `http://20.41.86.171:8000/api/posts/${postId}/comments/${comm.id}`,
                                    {
                                      headers: {
                                        Authorization: authorization,
                                      },
                                    }
                                  );
                                  setComments(
                                    comments.filter(
                                      (comment) => comment.id !== comm.id
                                    )
                                  );
                                } catch (error) {}
                              }
                            }}
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="CLCReportComment"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `http://20.41.86.171:3000/reports/comments/${comm.id}`;
                            }}
                          >
                            신고
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
