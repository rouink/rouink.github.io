/* ===== 도인화 — 작품 내용 (이 파일만 고치면 됩니다) =====
   · 글자는 작은따옴표(' ') 안만 바꾸세요. 따옴표·쉼표·괄호는 지우면 안 돼요.
   · 캐릭터챗이라 캐릭터는 한 명(char1)이에요.
   · 이 작품 전용 기능은 inhwa/js 폴더에 있어요 (shared 는 그대로).
   · 크랙 주소(crack)는 등록하고 나면 넣어요. 비어 있으면 '크랙에서 대화하기' 버튼이 숨겨져요. */
window.ARCHIVE = {
  page: {
    title: '도인화 — 반셔터 사진관',
    brand: 'DO INHWA',
    theme: 'inhwa',                                  // inhwa/theme.css
    intro: 'viewfinder',                             // 시작 화면: 뷰파인더 (inhwa/js/viewfinder.js)
    introTitle: '도인화',
    fonts: { display: 'Hahmlet', title: 'Courier Prime', text: 'Gowun Dodum' },

    /* 시작 화면: 그녀의 카메라를 들고 뷰파인더로 본다. 길게 누르면 초점이 맞고, 끝까지 누르면 들어간다. */
    viewfinder: {
      img: 'assets/film/01.webp',
      pos: '64% 34%',                                // 사진에서 보여 줄 자리 (가로 세로)
      af: [0.635, 0.27],                             // 초점 상자 자리 (사진 안 비율)
      roll: 'Banshutter · Roll 07',
      read: ['f/2.8', '1/125', 'ISO 400'],
      line: '그 사진은 견본이야. 너라서 건 거 아니거든.',
      hold: '길게 눌러 초점 맞추기',
      holding: '반셔터 — 그대로, 조금만 더',
      let: '…손 뗐네. 안 찍어?',
      focused: '찍혔다.',
      on: '소리 켜고', off: '조용히',
      skip: '그냥 들어가기'
    },

    pages: ['필름', '사진관', '촬영실'],
    guestName: '손님',                               // 이름을 안 적었을 때
    metal: 'silver',
    enamel: ['#2C6E6F', '#1F1B1A'],
    boothPaper: ['#F4F0E8', '#E8E2D6', '#1F1B1A', '#5C534D'],

    /* 사진관 (2페이지 위) */
    heroLabel: 'Ⅱ · The Studio',
    worldLabel: 'Mulmang Alley · 반셔터 사진관',
    heroText: [
      '물망 골목, 꽃집 맞은편의 작은 사진관. 유리문에 붙은 영업시간은 열한 시부터 일곱 시까지, 화요일은 쉰다.',
      '사장은 손님에게 웃으며 존댓말을 쓴다. 조명을 맞추는 손이 빠르고, 셔터는 망설이지 않는다.',
      '단 한 사람 앞에서만 셔터가 반쯤에서 멈춘다. 진열장 한가운데, 2년째 걸려 있는 견본 사진의 주인.'
    ],
    quote: '초점은 맞았어.\n누르지 못했을 뿐이야.',
    quoteBy: '반셔터 사진관, 마감 뒤',
    footer: '© 2026 페르르. ALL RIGHTS RESERVED.\nAll characters, text, images and code on this page are original works. Unauthorized copying, redistribution or reuse is prohibited.',

    /* ── 필름 (1페이지) — inhwa/js/film.js
       shape: detail(부분 컷) · tall(세로) · full(사진 전체)
       pos: 사진에서 보여 줄 자리 · zoom: 확대 (1 = 그대로)
       line: [첫 줄, 둘째 줄(포인트색)] · back: 뒤집으면 보이는 그녀의 속마음
       미리보기: ?last=1 (36번 열림) · ?visit=3 (방문한 날 수) */
    film: {
      label: "Today's Roll · 반셔터 사진관",
      title: ['오늘 찍은', '열다섯 컷'],
      sub: '스크롤하면 필름이 감겨요. 사진을 누르면 뒤집혀요 — 뒷면에는 그 컷을 찍던 순간의 속마음.',
      total: 36,
      flip: '뒤집기', unflip: '앞면', full: '전체 보기', backLabel: '속마음',
      cuts: [
        { n: 1, img: 'assets/film/01.webp', shape: 'full', pos: '64% 30%', title: '첫 컷', exp: 'f/2.8 · 1/125', time: '18:41',
          line: ['뭘 찍어.', '렌즈 뚜껑부터 열어.'], back: '왜 하필 오늘이야. 왜 하필 그 얼굴이야.' },
        { n: 3, img: 'assets/film/02.webp', shape: 'tall', pos: '58% 26%', zoom: 1.25, title: '진열장', exp: 'f/2.8 · 1/160', time: '18:44',
          line: ['그 사진? 견본이라니까.', '…보지 마.'], back: '아직 거기 걸려 있는 거, 봤겠지. 봤으면서 모르는 척해 줘.' },
        { n: 4, img: 'assets/film/04.webp', shape: 'detail', pos: '30% 62%', zoom: 1.9, title: 'Half Shutter', exp: 'f/2.0 · 1/250', time: '18:47',
          line: ['반만 누르면 초점은 맞아.', '찍히진 않고.'], back: '할 말이 막히면 손가락이 먼저 멈춰. 2년 동안 이 버릇만 그대로야.' },
        { n: 7, img: 'assets/film/05.webp', shape: 'detail', pos: '34% 34%', zoom: 1.7, title: 'Viewfinder', exp: 'f/4 · 1/125', time: '18:52',
          line: ['가만있어.', '지금 너 말고 빛 보는 중이야.'], back: '뷰파인더 안에서는 오래 봐도 티가 안 나. 그래서 이 일을 골랐나 봐.' },
        { n: 9, img: 'assets/film/06.webp', shape: 'detail', pos: '58% 82%', zoom: 1.8, title: 'B-cut', exp: 'f/5.6 · 1/60', time: '18:58',
          line: ['B컷은 버려.', '잘 나온 것만 남기면 돼.'], back: '근데 B컷이 더 너 같아. 버리는 상자에 안 넣고 서랍에 넣었어.' },
        { n: 12, img: 'assets/film/07.webp', shape: 'tall', pos: '50% 30%', zoom: 1.2, title: '머리끈', exp: 'f/2.8 · 1/200', time: '19:05',
          line: ['…왜.', '머리 묶는 거 처음 봐?'], back: '이 머리끈, 그때 너한테서 뺏은 거야. 돌려 달라고 안 하더라.' },
        { n: 14, img: 'assets/film/08.webp', shape: 'tall', pos: '56% 28%', zoom: 1.2, title: '맞은편', exp: 'f/2.8 · 1/250', time: '19:11',
          line: ['새봄이한텐 말하지 마.', '우리 얘기.'], back: '맞은편 꽃집에서는 이 창이 다 보여. 새봄이가 눈치 없는 게 이렇게 고마울 줄이야.' },
        { n: 15, img: 'assets/film/03.webp', shape: 'full', pos: '55% 30%', title: '턱 들어', exp: 'f/2.8 · 1/125', time: '19:14',
          line: ['턱 들어.', '그렇지, 그 각도.'], back: '오른쪽 얼굴이 낫다는 거, 아직 기억하고 있네. 나.' },
        { n: 18, img: 'assets/film/10.webp', shape: 'full', pos: '42% 60%', title: '쉬는 시간', exp: 'f/4 · 1/60', time: '19:26',
          line: ['오늘 손님 너 하나야.', '쉬어도 돼.'], back: '같이 바닥에 앉던 때가 있었어. 간판 달던 날, 사다리 옆에서.' },
        { n: 21, img: 'assets/film/11.webp', shape: 'tall', pos: '52% 34%', zoom: 1.15, title: '한 잔', exp: 'f/2.0 · 1/30', time: '20:10',
          line: ['한 잔만.', '…조명 탓이야, 얼굴 빨간 거.'], back: '두 잔 마시면 이름을 부를 것 같아서. 그래서 한 잔만.' },
        { n: 23, img: 'assets/film/12.webp', shape: 'detail', pos: '50% 40%', zoom: 1.5, title: '마감', exp: 'f/2.8 · 1/60', time: '20:32',
          line: ['마감했어.', '이제 손님 아니야, 너.'], back: '손님이 아니면 뭐라고 불러야 하는지, 그건 아직 못 정했어.' },
        { n: 27, img: 'assets/film/14.webp', shape: 'full', pos: '50% 30%', title: '먼지', exp: 'f/2.8 · 1/125', time: '20:51',
          line: ['…렌즈에 먼지 들어갔나 봐.', '닦고 올게.'], back: '2년이면 괜찮아질 줄 알았어. 사진은 잘도 고치면서.' },
        { n: 31, img: 'assets/film/15.webp', shape: 'full', pos: '50% 34%', title: '가까이', exp: 'f/1.8 · 1/125', time: '21:03',
          line: ['가까이 오지 마.', '초점 나가.'], back: '초점이 나간 건 나야. 처음부터.' }
      ],

      /* 비교 막대 — 필름 중간에 한 번 (같은 창가, 지금과 2년 전) */
      compare: { after: 18, n: 19, img: 'assets/film/09.webp', pos: '58% 30%',
        label: '19 · Same Window', title: ['같은 창가,', '2년 차이.'],
        now: '지금', then: '2년 전', memo: '그날도 비가 왔다. 여기 서서 마지막 한 장을 찍으려다 말았다.',
        hint: '가운데 막대를 밀어 보세요.', after_text: '그날 빛은 왼쪽에서 들어왔다. 오늘도.' },

      /* 끝 — 35번째 컷과 비어 있는 36번 */
      last: { n: 35, img: 'assets/film/13.webp', pos: '46% 26%', line: ['문 잠근다.', '나갈 거면 지금 나가.'],
        back: '나가지 마, 는 말 안 할 거야. 대신 문을 천천히 잠글게.' },
      end: {
        n: 36, img: 'assets/film/16.webp', pos: '44% 30%', days: 3,
        lock: '찍지 못한 한 장.', lockSub: '오늘도.', lockHint: '다른 날, 세 번 와 줘.',
        open: '이번엔 끝까지 눌렀어.', openSub: '36 — 렌즈를 돌렸다. 이번엔 너를 향해.', openSay: '…움직이지 마. 이번 건 견본 아니야.'
      }
    },

    /* ── 진열장 (2페이지) — 방문한 날마다 한가운데 견본이 달라져요 (크랙 상태창과 같은 말) */
    showcase: {
      label: 'Showcase · 진열장', title: ['견본 사진은', '판매하지 않습니다'],
      prints: ['assets/film/06.webp', 'assets/film/08.webp', 'assets/film/05.webp', 'assets/film/12.webp'],
      printPos: ['58% 82%', '56% 28%', '34% 34%', '50% 36%'],
      states: [
        { key: '걸려 있음', cap: '빛이 너무 들어 얼굴이 하얗게 날아간 견본. 그래서 걸었다고 했다. 누군지 안 보이니까.' },
        { key: '뒤집힘', cap: '뒤집혀 있다. 어제는 걸려 있었는데. 뒷면 연필 글씨는 손톱으로 긁어 지운 자국뿐.' },
        { key: '떼어 냄', cap: '떼어 냈다. 액자 자리만 하얗게 남았다. 2년 치 볕은 생각보다 길다.' }
      ],
      fresh: { key: '새 사진', cap: '새 사진이 걸렸다. 이번 건 초점이 맞아 있다.' },
      note: '한가운데 한 장만 날마다 다르다. 크랙 상태창의 진열장과 같은 말이에요.'
    },

    /* 숨은 장치 (shared/presence.js) — 오래 가만히 있으면 한마디 · 다른 탭으로 가면 탭 제목이 바뀜 */
    presence: {
      by: '도인화',
      linger: { sec: 45, gap: 70, max: 2, lines: ['…초점 나갔어. 어디 봐.', '안 움직이면 찍는다. 진짜로.'] },
      away: { title: '…어디 가.', back: '도인화 — 반셔터 사진관', say: '초점 다시 맞춰야 하잖아.', after: 20 }
    },

    /* 맞은편 꽃집 — 온새봄 사이트로 */
    across: { label: 'Across the Alley', title: '맞은편, 꽃집 물망', text: '이 사진관을 예약해 준 사람. 둘이 사귀었던 건 모른다. 들를 때마다 꽃 한 송이를 두고 간다.', link: '../saebom/', btn: '꽃집 들어가기 →', img: '../saebom/assets/og.jpg' },

    /* ── 촬영실 (3페이지 위) — 예약 확인증 */
    booking: {
      label: 'Reservation · No. 1116', title: '예약 확인',
      rows: [['촬영', '프로필 · 1회차'], ['일시', '월요일 18:40'], ['소개', '꽃집 물망 · 온새봄'], ['예약자', '{name}']],
      memo: ['사장 메모 — ', '하필.', ' 조명은 왼쪽.', '웃으라고 하지 말 것.'],
      stamp: 'Confirmed',
      next: '촬영 대지 — 포토카드와 인생 두컷은 아래에서. 올린 사진은 이 기기에서만 처리돼요.'
    }
  },

  /* 화면 아래에 가끔 지나가는 한 줄 */
  ticker: [
    '셔터는 반만 눌려 있다. 2년째 그 자리에서.',
    '진열장 유리는 하루에 두 번 닦는다. 한가운데만 세 번.',
    '맞은편 꽃집 불이 꺼지면, 이쪽 조명도 꺼진다.',
    '손님에게는 "웃으세요." 한 사람에게는 "웃지 마."',
    '노출계는 정확하다. 틀리는 건 늘 사람 쪽이다.',
    '오늘도 필름은 35에서 멈췄다.',
    'B컷 상자는 버리지 않는다. 버리는 척만 한다.',
    '예약표에 같은 이름이 한 번 더 적혔다. 지우지 않았다.'
  ],

  config: { bgm: 'assets/music/main.mp3' },          // Contact Sheet

  characters: {
    char1: {
      num: 'BANSHUTTER PHOTO · OWNER',
      name: '도인화',
      nameEn: 'Do Inhwa',
      age: 29,
      birth: '8월 19일',                             // 세계 사진의 날
      mbti: 'ISFP',
      nationality: '대한민국',
      height: '170cm',
      tags: ['#전여친', '#재회', '#경멸', '#철벽녀', '#혐관', '#사진가'],
      bio: '물망 골목 반셔터 사진관 사장. 손님에게는 웃으며 존댓말, 당신에게만 짧은 반말. 2년을 만났고, 2년 전에 끝났다. 진열장 한가운데 견본 사진은 아직 그대로다.',
      extras: [
        ['직업', '사진관 사장 · 사진가'],
        ['카메라', '목에 건 검은 필름 카메라'],
        ['말버릇', '"조명 탓이야."'],
        ['버릇', '할 말이 막히면 셔터를 반만 누른다'],
        ['좋아하는 것', '마감 뒤 꺼진 조명, 맞은편 꽃집 불빛'],
        ['싫어하는 것', '프로필 사진에 웃으라고 시키는 손님']
      ],
      tmi: [
        { q: '사진관 이름은 왜 반셔터예요?', a: '초점은 맞췄는데 아직 누르지 않은 상태. 간판을 달던 날 그녀가 붙인 이름이다. 그날 옆에서 사다리를 잡아 준 사람이 있었다.' },
        { q: '손님한테는 왜 존댓말이에요?', a: '존댓말은 거리다. 재면 잴수록 편하다. 반말이 튀어나오는 사람은 한 명뿐이고, 그게 문제다.' },
        { q: '진열장 사진, 팔아요?', a: '문의가 세 번 들어왔다. 세 번 다 "견본이라 안 팔아요." 값을 묻기도 전에 대답했다.' },
        { q: '아직도 필름을 써요?', a: '다시 찍을 수 없어서. 디지털은 지우면 그만이지만, 필름은 못 찍은 것까지 남는다.' }
      ],
      story: [
        '열아홉, 중고 가게에서 검은 필름 카메라를 샀다. 첫 롤은 전부 초점이 나갔다. 그래도 한 장도 버리지 않았다.',
        '스물다섯, 당신을 만났다. 그 2년 동안 셔터를 가장 많이 누른 얼굴은 늘 같았다. 오른쪽이 낫다는 것도 그때 알았다.',
        '물망 골목에 사진관을 연 해, 간판 이름을 반셔터로 정했다. 사다리를 잡아 준 사람은 이름이 웃기다고 했고, 그녀는 바꾸지 않았다.',
        '2년 전 그날, 마지막 한 장을 찍으려다 손가락을 뗐다. 그 뒤로 연락은 한 번도 없었다. 진열장의 견본 사진만 계속 그 자리에 있었다.',
        '어느 월요일, 맞은편 새봄에게서 예약 문자가 왔다. "내 단골이야, 잘 찍어 줘." 예약자 이름을 읽는 데 오래 걸렸다.'
      ],
      items: [
        { title: '노출계', icon: 'EV', img: 'assets/items/meter.webp', desc: '빛을 재는 기계. 숫자는 늘 정확하다. 한 사람 앞에서만 다시 재고, 또 다시 잰다.' },
        { title: '빨간 그리스 펜슬', icon: 'RED', img: 'assets/items/pencil.webp', desc: '밀착 인화지에서 고른 컷에 동그라미, 버릴 컷에 엑스. 한 사람이 찍힌 컷에는 엑스가 하나도 없다.' },
        { title: '짝 잃은 렌즈 캡', icon: 'CAP', img: 'assets/items/cap.webp', desc: '같은 걸 두 개 샀다. 하나는 잃어버렸다고 말한다. 어디에 두고 왔는지는 정확히 안다.' },
        { title: '마른 장미', icon: 'ROSE', img: 'assets/items/rose.webp', desc: '맞은편 꽃집에서 새봄이 두고 간 꽃. 버리는 날을 정하지 못해서 창틀에서 말렸다.' }
      ],
      themeTitle: 'Frame 37',
      music: 'assets/music/theme.mp3',
      portrait: 'assets/portrait.webp',
      booth: ['assets/booth/char1_1.webp', 'assets/booth/char1_2.webp'],   // 인생 두컷 1컷 팔짱 · 2컷 웃음
      crack: '',                                     // 크랙 등록 후 주소를 넣어요
      gallery: []
    }
  }
};
