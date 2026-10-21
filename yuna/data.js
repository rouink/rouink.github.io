/* ===== 서윤아 — 작품 내용 (이 파일만 고치면 됩니다) =====
   · 글자는 작은따옴표(' ') 안만 바꾸세요. 따옴표·쉼표·괄호는 지우면 안 돼요.
   · 캐릭터챗이라 캐릭터는 한 명(char1)이에요. */
window.ARCHIVE = {
  page: {
    intro: 'vault',                                  // 시작 화면: 강철 금고 (shared/vault.js) · 다른 효과로 바꾸려면 intro-list.txt 의 이름
    introTitle: '서윤아',                            // 금고 화면 큰 제목
    introSub: 'Seo Yoon-ah',                         // 큰 제목 아래 영문
    introLine: '내 왕국에 제 발로 걸어 들어온 쥐새끼가... 너였나?',   // 제목 아래 대사
    introHint: '손잡이를 돌려 봐. 손 떨리는 거, 다 보이니까.',       // 1초 동안 안 돌리면 뜨는 안내
    introName: '침입자',                              // 이름 칸 앞 글자
    introNamePh: '이름을 대 봐',                      // 이름 칸 안내
    introSign: 'SEO YUNA · DAWN OWNS THE DARK',      // 금고 화면 맨 아래 서명
    fonts: { display: '가나초콜릿', intro: '가나초콜릿', title: 'Cormorant Garamond', text: 'Gowun Batang' },
    secretVault: {                                   // 2페이지 갤러리 아래 '그녀의 금고' (shared/secret-vault.js) — 계약 번호를 맞히면 시크릿 사진
      code: '0229',                                  // 비밀번호 (소지품 글 속 숫자, 가방 속 순서대로)
      title: '그녀의 금고',
      sub: '숫자 넷. 틀리면 — 그녀가 웃는다.',
      article: 'ARTICLE Ⅰ',
      clause: '이 금고를 여는 자의 시간은, 그 순간부터 오로라에 귀속된다. 계약 번호를 적어라.',
      sign: 'signed in red — S.Y.',
      hint: '…생일도 모르면서 내 금고를 털겠다고? 0229',   // 한 번 틀리면 뜨는 안내창
      hintBy: '이번 한 번만 알려 주는 거야.',
      again: '또 틀렸어. 이번엔 몇 초 남았을까.',          // 두 번째부터 틀렸을 때
      photos: [
        { img: 'assets/secret/secret_01.webp', line: '이 얼굴은 금고 안에만 둬. 밖에서 떠들면 — 계약 위반이야.' }
      ],
      empty: '아직 비어 있어. 네가 채울 차례야.'
    },
    player: 'ledger',                                // 음악 플레이어 모양: 타임 레저 (shared/player-ledger.js) · 비우면 기본 모양
    musicAfterPopup: 'play',                         // 기록 팝업을 닫으면 메인 곡을 자동으로 다시 재생
    theme: 'steel',                                  // 색 테마: 스틸 (은행 금고 강철 + 루비 포인트)
    metal: 'silver',                                 // 기념주화·인생 두컷 처음 마감: Platinum
    enamel: ['#B8223E', '#58071A'],                  // 기념주화 에나멜 색: 루비
    boothPaper: ['#F9FAFB', '#E2E5E9', '#141518', '#5E6168'],   // 인생 두컷 종이: 차가운 강철빛 흰색
    pages: ['기록', '갤러리', '제작소'],
    galleryTitle: '서윤아 갤러리',
    gallerySub: '크랙에 반영된 이미지 입니다.',
    brand: '서윤아',
    title: '서윤아',
    heroImage: 'assets/hero.jpg',                    // 표지 사진 = 영상 첫 장면 (영상이 뜨기 전에 먼저 보임)
    heroVideo: 'assets/hero.mp4',                    // 움직이는 표지 영상 (호기심 · 다가오는 장면) · 소리 없이 반복, 비우면 사진만
    heroPosition: '50% 22%',
    heroCaption: '오로라 타워, 최상층',
    heroLabel: 'Chapter I',
    heroTitle: '서윤아',
    heroSub: 'Dawn Owns the Dark',
    worldLabel: 'Ⅰ · The World',
    quote: '내 왕국에 제 발로 걸어 들어온 쥐새끼가... 너였나?',
    quoteBy: 'Seo Yoon-ah',
    heroText: [
      '낮에는 재계의 여왕, 밤에는 클럽 블루문의 주인.',
      '오로라 그룹은 사람의 시간을 사고판다. 계약서 한 장에 십 년, 서명 한 줄에 한 생.',
      '그 계약서가 잠든 금고에 당신이 손을 댔다. 그녀는 죽이는 대신, 갖기로 했다.'
    ],
    footer: '© 2026 페르르. ALL RIGHTS RESERVED.\nAll designs, code, images and text on this site are protected by copyright. Any unauthorized copying, distribution or reuse is strictly prohibited.'
  },
  config: {
    bgm: 'assets/music/main.mp3'                     // 메인 곡 '서윤아' (Letters Left Unsent) — 기록 팝업 밖 모든 화면
  },
  ticker: [
    '오늘 밤 블루문의 손님은 당신입니다.',
    '누군가의 계약서에 마지막 서명이 찍힙니다.',
    '서윤아가 당신의 이름을 천천히 불러 봅니다.',
    '금고의 루비 등이 하나, 깜빡입니다.',
    '오로라 타워의 시계가 1분 늦게 갑니다.',
    '블루문 VIP 룸의 시계가 또 멈췄습니다.',
    '계약서 한 장이 조용히 불타오릅니다.',
    '서윤아가 당신 쪽으로 고개를 돌립니다.',
    '누군가의 십 년이 오늘 밤 팔렸습니다.',
    '새벽 다섯 시, 오로라의 시간이 다가옵니다.',
    '서윤아가 장전된 총을 들고 복도로 나섭니다.',
    '구두 소리가 금고 쪽으로 빨라집니다.',
    '침입자에게 남은 시간, 앞으로 30초.'
  ],
  characters: {
  char1: {
    num:'FILE 01',
    name:'서윤아',
    nameEn:'SEO YOON-AH',
    tags:['오로라 그룹 총수', '블루문', '고양이와 쥐'],
    bio:'오로라 그룹 총수이자 클럽 블루문의 주인. 사람의 남은 시간을 계약서로 사들여 왕국을 쌓았다. 금고를 털다 잡힌 당신에게 죽음 대신 목줄을 건넸다. 서른둘 — 그 얼굴은 십 년째 서른둘이다.',
    birth:'2월 29일', age:32,
    mbti:'ENTJ', enneagram:'8w7', nationality:'대한민국', height:'173cm',
    extras:[['직업', '오로라 그룹 총수 · 블루문 소유주'], ['취미', '남의 계약서 읽기'], ['말버릇', '…그래서?']],
    tmi:[
      { q:'TMI 1', a:'블루문 VIP 룸의 시계는 전부 멈춰 있다. 그 방에서 시간을 잃지 않는 사람은 그녀뿐이다.' },
      { q:'TMI 2', a:'커피는 식은 것만 마신다. 누가 자신을 기다리게 했는지 잊지 않으려고.' }
    ],
    story:[
      '열여덟, 빚에 팔려 간 클럽 지하에서 처음으로 계약서를 썼다. 상대의 십 년을 받고, 자신의 하룻밤을 내주는 계약이었다. 다음 날 아침, 그 남자는 백발이 되어 있었다.',
      '스물둘에 오로라를 삼켰고, 그 뒤로 거울 속 얼굴은 한 번도 변하지 않았다. 금고 안에는 그동안 사들인 시간이 이름표를 달고 잠들어 있다. 그 금고를 연 쥐새끼는, 당신이 처음이다.'
    ],
    items:[                                          // 소지품 — 글 속 숫자 0·2·2·9 가 3페이지 금고 비밀번호 (가방 속 순서대로)
      { img:'assets/items/watch.webp', title:'백발이 된 남자의 손목시계', desc:'첫 계약의 영수증. 차지는 않고 주머니에만 넣어 다닌다. 그 남자에게 남은 시간은 0 — 그런데도 초침은 아직 간다.' },
      { img:'assets/items/pistols.webp', title:'각인된 쌍권총', desc:'왼쪽엔 DAWN, 오른쪽엔 DARK. 탄창엔 언제나 2발만 남겨 둔다. 한 발은 경고, 한 발은 대답.' },
      { img:'assets/items/bluemoon.webp', title:'블루문 VIP 열쇠 카드', desc:'번호 없는 검은 카드. 이걸 받은 손님은 2부류다 — 다시 초대받거나, 다시 보이지 않거나.' },
      { img:'assets/items/pen.webp', title:'붉은 잉크 만년필', desc:'계약서에는 이 펜만 쓴다. 서명은 늘 9번째 줄. 잉크가 왜 붉으냐고 물은 사람은, 그 뒤로 서명란에서만 만났다.' }
    ],
    gallery:[                                      // 페이지 II 갤러리 (가로 4:3)
      { img:'assets/gallery/yuna_01_base.webp', label:'기본', desc:'열쇠는 늘 그녀가 지니고 다닌다. 가방 속, 순서대로.' },
      { img:'assets/gallery/yuna_02_scorn.webp', label:'경멸', desc:'틀린 번호를 누를 때마다, 그녀는 조금 더 즐거워진다.' },
      { img:'assets/gallery/yuna_03_joy.webp', label:'기쁨', desc:'' },
      { img:'assets/gallery/yuna_04_surprise.webp', label:'놀람', desc:'' },
      { img:'assets/gallery/yuna_05_shy.webp', label:'부끄', desc:'' },
      { img:'assets/gallery/yuna_06_anger.webp', label:'분노', desc:'' },
      { img:'assets/gallery/yuna_07_sad.webp', label:'슬픔', desc:'' },
      { img:'assets/gallery/yuna_08_laugh.webp', label:'웃음', desc:'' },
      { img:'assets/gallery/yuna_09_move.webp', label:'이동시', desc:'' },
      { img:'assets/gallery/yuna_10_battle.webp', label:'전투', desc:'' },
      { img:'assets/gallery/yuna_11_jealous.webp', label:'질투', desc:'' },
      { img:'assets/gallery/yuna_12_annoyed.webp', label:'짜증', desc:'' },
      { img:'assets/gallery/yuna_13_curious.webp', label:'호기심', desc:'금고 앞에서 머뭇거리는 손. 다 보여.' }
    ],
    themeTitle:'The Keeper’s Vigil',                // 테마곡 제목 (기록 팝업 플레이어에 나옴)
    mediaShape:'wide',                              // 기록 팝업 영상을 가로(4:3) 그대로 — 양손의 총이 잘리지 않게
    video:'assets/battle.mp4', poster:'assets/battle.jpg',   // 기록 팝업 위 영상 (전투 · 총) · 비우면 사진만
    music:'assets/music/theme.mp3',                 // 테마곡 (The Keeper's Vigil) — 기록 팝업이 열려 있을 때만 자동 재생
    musicWave:{"dur":169.61,"peaks":[0.72,0.44,0.34,0.29,0.23,0.19,0.12,0.09,0.12,0.74,0.42,0.34,0.27,0.24,0.17,0.12,0.08,0.49,0.81,0.54,0.43,0.38,0.48,0.51,0.4,0.26,0.43,0.4,0.5,0.32,0.36,0.46,0.51,0.34,0.23,0.68,0.67,0.54,0.42,0.44,0.44,0.46,0.35,0.24,0.46,0.4,0.4,0.31,0.39,0.45,0.47,0.3,0.2,0.76,0.58,0.48,0.43,0.47,0.4,0.48,0.41,0.38,0.46,0.41,0.35,0.4,0.44,0.46,0.44,0.36,0.59,0.92,0.86,0.73,0.78,0.78,0.73,0.81,0.85,0.95,0.85,0.89,0.69,0.74,0.74,0.85,0.74,0.87,0.97,0.84,0.91,0.79,0.79,0.74,0.8,0.75,0.9,1.0,0.88,0.8,0.84,0.74,0.68,0.8,0.74,0.91,0.87,0.55,0.45,0.41,0.4,0.36,0.39,0.32,0.24,0.38,0.33,0.31,0.35,0.39,0.43,0.39,0.29,0.34,0.81,0.57,0.45,0.41,0.47,0.44,0.41,0.34,0.41,0.33,0.44,0.4,0.34,0.44,0.49,0.36,0.35,0.74,0.89,0.89,0.79,0.77,0.82,0.85,0.84,0.86,0.98,0.88,0.86,0.82,0.79,0.86,0.83,0.85,0.89,0.95,0.93,0.89,0.78,0.87,0.9,0.87,0.81,0.86,0.93,0.89,0.82,0.92,0.9,0.87,0.85,0.75,0.84,0.86,0.54,0.52,0.37,0.36,0.34,0.33,0.26,0.38,0.72,0.43,0.4,0.34,0.33,0.32,0.27,0.2,0.14,0.06,0.03,0.02,0.02,0.02]},   // 테마곡 파형 (자동으로 뽑은 값 · 곡을 바꾸면 이 줄은 지워도 돼요)
    booth:['assets/booth/char1_1.png', 'assets/booth/char1_2.png'],  // 인생 두컷용 배경 투명 PNG (1컷 정면, 2컷 미소)
    crack:''
  }
  }
};
