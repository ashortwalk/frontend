import React, { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import "./MyPage.css";
import {
  Chart as ChartJS,
  RadarController,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import axios from "axios";

// 필요한 Chart.js 모듈 등록
ChartJS.register(
  RadarController,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function Chart() {
  const [data, setData] = useState(null); // 차트 데이터 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/statistics/category",
          {
            headers: {
              Authorization: window.sessionStorage.getItem("Authorization"),
            },
          }
        );

        // 서버에서 받은 데이터 처리
        const labels = [];
        const datas = [];
        response.data.forEach((item) => {
          labels.push(item.category);
          datas.push(Number(item.count)); // 데이터를 숫자로 변환
        });

        // 차트 데이터를 설정
        setData({
          labels, // 오각형의 각 꼭짓점에 해당하는 레이블
          datasets: [
            {
              label: "산책 성향",
              data: datas, // 실제 데이터 값 (각각의 축에 대응하는 값)
              fill: true, // 차트 내부를 채울지 여부
              backgroundColor: "rgba(75, 192, 192, 0.2)", // 내부 색상
              borderColor: "rgb(75, 192, 192)", // 선 색상
              borderWidth: 2, // 선 두께
            },
          ],
        });
      } catch (error) {
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };

    fetchData();
  }, []); // 컴포넌트가 마운트될 때 한 번만 호출

  // 로딩 중일 때 메시지 표시
  if (isLoading) {
    return (
      <div className="chart-box">
        <p>산책 성향을 통계하고 있습니다.</p>
        <p>잠시만 기다려 주세요.</p>
      </div>
    );
  }

  // 데이터가 없으면 에러 처리
  if (!data) {
    return <div className="chart-box"></div>;
  }

  // 차트 옵션
  const options = {
    responsive: true,
    scale: {
      ticks: {
        beginAtZero: true, // 값이 0부터 시작하도록 설정
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
    <div className="chart">
      <Radar data={data} options={options} />
    </div>
  );
}
