import React, { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import "./Map.css";
export default function Map() {
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태
  const [tDistance, setTDistance] = useState("");
  const [tTime, setTTime] = useState("");
  const [speechText, setSpeechText] = useState(""); // 음성 변환된 텍스트
  const [address, setAddress] = useState(""); // 입력된 주소
  const [descriptions, setDescriptions] = useState([]);
  const [gptKey, setGptKey] = useState(""); // GPT API 키
  const [sttKey, setSttKey] = useState(""); // STT API 키
  const [intermediatePoints, setIntermediatePoints] = useState([]); // 경로 중간 지점들
  const [resultDrawArr, setResultDrawArr] = useState([]); // 그려진 경로 배열
  const mapRef = useRef(null); // 지도 참조
  const mediaRecorderRef = useRef(null); // 미디어 레코더 참조

  // 지도 객체 초기화 완료 여부
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Azure Key 호출
  useEffect(() => {
    const fetchKeys = async () => {
      const response = await fetch("https://ashortwalk.store/api/key");
      const data = await response.json();
      setGptKey(data.gptKey);
      setSttKey(data.sttKey);
    };
    fetchKeys();
  }, []);

  // 지도 초기화
  useEffect(() => {
    const map = new window.Tmapv2.Map("map_div", {
      center: new window.Tmapv2.LatLng(37.566481622437934, 126.98502302169841),
      width: "300px",
      height: "300px",
      zoom: 14,
    });
    mapRef.current = map; // 지도 객체를 mapRef에 할당
    setIsMapInitialized(true); // 지도 초기화 완료 상태로 설정
  }, []);

  // 녹음 시작
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new RecordRTC(stream, {
      type: "audio",
      mimeType: "audio/wav",
      recorderType: RecordRTC.StereoAudioRecorder,
      desiredSampRate: 16000,
    });

    recorder.startRecording();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  // 녹음 종료
  const stopRecording = () => {
    mediaRecorderRef.current.stopRecording(async () => {
      const audioBlob = mediaRecorderRef.current.getBlob();
      await handleSpeechToText(audioBlob);
    });
    setIsRecording(false);
  };

  // 음성 텍스트 변환
  const handleSpeechToText = async (audioBlob) => {
    try {
      const response = await sendAudioToServer(audioBlob);
      setSpeechText(response);
      setAddress(response); // 음성 텍스트를 주소로 설정
    } catch (error) {
      alert("경로 생성에 실패하였습니다. 주소를 다시 한 번 전송해 주세요.");
    }
  };

  // STT 서버에 오디오 보내기
  const sendAudioToServer = async (audioBlob) => {
    const endpoint =
      "https://koreacentral.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=ko-KR";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": sttKey,
        "Content-Type": "audio/wav",
      },
      body: audioBlob,
    });
    const data = await response.json();
    return data.DisplayText;
  };

  // GPT API 호출하여 경로 생성
  const gpt = async (address) => {
    setDescriptions([]);
    setAddress("");
    alert(
      "AI가 추천 경로를 탐색합니다. 잠시만 기다려 주세요. 최대 1분 소요됩니다."
    );
    const promptData = {
      messages: [
        {
          role: "system",
          content:
            "너는 주어진 주소를 최대한 알맞는 도로명 주소로 해석해서 도로명주소만을 배열에 담아 json으로 감싸 출력하는 AI야. 산책 경로는 무조건 3km 내외로 추천해 줘야 해.",
        },
        {
          role: "user",
          content: `${address}에서 출발하고 끝나는 총 3km의 왕복 산책 코스의 출발지 1개의 도로명주소와 중간지점 5개 도로명주소를 배열에 담아서 data라는 key를 가진 json에 넣어 줘.`,
        },
      ],
    };

    try {
      const response = await fetch(
        "https://warme-m3p2wioi-francecentral.cognitiveservices.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview",
        {
          method: "POST",
          headers: { "api-key": gptKey, "Content-Type": "application/json" },
          body: JSON.stringify(promptData),
        }
      );
      const gptResult = await response.json();
      const cleanedResult = gptResult.choices[0].message.content
        .replace(/^```json\n/, "")
        .replace(/\n```$/, "")
        .trim();
      const result = JSON.parse(cleanedResult);
      await geocoding(result.data);
      setAddress(result.data[0]);
    } catch (error) {
      alert("경로 생성에 실패하였습니다. 주소를 다시 한 번 전송해 주세요.");
    }
  };

  // Geocoding 함수
  const geocoding = async (addresses) => {
    const points = [];

    for (const addressStr of addresses) {
      try {
        const response = await fetch(
          `https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?addressFlag=F02&coordType=WGS84GEO&version=1&fullAddr=${encodeURIComponent(
            addressStr
          )}&page=1&count=1`,
          {
            method: "GET",
            headers: { appKey: "BiGizFCY2P9VSwbZPJ4Mz1YuVwY7dEyH8dna6U4D" },
          }
        );
        const data = await response.json();
        if (
          data &&
          data.coordinateInfo &&
          data.coordinateInfo.coordinate.length > 0
        ) {
          const latLng = new window.Tmapv2.LatLng(
            data.coordinateInfo.coordinate[0].newLat,
            data.coordinateInfo.coordinate[0].newLon
          );
          points.push(latLng);
        } else {
        }

        await new Promise((resolve) => setTimeout(resolve, 400));
      } catch (error) {
        alert("경로 생성에 실패하였습니다. 주소를 다시 한 번 전송해 주세요.");
      }
    }

    if (points.length >= 2) {
      setIntermediatePoints(points);
      await fetchRouteData(points); // 경로 데이터를 바로 가져옴
    } else {
    }
  };

  // 경로 데이터 가져오기
  const fetchRouteData = async (points) => {
    if (points.length < 2) {
      alert("경로를 그릴 수 있는 충분한 점이 없습니다.");
      return;
    }

    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    const requestData = {
      startX: startPoint.lng(),
      startY: startPoint.lat(),
      endX: endPoint.lng(),
      endY: endPoint.lat(),
      reqCoordType: "WGS84GEO",
      resCoordType: "EPSG3857",
      startName: "출발지",
      endName: "도착지",
    };

    try {
      const response = await fetch(
        "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
        {
          method: "POST",
          headers: { appKey: "BiGizFCY2P9VSwbZPJ4Mz1YuVwY7dEyH8dna6U4D" },
          body: JSON.stringify(requestData),
        }
      );
      const data = await response.json();
      processRouteData(data); // 경로 데이터를 처리합니다.
    } catch (err) {
      alert("경로 생성에 실패하였습니다. 주소를 다시 한 번 전송해 주세요.");
    }
  };

  // 경로 데이터 처리
  const processRouteData = (responseData) => {
    const resultData = responseData.features;

    // 기존 마커 및 선 제거
    resultDrawArr.forEach((line) => line.setMap(null)); // 기존 경로 제거
    setResultDrawArr([]); // resultDrawArr 초기화

    const newDrawInfoArr = [];

    // 경로가 제대로 데이터로 변환되는지 확인
    resultData.forEach((feature) => {
      const { geometry, properties } = feature;
      setDescriptions((prev) => {
        if (properties.description.includes(",")) {
          return [...prev];
        } else {
          return [...prev, properties.description];
        }
      });
      if (geometry.type === "LineString") {
        geometry.coordinates.forEach((coordinate) => {
          const latlng = new window.Tmapv2.Point(coordinate[0], coordinate[1]);
          const convertPoint =
            new window.Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
          const convertChange = new window.Tmapv2.LatLng(
            convertPoint._lat,
            convertPoint._lng
          );
          newDrawInfoArr.push(convertChange);
        });
      }
    });

    if (newDrawInfoArr.length > 0) {
      drawRoute(newDrawInfoArr); // 경로 그리기
    } else {
    }
  };

  // 경로 그리기
  const drawRoute = (newDrawInfoArr) => {
    if (!isMapInitialized) {
      return;
    }

    if (newDrawInfoArr.length === 0) {
      return;
    }

    // 기존 경로 삭제
    resultDrawArr.forEach((line) => line.setMap(null)); // 기존 경로 지우기

    const lineString = new window.Tmapv2.Polyline({
      path: newDrawInfoArr,
      strokeColor: "#42adfb",
      strokeWeight: 6,
      strokeOpacity: 0.8,
    });

    // 지도에 경로를 추가
    lineString.setMap(mapRef.current);
    // 지도 중심을 첫 번째 지점으로 설정
    if (newDrawInfoArr.length > 0) {
      mapRef.current.setCenter(newDrawInfoArr[0]);
    }
    setResultDrawArr([lineString]); // 새로운 경로 객체 상태 업데이트
  };

  return (
    <div>
      <div id="map_div" style={{ width: "100%", height: "500px" }}></div>
      <p id="map_notice">
        시,도 단위를 포함한 도로명 주소를 말하거나 입력하세요.
      </p>
      <p id="map_notice">음성 인식 후 표시된 주소가 상이해도 놀라지 마세요!</p>
      <p id="map_notice"> AI가 가장 가까운 도로명 주소로 해석합니다.</p>

      <div id="search-box">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="주소 입력"
          id="address"
        />
        <button
          id="recordButton"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "✔️" : "🎙️"}
        </button>
        <button id="drawLineBtn" onClick={() => gpt(address)}>
          전송
        </button>
      </div>
      <div id="route">
        {descriptions?.map((desc) => (
          <div id="addr">{desc}</div>
        ))}
      </div>
    </div>
  );
}
