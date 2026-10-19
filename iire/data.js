/* ===== 이이레 — 작품 내용 (이 파일만 고치면 됩니다) =====
   · 글자는 작은따옴표(' ') 안만 바꾸세요. 따옴표·쉼표·괄호는 지우면 안 돼요.
   · 캐릭터챗이라 캐릭터는 한 명(char1)이에요. 늘리려면 char1 블록을 복사해 char2로 이름만 바꿔 붙이세요(앞 블록 끝에 쉼표 필요). */
window.ARCHIVE = {
  page: {
    intro: 'glass',                                 // 시작 화면 효과 이름 (shared/intro-list.txt 참고) · 미리보기: 주소 뒤에 ?intro=이름
    fonts: {},                                       // 글꼴: { display:'학교안심 붓펜', text:'학교안심 산뜻바탕' } · 목록은 shared/font-list.txt
    theme: 'lavender',                           // 색 테마: cream · blue · rose · sage · lavender · mono
    pages: ['기록', '갤러리', '제작소'],          // 하단 메뉴 바의 페이지 이름 (I · II · III)
    galleryTitle: '표정 갤러리',                  // 페이지 II 제목
    gallerySub: '크랙에서는 잠겨 있는 이미지를 여기서 먼저 만나 보세요.',
    brand: '이이레',                             // 작품명: 상단 로고·주화·포토카드·인생 두컷 프레임의 'PROJECT ARCHIVE' 자리에 들어가요
    title: '이이레',                              // 브라우저 탭 제목
    heroImage: 'assets/hero.jpg',               // 표지 사진 (비우면 글자만)
    heroPosition: '40% 30%',                    // 표지 사진에서 보여 줄 위치 (가로% 세로%)
    heroCaption: '처형식에 가는 길',             // 표지 사진 설명 (오른쪽 아래 작은 글씨)
    heroLabel: 'Chapter I',
    heroTitle: '이이레',                          // 첫 화면 큰 제목
    heroSub: 'The Saint Who Was Kept',          // 큰 제목 아래 영문 부제 (비우면 숨김)
    worldLabel: 'Ⅰ · The World',
    quote: '',                                  // 인상적인 대사 한 줄 (비우면 숨김)
    quoteBy: 'Iire',
    heroText: [                                 // 세계관 소개글 (한 줄씩)
      '이이레의 세계관 소개 첫 줄을 적어 주세요.',
      '두 번째 줄',
      '세 번째 줄'
    ],
    footer: '© ROUINK PROJECT HUB. ALL RIGHTS RESERVED.'
  },
  config: {
    bgm: 'assets/music/main.mp3'                // 메인 음악 (첫 화면~스크롤)
  },
  ticker: [                                     // 화면 곳곳에 5초마다 랜덤으로 뜨는 문장 (몇 개든 가능)
    'A문구가 출력 중입니다.',
    'B문구가 출력 중입니다.',
    'C문구가 출력 중입니다.',
    'D문구가 출력 중입니다.',
    'E문구가 출력 중입니다.',
    'F문구가 출력 중입니다.',
    'G문구가 출력 중입니다.',
    'H문구가 출력 중입니다.',
    'I문구가 출력 중입니다.',
    'J문구가 출력 중입니다.'
  ],
  characters: {
  char1: {
    num:'FILE 01',
    name:'이이레',                 // 한글 이름 — 여기 한 곳만 고치면 카드·팝업·인생 2컷에 모두 반영돼요
    nameEn:'IIRE',               // 영문 이름
    tags:['성녀', '감금', '애증'],
    bio:'자애롭고 희생정신 투철한, 모두의 성녀였다. 감금과 고립 속에서 오직 당신에게만 애증과 의존을 쏟아 내기 시작한다. 은발에 가까운 백금발, 투명할 정도로 하얀 피부, 처연한 자줏빛 눈동자. 몸을 옥죄는 단정한 성복은 감금 이후 해지고 흐트러졌다.',
    birth:'0000년 0월 0일', age:22,    // 나이는 작품 속 기준으로 직접 적기
    mbti:'MBTI', nationality:'국적', height:'000cm',
    extras:[['혈액형', '-'], ['직업', '성녀'], ['취미', '-'], ['말버릇', '-']],
    tmi:[
      { q:'TMI 제목', a:'TMI 내용' },
      { q:'TMI 제목', a:'TMI 내용' }
    ],
    story:['과거 이야기 첫 문단', '둘째 문단'],
    items:[
      { icon:'🎁', title:'소지품 이름', desc:'소지품 설명' },
      { icon:'🔑', title:'소지품 이름', desc:'소지품 설명' }
    ],
    gallery:[                                   // 페이지 II 표정·상황 갤러리 (가로 4:3 이미지 · img: 경로, label: 표정/상황, desc: 짧은 설명, secret:true 를 붙이면 흐리게 가려져요 — 기본은 전부 공개)
      { img:'assets/gallery/char1_01.webp', label:'기본', desc:'평소 대화할 때' },
      { img:'assets/gallery/char1_02.webp', label:'미소', desc:'칭찬을 들었을 때' },
      { img:'assets/gallery/char1_03.webp', label:'당황', desc:'갑자기 가까이 다가왔을 때' },
      { img:'assets/gallery/char1_04.webp', label:'토라짐', desc:'약속을 잊었을 때' },
      { img:'assets/gallery/char1_05.webp', label:'눈물', desc:'속마음을 털어놓을 때' }
      // 더 넣으려면 위 줄 끝에 쉼표(,)를 찍고 같은 모양으로 한 줄씩 추가 — 몇십 장이어도 괜찮아요
    ],
    themeTitle:'테마곡 제목',
    video:'', poster:'',                                  // 영상(.mp4) 주소, 비워 두면 Video coming soon
    music:'assets/music/char1.mp3',                      // 팝업에서 나오는 캐릭터 음악
    booth:['assets/booth/char1_1.png', 'assets/booth/char1_2.png'],  // 인생 두컷용 배경 투명 PNG (1컷, 2컷)
    crack:'https://crack.wrtn.ai/characters/6acb14cda305f4d2da554073/detail'   // '크랙에서 대화하기' 버튼 주소
  }
  }
};
