import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function PostImgContent({ data, user }) {
  const {
    id: postId,
    title,
    image,
    content,
    createdAt,
    nickname,
    viewCount,
    userId,
    category,
  } = data;
  const navigate = useNavigate();
  const authorization = window.sessionStorage.getItem("Authorization");

  const endpoint = "https://stimgshortwalk.blob.core.windows.net/images/";
  const url = image ? endpoint + image : null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="PostImgContent">
      <div className="ImgBox">
        {url ? <img className="image-file" src={url} alt="" /> : <div></div>}
      </div>
      <div className="PostComment">
        <h2>{title}</h2>

        <p>{content}</p>
        <p>{nickname}</p>
        <p>{formatDate(createdAt)}</p>

        <p>
          <span>👁️</span>
          {viewCount}
        </p>
        <p className="category">{category}</p>
      </div>
      <div className="PIButtonContent">
        {user.id == userId ? (
          <>
            <button onClick={() => navigate(`/post/edit/${postId}`)}>
              수정
            </button>
            <button
              onClick={async () => {
                if (window.confirm("정말로 삭제하시겠습니까?")) {
                  try {
                    await axios.delete(
                      `https://ashortwalk.store/api/posts/${postId}`,
                      {
                        headers: {
                          Authorization: authorization,
                        },
                      }
                    );
                    alert("게시물이 삭제되었습니다.");
                    navigate("/posts");
                  } catch (error) {
                    alert("게시물 삭제에 실패했습니다.");
                  }
                }
              }}
            >
              삭제
            </button>
          </>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `https://ashortwalk.store/reports/posts/${postId}`;
            }}
          >
            신고
          </button>
        )}
      </div>
    </div>
  );
}
