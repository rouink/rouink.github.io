/* ===== 온새봄 — 작품 내용 (이 파일만 고치면 됩니다) =====
   · 글자는 작은따옴표(' ') 안만 바꾸세요. 따옴표·쉼표·괄호는 지우면 안 돼요.
   · 캐릭터챗이라 캐릭터는 한 명(char1)이에요. */
window.ARCHIVE = {
  page: {
    intro: 'shutter',                                // 시작 화면: 마감 직전 꽃집 셔터 (shared/shutter.js)
    introTitle: '온새봄',                            // 셔터 아래 큰 제목
    introSub: 'On Saebom',                           // 큰 제목 아래 영문
    shutter: {
      shop: '물망 勿忘',                              // 간판
      shopSub: 'FLOWERS · OPEN UNTIL 22:00',         // 간판 아래 작은 글
      note: '오늘은 22시까지.\n단골은 9시 50분까지.',  // 셔터에 붙은 메모 (\n = 줄바꿈)
      noteBy: '― 새봄',
      closedNote: '오늘 영업 끝.\n…노크하면 열어 줄게.', // 밤 10시~아침 9시에 보이는 메모
      open: 9, close: 22,                            // 영업시간 (시)
      hint: '셔터를 위로 밀어 올려 봐',                 // 1초 동안 안 움직이면 뜨는 안내
      line: '왔어? 오늘은 누구 줄 꽃이야?',              // 셔터가 열리면 가게 안에 뜨는 말
      lineRegular: '딱 9시 50분. …역시 너구나.',        // 밤 9시 50분~59분에 오면 대신 뜨는 말
      image: 'assets/portrait.webp',                 // 셔터 안쪽에 보이는 그녀
      name: '단골 이름', namePh: '이름 적어 줘',
      sign: "SAEBOM · FLOWERS DON'T LIE"
    },
    fonts: { display: 'Diphylleia', intro: 'Diphylleia', title: 'Cormorant Garamond', text: 'Noto Serif KR' },
    guestName: '단골',                               // 이름을 안 적었을 때 주문서·인생 두컷에 들어가는 이름
    hunt: {                                          // 숨은 장치: 갤러리 사진에 몰래 꽂아 둔 물망초 다섯 송이 (shared/flower-hunt.js)
      spots: [                                       // gi = 갤러리 순서(0부터) · x, y = 사진 안 위치(%)
        { gi: 0, x: 9, y: 84 },
        { gi: 5, x: 7, y: 73 },
        { gi: 11, x: 19, y: 63 },
        { gi: 15, x: 10, y: 66 },
        { gi: 20, x: 93, y: 82 }
      ],
      found: '물망초 {n} / {all}',
      says: [
        '…그거 내가 꽂아 둔 건데. 어떻게 찾았어?',
        '두 송이. 우연은 아니네.',
        '세 송이째야. 그만 찾아도 되는데.',
        '네 송이. …마지막 하나는 찾지 마.'
      ],
      head: 'MULMANG · UNDER THE COUNTER',
      title: '꽃말 장부',
      sub: '3년 동안, 당신의 꽃다발에 몰래 꽂아 둔 꽃.',
      rows: [
        { d: '23.10.27', f: '물망초', m: '나를 잊지 마요' },
        { d: '24.02.16', f: '스위트피', m: '추억' },
        { d: '24.07.05', f: '해바라기', m: '당신만 바라봐요' },
        { d: '25.03.14', f: '라넌큘러스', m: '당신은 매력적이에요' },
        { d: '26.01.09', f: '빨간 튤립', m: '사랑의 고백' },
        { d: '26.10.23', f: '노란 장미', m: '~~질투~~ 고백할 꽃…?' }
      ],
      video: 'assets/secret/ribbon.mp4', poster: 'assets/secret/ribbon.jpg',
      line: '받는 사람 칸이 왜 3년째 비어 있었는지, 이제 알겠지?',
      by: '— 온새봄, 장부 맨 아래 칸에',
      reopen: '꽃말 장부 다시 보기'
    },
    bouquet: {                                       // 3페이지 맨 아래 '꽃다발 주문서' (shared/bouquet.js)
      label: 'Florist', title: '꽃다발 주문서', sub: '고른 꽃과 이름은 내 기기에서만 처리돼요.',
      note: '꽃을 세 송이까지 고르고 받는 사람을 적으면, 그녀가 묶어 줘요. 같은 꽃과 이름이면 반응도 늘 같아요.',
      shop: '물망 勿忘', shopSub: 'MULMANG FLORIST · SINCE 2023', no: 'MM',
      flowers: [
        { id: 'forget', name: '물망초', mean: '나를 잊지 마요', color: '#7E9CC6', kind: 'cluster', eye: '#F6E39A' },
        { id: 'yellow', name: '노란 장미', mean: '질투', color: '#F0D24A', color2: '#D9A92A', kind: 'rose' },
        { id: 'tulip', name: '빨간 튤립', mean: '사랑의 고백', color: '#D9564E', color2: '#9E2F2B', kind: 'tulip', petals: 5 },
        { id: 'red', name: '빨간 장미', mean: '열렬한 사랑', color: '#B8323F', color2: '#7E1C27', kind: 'rose' },
        { id: 'sweet', name: '스위트피', mean: '추억', color: '#E7A6C0', color2: '#C0718F', kind: 'daisy', petals: 5 },
        { id: 'sun', name: '해바라기', mean: '당신만 바라봐요', color: '#F2C230', color2: '#D9971E', kind: 'sun', eye: '#5B3B1E', petals: 14 },
        { id: 'baby', name: '안개꽃', mean: '맑은 마음', color: '#FBFAF4', color2: '#E2DED2', kind: 'cluster', eye: '#EDE6C8' },
        { id: 'carnation', name: '카네이션', mean: '감사', color: '#E58FA0', color2: '#C2607A', kind: 'rose' }
      ],
      self: ['새봄', '누나', '사장님', '꽃집'],             // 받는 사람에 이 말이 들어 있으면 '나에게'
      family: ['엄마', '어머니', '어머님', '아빠', '아버지', '할머니', '할아버지', '부모'],   // 이 말이 들어 있으면 '안심'
      lines: {                                       // {to} = 받는 사람, {n} = 질투 %
        empty: '받는 사람 칸이 비었네. …그럼 이건 내가 가져도 되는 거지?',
        self: ['…나? 진짜 나야? 잠깐만, 리본 다시 묶을게.', '3년 만에 받는 사람 칸에 내 이름이 들어갔네.', '이건 못 팔겠다. 내가 가질게.'],
        family: ['아, {to} 거구나. …괜히 긴장했잖아.', '{to}께 드리는 거면 제일 예쁜 걸로 골라 줄게.'],
        other: ['{to}… 예쁜 이름이네. 응, 예쁘게 묶어 줄게.', '{to}한테 주는구나. …리본은 한 번만 감을게.', '좋겠다, {to}. 이런 꽃 받아 보고.', '{to}. …기억해 둘게, 그 이름.'],
        yellow: '노란 장미 꽃말이 질투라는 거, 알고 고른 거지? …{to}한테?',
        confess: '튤립은 고백할 때 주는 꽃이야. …{to}, 운 좋네.'
      },
      secret: {                                      // 그녀가 몰래 한 송이 더 꽂는 꽃
        self: { id: 'sun', line: '— 이건 서비스 아니야. 진심이야.' },
        family: { id: 'baby', line: '— 안부 전해 줘.' },
        empty: { id: 'forget', line: '— 빈칸엔 이걸 꽂아 둘게.' },
        other: [{ id: 'forget', line: '— 그래도 나를 잊지는 마.' }, { id: 'yellow', line: '— 이건 실수로 들어간 거야.' }]
      },
      jealous: [41, 98]                              // 다른 사람에게 줄 때 질투 % 범위
    },
    closing: {                                       // 숨은 장치: 단골 시간 (shared/closing-hour.js) · 미리보기 ?t=2152&day=5
      at: '21:50', until: '22:00',
      line: '딱 9시 50분. …알고 있었어, 올 줄.',
      friday: '금요일 9시 50분. 3년째 안 틀리네, 너.',
      badge: '단골 시간'
    },
    presence: {                                      // 숨은 장치 (shared/presence.js) — 그녀의 말은 화면 아래 세이지색 상자로 잠깐 끼어들어요
      by: '새봄',
      visits: {                                      // 방문 회차 (같은 기기) · 오른쪽 위 GUEST 자리에 표시
        label: '단골 {n}번째',
        labelNamed: '{name} · 단골 {n}번째',
        lines: [
          '왔어? 문 닫기 전에 와 줬네.',
          '또 왔네. …자리 비워 뒀어, 카운터 옆.',
          '세 번째야. 이쯤 되면 꽃보다 내가 보고 싶은 거 아니야?',
          '네 번째. 장부에 네 칸이 또 늘었어.',
          '다섯 번째. 이제 문소리만 들어도 너인 줄 알아.'
        ],
        many: [
          { from: 6, line: '{n}번째. …리본, 오늘도 두 번 감아 둘게.' },
          { from: 10, line: '{n}번째야. 이 정도면 가게 열쇠 하나 줘야 하나.' }
        ]
      },
      linger: {                                      // 40초 동안 아무것도 안 만지면 한마디 (한 번 방문에 3번까지)
        sec: 40, gap: 50, max: 3,
        lines: [
          '꽃 고르는 거 아니면, 나 보는 거지?',
          '…아직 거기 있네. 물 줄 시간인데.',
          '그렇게 오래 보면 꽃이 시들어.',
          '말 안 해도 돼. 그냥 있어도 돼.'
        ]
      },
      away: { title: '…어디 가?', back: '다녀왔어?', say: '어디 갔다 왔어? …누구 만나고 온 거 아니지?', after: 20 },
      hours: [
        {                                            // 새벽 4시~7시 전: 꽃시장 가는 시간
          name: 'dawn', from: 4, to: 7,
          line: '새벽 꽃시장 가는 길이야. …같이 갈래?',
          ticker: ['꽃시장 트럭이 골목 앞에 멈춥니다.', '새봄이 작업용 장갑을 끼고 있습니다.']
        },
        {                                            // 밤 10시~새벽 4시 전: 셔터를 내린 뒤 (어스름한 세이지 회색, 검정 아님)
          name: 'night', from: 22, to: 4,
          line: '불 꺼진 가게에 왜 왔어. …너라서 다행이지만.',
          ticker: ['셔터는 내렸지만 안쪽 불은 아직 켜져 있습니다.', '카운터 위에 묶다 만 꽃다발이 하나 있습니다.'],
          vars: { '--bg': '#ECEBE2', '--paper': '#F6F4EC', '--line': '#D8D4C4', '--line2': '#E3E0D3', '--bg-rgb': '236 235 226', '--paper-rgb': '246 244 236' }
        }
      ]
    },
    musicAfterPopup: 'play',                         // 기록 팝업을 닫으면 메인 곡을 자동으로 다시 재생
    theme: 'florist',                                // 색 테마: 꽃집 (크림 · 세이지 · 레몬) — shared/theme-florist.css
    metal: 'gold',                                   // 기념주화·인생 두컷 처음 마감
    enamel: ['#5E7A55', '#1F2C21'],                  // 기념주화 에나멜 색: 세이지
    boothPaper: ['#FFFDF6', '#EFE8D8', '#26312A', '#6B7468'],   // 인생 두컷 종이: 크림
    pages: ['기록', '갤러리', '제작소'],
    galleryTitle: '온새봄 갤러리',
    gallerySub: '크랙에 반영된 이미지입니다. …어딘가에 파란 꽃이 숨어 있어요.',
    brand: '온새봄',
    title: '온새봄',
    heroImage: 'assets/hero.jpg',                    // 표지 사진 = 영상 첫 장면 (영상이 뜨기 전에 먼저 보임)
    heroVideo: 'assets/hero.mp4',                    // 움직이는 표지 영상 (금빛 온실 · 미소) · 소리 없이 반복
    heroPosition: '50% 24%',
    heroCaption: '골목 끝 꽃집, 마감 십 분 전',
    heroLabel: 'Chapter I',
    heroTitle: '온새봄',
    heroSub: "Flowers Don't Lie",
    worldLabel: 'Ⅰ · The Shop',
    quote: '또 왔네? 이번엔… 누구 줄 꽃이야?',
    quoteBy: 'On Saebom',
    heroText: [
      '골목 끝, 간판보다 꽃이 먼저 보이는 가게. 문은 밤 열 시에 닫힌다.',
      '3년 전 개업 첫날, 첫 손님이 들어왔다. 그 뒤로 금요일 밤 9시 50분이면 같은 발소리가 났다.',
      '그 손님의 꽃다발에는 언제나 한 송이가 더 꽂혀 있었다. 아무도 묻지 않았고, 그녀도 말하지 않았다.'
    ],
    footer: '© 2026 페르르. ALL RIGHTS RESERVED.\nAll designs, code, images and text on this site are protected by copyright. Any unauthorized copying, distribution or reuse is strictly prohibited.'
  },
  config: {
    bgm: 'assets/music/main.mp3'                     // 메인 곡 'The Midday Promenade' — 기록 팝업 밖 모든 화면
  },
  ticker: [
    '마감까지 10분, 셔터가 반쯤 내려와 있습니다.',
    '새봄이 리본을 한 번 더 감습니다.',
    '카운터 아래 장부에 오늘 날짜가 적힙니다.',
    '노란 장미 한 송이가 슬쩍 앞으로 나옵니다.',
    '물망초 화분에 물이 고입니다.',
    '“누구 줄 꽃이야?” 아무도 대답하지 않습니다.',
    '가위 소리가 평소보다 조금 큽니다.',
    '창가의 튤립이 문 쪽으로 고개를 돌립니다.',
    '새봄이 시계를 세 번째로 봅니다.',
    '오늘도 꽃다발에 한 송이가 더 들어갑니다.',
    '앞치마 끈이 또 풀려 있습니다.',
    '골목 끝 꽃집의 불이 아직 켜져 있습니다.'
  ],
  characters: {
  char1: {
    num:'FILE 01',
    name:'온새봄',
    nameEn:'ON SAEBOM',
    tags:['꽃집 물망 사장', '단골 3년째', '꽃말은 거짓말을 안 해'],
    bio:'골목 끝 꽃집 물망의 사장. 손님 누구에게나 다정한 동네 누나지만, 금요일 밤 9시 50분에 오는 단골 앞에서만 가위질이 서툴러진다. 질투는 말로 하지 않는다. 꽃을 고르는 손이 먼저 들킨다.',
    birth:'4월 9일', age:29,
    mbti:'ISFJ', enneagram:'2w1', nationality:'대한민국', height:'167cm',
    extras:[['직업', '꽃집 물망 사장'], ['전직', '광고회사 디자이너'], ['취미', '손님 몰래 꽃말 고르기'], ['말버릇', '…예뻐?'], ['좋아하는 것', '마감 10분 전, 새벽 꽃시장']],
    tmi:[
      { q:'TMI 1', a:'가게 이름 물망은 물망초에서 땄다. 할머니는 잊지 말라는 뜻이라고 했고, 그녀는 그 말을 간판보다 먼저 외웠다.' },
      { q:'TMI 2', a:'금요일 9시 50분이 다가오면 시계를 세 번 본다. 셔터를 끝까지 내리지 않는 건 그날뿐이다.' }
    ],
    story:[
      '스물여섯, 광고회사 야근 끝에 할머니의 부고를 들었다. 장례식장에서 받은 건 열쇠 꾸러미 하나와, 시든 물망초가 꽂힌 빈 가게였다. 그녀는 다음 날 사표를 냈다.',
      '개업 첫날 비가 왔다. 손님은 한 명이었고, 그 사람은 아무 꽃이나 달라고 했다. 그녀는 아무 꽃이 아닌 걸 골랐다. 그 뒤로 3년, 장부 맨 아래 칸은 늘 같은 날짜, 같은 시간으로 채워졌다.'
    ],
    items:[                                          // 소지품 (사진 assets/items/*.webp)
      { img:'assets/items/scissors.webp', title:'할머니의 꽃가위', desc:'붉은 칠이 벗겨진 손잡이에 손가락 모양이 남았다. 줄기를 사선으로 자르는 버릇도 같이 물려받았다. 당신의 꽃만은 한 번 더 다듬는다.' },
      { img:'assets/items/ledger.webp', title:'카운터 아래 꽃말 장부', desc:'날짜와 꽃 이름만 적힌 얇은 노트. 받는 사람 칸은 3년째 비어 있다. 누가 물으면 재고 장부라고 한다.' },
      { img:'assets/items/ribbon.webp', title:'레몬색 리본', desc:'당신의 꽃다발만 두 번 감는다. 매듭이 하나 더 있다는 건, 그냥 실수라고 해 두자.' },
      { img:'assets/items/apron.webp', title:'닳은 앞치마', desc:'오른쪽 주머니 안쪽에 작은 물망초 자수가 있다. 직접 놓았고, 아무에게도 보여 준 적 없다.' }
    ],
    gallery:[                                      // 페이지 II 갤러리 (가로 4:3)
      { img:'assets/gallery/saebom_01_calm.webp', label:'기본', desc:'어서 와요. …아, 너구나.' },
      { img:'assets/gallery/saebom_02_cold.webp', label:'서늘함', desc:'웃음이 사라지는 데 걸린 시간, 0.5초.' },
      { img:'assets/gallery/saebom_03_gloom.webp', label:'우울', desc:'' },
      { img:'assets/gallery/saebom_04_sob.webp', label:'오열', desc:'' },
      { img:'assets/gallery/saebom_05_tears.webp', label:'글썽', desc:'' },
      { img:'assets/gallery/saebom_06_tender.webp', label:'다정', desc:'' },
      { img:'assets/gallery/saebom_07_uneasy.webp', label:'불안', desc:'' },
      { img:'assets/gallery/saebom_08_sulky.webp', label:'언짢음', desc:'' },
      { img:'assets/gallery/saebom_09_startled.webp', label:'놀람', desc:'' },
      { img:'assets/gallery/saebom_10_tease.webp', label:'장난', desc:'' },
      { img:'assets/gallery/saebom_11_welcome.webp', label:'반가움', desc:'9시 50분. 문 열리는 소리만 들어도 안다.' },
      { img:'assets/gallery/saebom_12_flutter.webp', label:'설렘', desc:'' },
      { img:'assets/gallery/saebom_13_laugh.webp', label:'함박웃음', desc:'' },
      { img:'assets/gallery/saebom_14_wink.webp', label:'윙크', desc:'장부 얘기는 우리끼리 비밀.' },
      { img:'assets/gallery/saebom_15_sidelong.webp', label:'곁눈질', desc:'' },
      { img:'assets/gallery/saebom_16_smile_alone.webp', label:'혼자 웃음', desc:'' },
      { img:'assets/gallery/saebom_17_shy.webp', label:'부끄러움', desc:'' },
      { img:'assets/gallery/saebom_18_jealous.webp', label:'질투', desc:'노란 장미를 고른 건, 손이 먼저였다.' },
      { img:'assets/gallery/saebom_19_golden.webp', label:'금빛 미소', desc:'' },
      { img:'assets/gallery/saebom_20_sincere.webp', label:'진심', desc:'' },
      { img:'assets/gallery/saebom_21_dawn.webp', label:'새벽', desc:'' },
      { img:'assets/gallery/saebom_22_before_confess.webp', label:'고백 직전', desc:'받는 사람 칸, 이번엔 채워도 될까.' },
      { img:'assets/gallery/saebom_23_chatter.webp', label:'수다', desc:'' }
    ],
    themeTitle:'Butterflies and Bad Intentions',   // 테마곡 제목 (기록 팝업에 나옴)
    music:'assets/music/theme.mp3',                 // 테마곡 — 기록 팝업이 열려 있을 때만 재생
    portrait:'assets/portrait.webp',               // 기록 카드·팝업 사진 (금빛 미소)
    booth:['assets/booth/char1_1.png', 'assets/booth/char1_2.png'],  // 인생 두컷용 배경 투명 PNG (1컷 반가움, 2컷 윙크)
    crack:'https://crack.wrtn.ai/characters/6adc427b87237d1436a5c8e2/detail'   // '크랙에서 대화하기' 버튼 주소
  }
  }
};
