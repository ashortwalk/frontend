import React from "react";

export default function Group({ groups }) {
  const authorization = sessionStorage.getItem("Authorization");
  const handleJoinGroup = (groupId) => {
    fetch(`http://localhost:8000/api/groups/${groupId}/members`, {
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
    <div className="">
      {groups.map((group) => {
        return (
          <div
            className=""
            onClick={(e) => {
              e.preventDefault();

              if (e.target.className !== "group-join-button") {
                window.location.href = `/groups/${group.id}/feeds`;
              }
            }}
          >
            <div>
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