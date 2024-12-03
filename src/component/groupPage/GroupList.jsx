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
        `http://localhost:3000/api/groups?page=${currentPage}`
      );
      const data = response.data;
      SetGroups(data);
    };

    const findTotalPages = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/groups/count`
      );
      const data = response.data;
      setTotalPages(data);
    };
    findGroup();
    findTotalPages();
  }, [currentPage]);

  return (
    <div className="GroupList">
      <Group groups={groups}></Group>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      ></Pagination>
    </div>
  );
}
