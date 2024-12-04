import React from "react";
import "./Group.css";

export default function Group({ groups }) {
  const authorization = sessionStorage.getItem("Authorization");
  const handleJoinGroup = (groupId) => {
    fetch(`https://20.41.86.171:8000/api/groups/${groupId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("그룹 가입이 완료되었습니다.");
          window.location.reload();
        } else {
          alert("그룹 가입에 실패하였습니다.");
        }
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {});
  };

  return (
    <div className="GroupComponent">
      {groups.map((group) => {
        return (
          <div
            className="group-Container"
            onClick={(e) => {
              e.preventDefault();

              if (e.target.className !== "group-join-button") {
                window.location.href = `/groups/${group.id}/feeds`;
              }
            }}
          >
            <div className="group-Container-Detail">
              <h3>{group.groupName}</h3>
              <p>{group.description}</p>
              <p>{group.leaderNickname}</p>
            </div>
            <button
              className="group-join-button"
              onClick={(e) => {
                e.preventDefault();
                handleJoinGroup(group.id);
              }}
            >
              가입
            </button>
          </div>
        );
      })}
    </div>
  );
}
