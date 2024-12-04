import React, { useState, useEffect } from "react";
import MyGroup from "./MyGroup";
import Pagination from "../posts/Pagination";

export default function MyGroupList() {
  const token = window.sessionStorage.getItem("Authorization");
  const [groups, SetGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    // 컴포넌트가 마운트될 때 API 호출
    const fetchData = async () => {
      const countResponse = await fetch(
        `https://20.41.86.171:8000/api/groups/mygroups/count`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      const count = await countResponse.json();
      setTotalPages(count);
      await fetch(
        `https://20.41.86.171:8000/api/groups/mygroups?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("네트워크 응답에 문제가 있습니다.");
          }
          return response.json();
        })
        .then((data) => {
          SetGroups(data);
        })
        .catch((error) => {});
    };

    fetchData();
  }, [currentPage, token]);

  return (
    <div className="">
      <MyGroup groups={groups}></MyGroup>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      ></Pagination>
    </div>
  );
}
