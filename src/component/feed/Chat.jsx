import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./Chat.css";
const SOCKET_URL =
  "https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/chat";

const ChatComponent = ({ myGroup }) => {
  const socketRef = useRef(null);
  const messageListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { id: groupId } = myGroup;
  const [nickname, setNickname] = useState("");
  const [isMember, SetIsMember] = useState(true);
  const token = sessionStorage.getItem("Authorization");

  useEffect(() => {
    try {
      const findNickname = async () => {
        const response = await axios.get(
          `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/users`,
          { headers: { authorization: token } }
        );
        setNickname(response.data.nickname);
      };
      findNickname();
    } catch (err) {}

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      query: { groupId },
      withCredentials: true,
    });

    socketRef.current.connect();
    socketRef.current.on("chat:message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    socketRef.current.on("error", (data) => {
      SetIsMember(false);
      socketRef.current.disconnect();
    });

    socketRef.current.emit("get:prev", { room: groupId });

    return () => {
      socketRef.current.disconnect();
    };
  }, [groupId, token]);

  function handleSendMessage() {
    if (messageInput) {
      socketRef.current.emit("chat:message", {
        nickname,
        room: groupId,
        message: messageInput,
      });
      setMessageInput("");
    }
  }

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {isMember ? (
        <div>
          <p className="chat-notice">
            📣 당신과 대화를 나누는 상대는 누군가의 소중한 금지옥엽입니다.
            융숭한 대접 부탁드립니다.
          </p>
          <div
            ref={messageListRef}
            style={{
              height: "400px",
              overflowY: "scroll",
              marginBottom: "10px",
            }}
          >
            {messages.map((msg, idx) => {
              if (msg.nickname == nickname)
                return (
                  <div className="my-chat-box" key={idx}>
                    <p> {msg.content}</p>
                    <p className="chat-nickname">{msg.nickname}</p>
                  </div>
                );
              else
                return (
                  <div className="chat-box" key={idx}>
                    <p> {msg.content}</p>
                    <p className="chat-nickname">{msg.nickname}</p>
                  </div>
                );
            })}
          </div>

          <div className="chat-input-box">
            <input
              className="chat-input"
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key == "Enter") handleSendMessage();
              }}
            />
            <button
              className="chat-button"
              onClick={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="chat-notice">
            📣 채팅 서비스는 그룹의 멤버만 참여할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
