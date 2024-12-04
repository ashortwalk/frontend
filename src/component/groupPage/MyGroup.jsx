import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./MyGroup.css";

export default function MyGroup({ groups }) {
  const navigate = useNavigate();
  const token = window.sessionStorage.getItem("Authorization");
  const [loginId, setLoginId] = useState("");
  const handelUpdateButtonClick = (id) => {
    const dataToSend = { id };
    navigate(`/groups/${id}/update`, { state: dataToSend });
  };
  const handleSignOutButtonClick = (id) => {
    fetch(`https://ashortwalk.store/api/groups/${id}/members`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("그룹 탈퇴 완료되었습니다.");
        } else {
          alert("그룹 탈퇴 실패하였습니다.");
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = "/groups";
      })
      .catch((error) => {});
  };
  const handelDeleteButtonClick = (id) => {
    fetch(`https://ashortwalk.store/api/groups/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("그룹 삭제 완료되었습니다.");
        } else {
          alert("그룹 삭제 실패하였습니다.");
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = "/groups";
      })
      .catch((error) => {});
  };
  useState(() => {
    const fetchUserId = (id) => {
      fetch(`https://ashortwalk.store/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setLoginId(data.id);
        })
        .catch((error) => {});
    };

    fetchUserId();
  }, []);
  console.log(groups);
  return (
    <div className="myGroup">
      {groups.map((group) => {
        return (
          <div
            className="myGroupContainer"
            onClick={(e) => {
              e.preventDefault();

              if (e.target.className !== "my-group-btn") {
                window.location.href = `/groups/${group.id}/feeds`;
              }
            }}
          >
            <div className="myGroupDetail">
              <h3>{group.groupName}</h3>
              <p>{group.description}</p>
              <p>{group.leaderNickname}</p>
            </div>
            {loginId === group.leaderUserId ? (
              <div className="myGroupButton">
                <button
                  className="my-group-btn"
                  onClick={() => handelUpdateButtonClick(group.id)}
                >
                  수정
                </button>
                <button
                  className="my-group-btn"
                  onClick={() => handelDeleteButtonClick(group.id)}
                >
                  삭제
                </button>
              </div>
            ) : (
              <div className="myGroupButton">
                <button
                  className="my-group-btn"
                  onClick={() => handleSignOutButtonClick(group.id)}
                >
                  탈퇴
                </button>
              </div>
            )}
          </div>
        );
      })}{" "}
    </div>
  );
}
