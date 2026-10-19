// 글꼴 고르기 (공통) — data.js 의 page.fonts 에 이름만 적으면 적용돼요.
//   fonts: { display: '학교안심 붓펜', text: '학교안심 산뜻바탕', title: 'Cinzel' }
//   display = 큰 제목 / title = 소제목·영문 라벨 / text = 본문 / intro = 시작화면 제목(안 적으면 display)
//   · 학교안심·케리스 글꼴: 아래 SCHOOL 목록의 한글 이름 그대로
//   · Google Fonts 글꼴: 영문 이름 그대로 (예: 'Great Vibes', 'Nanum Pen Script') → 자동으로 불러옴
//   허용 기준: 상업적 이용 가능 + 출처 표기 의무 없음 (학교안심·케리스 = OFL, Google Fonts = OFL/Apache)
(function () {
  const SCHOOL = {
      "케리스 배움체": "KerisBaeum",
      "케리스 케듀체": "KerisKedyuche",
      "케리스 케듀체 Line": "KerisKeduLine",
      "학교안심 가을소풍": "SchoolSafeAutumnTrip",
      "학교안심 곧은제목": "SchoolSafetyStraightTitle",
      "학교안심 공룡알": "SchoolSafetyDinosaurEgg",
      "학교안심 구름": "SchoolSafetyCloud",
      "학교안심 그림일기": "SchoolSafetyPictureDiary",
      "학교안심 꼬꼬마": "SchoolSafeLittleOne",
      "학교안심 꽈배기": "SchoolSafeTwist",
      "학교안심 꾸러기": "SchoolSafetyKid",
      "학교안심 나들이": "SchoolSafeOuting",
      "학교안심 나무": "SchoolSafeTree",
      "학교안심 날개": "SchoolSafetyWing",
      "학교안심 돋보기": "SchoolSafetyMagnifier",
      "학교안심 돌담": "SchoolSafeStoneWall",
      "학교안심 둥근미소": "SchoolSafetyRoundedSmile",
      "학교안심 떡볶이": "SchoolSafetyTteokbokki",
      "학교안심 뜀틀": "SchoolSafeVaultingBox",
      "학교안심 리코더": "SchoolSafetyRecorder",
      "학교안심 마니또": "SchoolSafetyManitto",
      "학교안심 마법사": "SchoolSafetyWizard",
      "학교안심 맑은날": "SchoolSafetySunnyDay",
      "학교안심 모험가": "SchoolSafeAdventurer",
      "학교안심 몽글몽글": "SchoolSafeMonggleMonggle",
      "학교안심 몽당분필": "SchoolSafetyStubbyChalk",
      "학교안심 물결": "SchoolSafetyWave",
      "학교안심 민들레홀씨": "SchoolSafetyDandelionSpore",
      "학교안심 바른돋움": "SchoolSafetyGoodSupport",
      "학교안심 바른바탕": "SchoolSafetyFoundation",
      "학교안심 반달": "SchoolSafetyHalfMoon",
      "학교안심 받아쓰기": "SchoolSafeDictation",
      "학교안심 별빛하늘": "SchoolSafetyStarrySky",
      "학교안심 별자리": "SchoolSafetyConstellation",
      "학교안심 보드마카": "SchoolSafeBoardMarker",
      "학교안심 봄방학": "SchoolSafetySpringBreak",
      "학교안심 분필": "SchoolSafetyChalk",
      "학교안심 붓펜": "SchoolSafetyBrushPen",
      "학교안심 사물함": "SchoolSafeLocker",
      "학교안심 산뜻돋움": "SchoolSafeSansDoodum",
      "학교안심 산뜻바탕": "SchoolSafetySans",
      "학교안심 상장": "SchoolSafetyCertificate",
      "학교안심 색연필": "SchoolSafetyColoredPencil",
      "학교안심 소나기": "SchoolSafetyShower",
      "학교안심 수수깡": "SchoolSafetySusukkang",
      "학교안심 스케치북": "SchoolSafetySketchbook",
      "학교안심 시간표": "SchoolSafetySchedule",
      "학교안심 알림장": "SchoolSafetyNotification",
      "학교안심 어항꾸미기": "SchoolSafetyAquariumDecor",
      "학교안심 여행": "SchoolSafeTravel",
      "학교안심 오카리나": "SchoolSafetyOcarina",
      "학교안심 우산": "SchoolSafeUmbrella",
      "학교안심 우주": "SchoolSafeUniverse",
      "학교안심 운동장": "SchoolSafePlayground",
      "학교안심 은하수": "SchoolSafetyMilkyWay",
      "학교안심 이어달리기": "SchoolSafetyRelay",
      "학교안심 자연": "SchoolPeaceOfMindNature",
      "학교안심 자유시간": "SchoolSafetyFreeTime",
      "학교안심 점심시간": "SchoolSafeLunchtime",
      "학교안심 지우개": "SchoolSafetyEraser",
      "학교안심 책갈피": "SchoolSafetyBookmark",
      "학교안심 출석부": "SchoolSafetyAttendanceBook",
      "학교안심 칠판지우개": "SchoolSafetyChalkboardEraser",
      "학교안심 콧수염": "SchoolSafetyMustache",
      "학교안심 키다리풍선": "SchoolSafetyKidariBalloon",
      "학교안심 투호": "SchoolSafetyToss",
      "학교안심 퍼즐 블랙": "SchoolSafetyPuzzleBlack",
      "학교안심 퍼즐 아웃라인": "SchoolSafetyPuzzleOutline",
      "학교안심 포스터": "SchoolSafetyPoster"
  };
  const P = (window.ARCHIVE && ARCHIVE.page) || {}, F = P.fonts || {}, root = document.documentElement, google = [];
  const DEF = { display: '"Hahmlet","Song Myung",serif', title: '"Cormorant Garamond","Hahmlet",serif', text: '"Gowun Batang",serif' };
  const resolve = name => { if (!name) return null; if (SCHOOL[name]) return `'${SCHOOL[name]}'`; if (/^[A-Za-z0-9 ]+$/.test(name)) { google.push(name); return `"${name}"`; } return `"${name}"`; };
  ['display', 'title', 'text'].forEach(k => { const r = resolve(F[k]); root.style.setProperty('--f-' + k, r ? `${r},${DEF[k]}` : DEF[k]); });
  const ri = resolve(F.intro); if (ri) root.style.setProperty('--f-intro', `${ri},${DEF.display}`);
  if (google.length) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?' + [...new Set(google)].map(n => 'family=' + n.replace(/ /g, '+') ).join('&') + '&display=swap'; document.head.appendChild(l); }
  window.ARCHIVE_FONTS = SCHOOL;
})();
