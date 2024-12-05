import React from "react";
import "./PostsCard.css";

export default function PostsCard({ posts }) {
  const endpoint = "https://stimgshortwalk.blob.core.windows.net/thumbnails/";
  return (
    <div className="PostsCard">
      {posts.map((post) => {
        const url = post.thumbnail ? endpoint + post.thumbnail : null; // 이미지 URL 생성
        return (
          <div
            className="PCcontent"
            key={post.id}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/posts/${post.id}`;
            }}
          >
            {url ? (
              <img src={url} alt={url} />
            ) : (
              <div className="no-image">이미지 없음</div>
            )}
            <h3>{post.title}</h3>

            <p>{post.nickname}</p>
            <p>{post.createdAt.split("T")[0]}</p>
            <p>
              <span className="viewcount">👁️</span>
              {post.viewCount}
            </p>
            <p className="category">{post.category}</p>
          </div>
        );
      })}
    </div>
  );
}
