import axios from "axios";
import React, { useState, useEffect } from "react";
import PostsCard from "./PostsCard";
import Pagination from "./Pagination";
import "./PostsCardList.css";

export default function PostsCardList() {
  const [posts, Setposts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  useEffect(() => {
    const findPost = async () => {
      const response = await axios.get(
        `https://ashortwalk.store/api/posts?page=${currentPage}`
      );
      const data = response.data;
      Setposts(data);
    };

    const findTotalPages = async () => {
      const response = await axios.get(
        `https://ashortwalk.store/api/posts/count`
      );
      const data = response.data;

      settotalPages(data.count);
    };
    findPost();
    findTotalPages();
  }, [currentPage]);

  return (
    <div className="PostsCardList">
      <button
        onClick={() => {
          window.location.href = `post/write`;
        }}
      >
        글쓰기
      </button>
      <PostsCard posts={posts}></PostsCard>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      ></Pagination>
    </div>
  );
}
