import axios from "axios";
import React, { useState, useEffect } from "react";
import Group from "./Group";
import Pagination from "../posts/Pagination";

export default function GroupList() {
  const [groups, SetGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const findGroup = async () => {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/groups?page=${currentPage}`
      );
      const data = response.data;
      SetGroups(data);
    };

    const findTotalPages = async () => {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/groups/count`
      );
      const data = response.data;
      setTotalPages(data);
    };
    findGroup();
    findTotalPages();
  }, [currentPage]);
  console.log(totalPages);
  return (
    <div>
      <Group groups={groups}></Group>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      ></Pagination>
    </div>
  );
}