import "./FeedPage.css";
import Header from "../Header";
import Footer from "../Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Pagination from "../posts/Pagination";
import Chat from "./Chat";

export default function FeedPage() {
  const authorization = window.sessionStorage.getItem("Authorization");
  const { groupId } = useParams();
  const [feedlist, setFeedlist] = useState([]); //피드 목록
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [myGroup, setMyGroup] = useState({});

  //화면 레더링 시 feed목록가져오기  api/groups/:groupId/feeds
  useEffect(() => {
    const findFeed = async () => {
      const response = await axios.get(
        `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/groups/${groupId}/feeds?page=${currentPage}`
      );
      setFeedlist(response.data);
    };
    const countFeeds = async () => {
      const response = await axios.get(
        `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/groups/${groupId}/feeds/count`
      );
      setTotalPages(response.data);
    };
    const findMyGroup = async () => {
      try {
        const response = await axios.get(
          `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/groups/${groupId}`
        );

        setMyGroup(response.data);
      } catch (error) { }
    };

    findFeed();
    countFeeds();
    findMyGroup();
  }, [currentPage, groupId]);

  // const [feeds, setFeeds] = useState([]); //피드 목록상태
  const [content, setContent] = useState(""); //피드입력 상태

  const [editingContentId, setEditingContentId] = useState(null); // 수정 중인 피드 ID
  const [editingContent, setEditingContent] = useState(""); // 수정 중인 피드 내용

  //피드 content 입력창
  const handleSubmin = (e) => {
    e.preventDefault();
    if (!content) {
      alert("피드 내용을 입력해주세요");
      return;
    }
    try {
      const feedContentWrite = async () => {
        const response = await axios.post(
          `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/groups/${groupId}/feeds`,
          { content },
          {
            headers: {
              Authorization: authorization,
            },
          }
        );
        if (200 <= response.status < 300) {
          setContent("");
          window.location.reload();
        }
      };
      feedContentWrite();
    } catch (e) { }
  };

  // 피드 수정 시작
  const startEditing = (id, currentContent) => {
    setEditingContentId(id);
    setEditingContent(currentContent);
  };

  // 피드 수정 저장
  const saveEditing = async (id) => {
    try {
      const response = await axios.patch(
        `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/groups/${groupId}/feeds/${id}`,
        { content: editingContent },
        {
          headers: {
            Authorization: authorization,
          },
        }
      );

      setFeedlist(
        feedlist.map((feed) =>
          feed.id === id ? { ...feed, content: response.data.content } : feed
        )
      );
      setEditingContentId(null); // 수정 모드 종료
    } catch (error) { }
  };

  // 피드 수정 취소
  const cancelEditing = () => {
    setEditingContentId(null);
    setEditingContent("");
  };
  //======================================================================================
  return (
    <div className="FeedPage">
      <Header></Header>

      <div className="FPmainContent">
        {/* 피드내용 */}
        <div className="FeedContent">
          <div className="FeedInfo">
            <div className="FeedInfoText">
              <h2>{myGroup.groupName}</h2>
              <p>{myGroup.description}</p>
              <p>{myGroup.leaderNickname}</p>
              <button onClick={(e) => { e.preventDefault(); window.location.href = `/groups/${groupId}/missions/create` }}>미션 생성</button>
            </div>
            <form onSubmit={handleSubmin}>
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setContent(e.target.value);
                }}
                type="text"
              />
              <button type="submit">피드 생성</button>
            </form>
          </div>

          <div className="FeedList">
            {feedlist.map((feed) => {
              return (
                <div key={feed.id} className="FeedListContent">
                  <div className="FeedChange">
                    {/* 피드수정버튼 */}
                    {editingContentId === feed.id ? (
                      <div className="CFeedinput">
                        <input
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                        />
                        <button onClick={() => saveEditing(feed.id)}>
                          저장
                        </button>
                        <button onClick={cancelEditing}>취소</button>
                      </div>
                    ) : (
                      <div className="CFeeddetail">
                        <div className="feeddetailBox">
                          <p>{feed.content}</p>
                          <p>{feed.nickname}</p>
                          <p>{feed.createdAt.split("T")[0]}</p>
                        </div>

                        <div className="FeedButton">
                          {/* 피드수정 */}
                          {editingContentId !== feed.id && (
                            <button
                              onClick={() =>
                                startEditing(feed.id, feed.content)
                              }
                            >
                              수정
                            </button>
                          )}
                          {/* 피드삭제 */}
                          <button
                            onClick={async () => {
                              if (window.confirm("피드를 삭제하기겠습니까?")) {
                                try {
                                  await axios.delete(
                                    `http://127.0.0.1:8000/api/groups/${groupId}/feeds/${feed.id}`,
                                    {
                                      headers: {
                                        Authorization: authorization,
                                      },
                                    }
                                  );
                                  setFeedlist(
                                    feedlist.filter(
                                      (feeds) => feeds.id !== feed.id
                                    )
                                  );
                                } catch (e) { }
                              }
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          ></Pagination>
        </div>

        {/* 피드채팅 */}
        <div className="FeedChating">
          <Chat myGroup={myGroup} />
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}
