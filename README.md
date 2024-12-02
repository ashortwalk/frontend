
<img src="https://github.com/user-attachments/assets/e11880de-7f4c-428d-9ee8-bac6a70e0efd" width="200" height="200">

# 짧은 산책 Frontend

일상을 한 걸음 앞으로, 산책 커뮤니티 “ 짧은 산책 “ 입니다.

- 배포 주소 : [바로가기](https://ashortwalk-gkd3dvdpfcexb0ce.koreacentral-01.azurewebsites.net/)

# 👟 TEAM

- 팀 명
  zeroeqaulszero (영은영)
- 팀원 소개
  | 이름 | 프론트엔드 담당 기능 |
  | ------------------- | 
  | 이다영 | 채팅, 관리자, 산책 경로 추천, 산책 성향 통계 |
  | 한영희 | 게시판, 그룹, 피드, 랜딩 페이지 |
  | 조은혜 | 회원가입, 로그인, 그룹, 회원 관리 |
 

- 개발 일정
  2024년 11월 19일 ~ 2024년 12월 2일 (2주)

- 개발 과정

  [마일스톤](https://docs.google.com/spreadsheets/d/1SSaSrOxuqmxmiVsNv_Pw6xuxpjbTNivPiRzatUcC_YY/edit?gid=0#gid=0)

# 🏃‍♀️ Project

- 프로젝트 명
  - 짧은산책(ashortwalk)
- 프로젝트 목적
  - 산책 커뮤니티
  - 은둔 청년, 독거 노인 등 소외 계층을 위한 웹 서비스.
- 프로젝트 주요 기능
  - Azure AI 서비스를 활용한 음성 인식과 산책 경로 추천, 지도 제공
  - 게시글 작성 카테고리 분류에 따른 산책 성향 통계
  - 카카오 소셜 로그인
  - 실시간 채팅
  - 게시판, 피드, 그룹 

# ✒️ Coding Convention

- 변수, 클래스, 함수 네이밍
  - 변수 : 카멜케이스, const, let (var X), 명명 시 진지하게 고민
  - 클래스 : 클래스명 첫 글자는 대문자
- Github
  - 기능별 브랜치 PR 승인 이후 main 에 병합

# 💻 Tech Spec

- 프로젝트 : React.js
- 음성 인식 : Azure AI services STT
- 경로 추천 : Azure AI services chat-GPT4o
- 산책 경로 지도 : TMAP API (JS V2)
- 산책 통계 차트 : Chart.js (Radar)
- 카카오 소셜 로그인 : KAKAO API
- 채팅 : Socket.io
- 배포 : express, Azure App Services (CI/CD - 포크된 리더 개인 레포지토리에서 진행)
