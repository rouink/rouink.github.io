/* ===== 고지서 — 작품 내용 (이 파일만 고치면 됩니다) =====
   · 글자는 작은따옴표(' ') 안만 바꾸세요. 따옴표·쉼표·괄호는 지우면 안 돼요.
   · 캐릭터챗이라 캐릭터는 한 명(char1)이에요.
   · 이 작품 전용 기능은 parking/js 폴더에 있어요 (shared 는 그대로). */
window.ARCHIVE = {
  page: {
    title: '고지서 — Dawn on Duty',
    brand: 'GO JI-SEO',
    theme: 'parking',                                // parking/theme.css
    intro: 'badge',                                  // 시작 화면: 뒤집힌 명찰 (parking/js/badge.js)
    introTitle: '고지서',
    introSub: 'Go Ji-seo',
    badge: {
      zone: 'ZONE 07 · 07:50',                       // 맨 위 작은 글
      back: ['MORNING DUTY', 'PARKING · ZONE 07'],   // 명찰 뒷면 글 (실제 기관 이름은 쓰지 않음)
      no: 'NO. 0741',
      zoneShort: 'ZONE 07',
      hint: '명찰이 뒤집혀 있다.', hintEn: 'TAP TO FLIP',
      photo: 'assets/badge.webp',                    // 명찰 앞면 사진 (당황)
      role: '단속 담당 · 3년 차', name: '고지서', hanja: '高知曙',
      line: '…봤어요?',                               // 뒤집힌 뒤 뜨는 말 (굵은 바탕체 · 남색)
      namePh: '적지 않아도 돼요', enter: '기록 보기',
      sign: 'GO JI-SEO · DAWN ON DUTY'
    },
    fonts: { display: 'Hahmlet', intro: 'Hahmlet', title: 'Sometype Mono', text: 'Gowun Batang' },
    heroLabel: 'Chapter Ⅰ · 07:50',
    heroTitle: '고지서',
    heroSub: 'Dawn on Duty',
    heroImage: 'assets/hero.jpg',
    heroPosition: '50% 18%',
    heroCaption: '상가 골목, 늘 같은 자리',
    worldLabel: 'Ⅰ · The Street',
    heroText: [
      '상가 골목, 아침 7시 50분.',
      '같은 자리에 같은 차가 서 있고, 형광 조끼를 입은 그녀가 단말기를 든다.',
      '찰칵. 10분. 그리고 한 장 더.',
      '스물두 장째인데, 당신은 아직 그녀의 이름을 모른다.'
    ],
    quote: '이름은 묻지 마세요. 딱지는 매일 드릴 테니까.',
    quoteBy: '고지서',
    pages: ['기록', '아침들', '발급소'],
    galleryTitle: '아침들',
    gallerySub: '크랙에서는 잠겨 있는 그녀의 아침을, 여기서 먼저.',
    guestName: '이름 모를 분',                         // 이름을 안 적었을 때 인생 두컷에 들어가는 이름
    metal: 'silver',
    enamel: ['#33456E', '#141C30'],
    boothPaper: ['#FBFAF6', '#ECE8DE', '#17181C', '#5C5F68'],
    footer: '© 2026 페르르. ALL RIGHTS RESERVED.\nAll characters, text, images and code on this page are original works. Unauthorized copying, redistribution or reuse is prohibited.',

    /* 숨은 장치 ①③④ (parking/js/duty.js) · 미리보기 ?visit=7 · ?day=0 · ?grace=15 */
    duty: {
      by: 'ZONE 07',
      labels: { grace: '오늘 유예', count: '누적 딱지', badge: '명찰' },
      grace: {
        sec: 600,                                    // 10분 (보고 있는 동안만 줄어요)
        start: '10분 드립니다. 오늘은 나오실 건가요?',
        note: '보고 있는 동안만 줄어요. 다 채우면, 두 번째 사진.',
        done: '10분, 다 채우셨네요. …두 번째 사진, 찍었어요.',
        doneNote: '단속 확정. 내일 아침에 또 봬요.',
        early: '지난번엔 {m}분 {s}초 남기고 가셨죠. 기록돼 있어요.',
        back: '지난번엔 끝까지 계셨죠. …오늘도요?',
        stamp: '단속\n확정', stampSub: '2ND PHOTO',
        sunday: '일요일엔 단속 안 해요. …그런데 왜 왔어요?',
        sundayLabel: '일요일',
        sundayNote: '오늘은 단속 없는 날. 사진도, 유예도 없다.'
      },
      badgeDay: {                                    // ③ 일곱 번째 방문부터 명찰이 바로 섬
        visit: 7,
        flipped: '뒤집힘', upright: '바로 달림',
        img: 'assets/secret/smile.webp', alt: '처음으로 웃는 고지서',
        tag: 'VISIT 07 · BADGE UPRIGHT',
        line: '"명찰, 오늘은 바로 달았어요. …보라고 단 거 아니에요."',
        by: '— 고지서, 일곱 번째 아침',
        say: '…오늘은 명찰 안 뒤집었어요. 그냥, 그렇게 됐어요.'
      }
    },

    /* 숨은 장치 ⑤ 고지서 발급소 (parking/js/notice.js) — 실제 고지서 '느낌'만 빌린 창작물 */
    notice: {
      label: 'Notice Desk', title: '고지서 발급소', sub: '이름과 생일은 내 기기에서만 쓰여요.',
      namePh: '받는 분 이름', btn: '고지서 발급받기', save: '고지서 저장하기', again: '다시 쓰기',
      fine: '같은 이름과 생일이면 언제나 같은 고지서가 나와요. 실제 효력은 없어요.',
      guest: '이름 모를 분',
      zone: 'ZONE 07 · MORNING NOTICE', titleSub: '아침 위반 사전 안내 · 창작',
      issuer: '7번 구역 아침 단속 담당', signName: '고 지 서',
      place: '상가 골목, 늘 같은 자리',
      photos: '1장 07:50 · 2장 08:00 (유예 10분 경과)',
      deadline: '내일 아침 7시 50분',
      payAt: '같은 자리. 늦으면 유예 없음',
      stamp: '단속\n확정',
      sins: [
        '같은 자리에 마음을 세워 둔 죄',
        '유예 10분을 다 쓰고도 20초 남긴 죄',
        '단속 담당의 명찰을 훔쳐본 죄',
        '아침 7시 50분에 너무 자주 나타난 죄',
        "'규정입니다'를 웃으면서 들은 죄",
        '받은 딱지를 버리지 않고 모아 둔 죄',
        '단속 담당의 이름을 궁금해한 죄',
        '단말기 화면보다 오래 쳐다본 죄'
      ],
      fines: [
        '아침 인사 한 번',
        '내일 아침 7시 50분, 같은 자리',
        '우산 한 번 같이 쓰기',
        '이름 묻지 않기, 일주일',
        '딱지 1장 추가',
        '10분 동안 말 걸지 않기',
        '단속 끝날 때까지 기다리기'
      ],
      lines: [
        '이번 건 사진이 흔들렸어요. …다음엔 봐주지 않아요.',
        '받으셨으면 됐어요. 내일 또 오세요, 어차피.',
        '납부는 같은 자리에서. 늦으면 유예 없어요.',
        '이 번호, 외워 둘게요.',
        '규정입니다. …그래도 이름은 예쁘네요.',
        '딱지는 모으는 게 아니에요. …그래도 버리진 마요.'
      ],
      her: { m: 2, d: 4, line: '생일이 저랑 같네요. …이번 건 취소해 드릴게요. 이번만.', stamp: '취소', fine: '없음 (취소)' },
      self: { keys: ['지서', '고지서'], sin: '단속 담당의 이름으로 장난친 죄', fine: '딱지 1장 추가', line: '제 이름 갖고 장난치시는 거면, 한 장 더 끊습니다.' },
      empty: { line: '이름은 안 적으셨네요. …저도 그래요.' },
      disclaimer: '※ 이 고지서는 창작물입니다. 실제 기관·서식·납부와 아무 관계가 없으며 어떤 효력도 없습니다.'
    },

    /* 숨은 장치 ②④ (shared/presence.js) · 미리보기 ?visit=4 · ?hour=7 */
    presence: {
      by: 'ZONE 07',
      visits: {                                      // ② 누적 딱지 = 방문 회차 (오른쪽 위에 표시)
        label: '누적 딱지 {n}장',
        labelNamed: '{name} · 누적 {n}장',
        lines: [
          '처음 보는 번호판이네요. …규정은 똑같아요.',
          '또 오셨네요. 2장째.',
          '세 번째예요. 주차할 데가 정말 없는 거예요?',
          '네 장째. 번호판, 외웠어요.',
          '다섯 장. …명찰은 보지 마세요.',
          '여섯. 내일 오시면 일곱이에요.'
        ],
        many: [
          { from: 8, line: '{n}장째. 이제 사진 안 찍어도 누군지 알아요.' },
          { from: 15, line: '{n}장. …딱지를 모으는 사람은 처음 봐요.' }
        ]
      },
      linger: {
        sec: 40, gap: 50, max: 3,
        lines: [
          '서 계시기만 해도 단속 대상이에요.',
          '…볼일 없으시면 차 빼세요.',
          '그렇게 보시면 단말기 떨어뜨려요.',
          '말 안 하셔도 돼요. 시간은 가니까.'
        ]
      },
      away: { title: '…차 빼러 가셨어요?', back: '돌아오셨네요.', say: '다녀오셨어요? …유예, 멈춰 뒀어요. 이번만.', after: 20 },
      hours: [                                       // ④ 시간대
        { name: 'dawn', from: 5, to: 7, line: '05시대. …이 시간엔 왜 깨 있어요?', ticker: ['새벽 5시 41분. 그녀가 태어난 시각.'], vars: { '--bg': '#EFEEF1' } },
        { name: 'duty', from: 7, to: 9, line: '지금 단속 중이에요. 말 걸지 마세요. …10분은 드릴게요.', ticker: ['지금 이 골목 어딘가에서, 단말기가 찰칵.'] },
        { name: 'night', from: 22, to: 5, line: '이 시간엔 단속 안 해요. …그런데 왜 아직 안 자요?', ticker: ['단말기는 충전 중. 명찰은 책상 위에, 뒤집힌 채.'], vars: { '--bg': '#ECEBE6' } }
      ]
    }
  },

  config: { bgm: '' },                               // 음악 파일이 생기면 'assets/music/main.mp3'

  characters: {
    char1: {
      num: 'FILE No. 0023',
      name: '고지서',
      nameEn: 'Go Ji-seo',
      age: 27,
      birth: '2월 4일 새벽 5시 41분',
      mbti: 'ISTJ',
      nationality: '대한민국',
      height: '163cm',
      tags: ['#철벽', '#쿨데레', '#앙숙', '#원칙주의', '#이름 콤플렉스'],
      bio: '매일 아침 7시 50분, 같은 골목을 걷는 구청 주정차 단속 담당. 사진 한 장, 10분, 또 한 장. 봐주는 법은 없지만 무례한 적도 없다. 이름을 물으면 "단속 담당입니다"에서 대화가 끝난다.',
      extras: [
        ['직업', '주정차 단속 3년 차'],
        ['근무', '월~토, 아침 7시 30분부터'],
        ['말버릇', '"규정입니다."'],
        ['하루 걸음', '약 2만 보'],
        ['좋아하는 것', '정각에 맞춘 시계, 비 안 오는 월요일'],
        ['싫어하는 것', '출석 부르는 소리']
      ],
      tmi: [
        { q: '사진은 하루에 몇 장 찍어요?', a: '평균 140장. 그중 마지막 한 장은 매일 같은 번호판이다. 순서는 그녀가 정한다.' },
        { q: '쉬는 날엔 뭐 해요?', a: '일요일엔 단속이 없다. 그래도 7시 50분이면 눈이 떠진다. 그날은 시계를 정각에 맞추는 걸로 하루를 연다.' },
        { q: '당황하면 어떻게 돼요?', a: '귀가 먼저 붉어진다. 얼굴은 끝까지 무표정이라, 귀를 보는 사람만 안다.' },
        { q: '금지어가 있다던데요.', a: '"고지서가 고지서 붙이네." 이 말을 들은 날은 말이 빨라지고, 단말기를 쥔 손에 힘이 들어간다.' }
      ],
      story: [
        '새벽 5시 41분, 해가 뜨기 직전에 태어났다. 할머니는 \'새벽을 아는 아이\'라며 知曙, 두 글자를 골랐다. 성이 高라는 건 그때 아무도 신경 쓰지 않았다.',
        '초등학교 3학년, 출석부를 펼친 담임이 이름을 두 번 읽었다. 반이 웃었다. 그날부터 별명은 \'체납\', 중학교에 가서는 \'독촉장\'. 그녀는 이름이 불리기 전에 먼저 대답하는 법을 배웠다.',
        '스물넷, 구청 주정차 단속 자리에 지원했다. 규칙은 사람을 이름으로 보지 않는다. 번호판과 시간과 자리만 본다. 그게 좋았다. 가방 안쪽 주머니에는 3년째 접힌 종이가 한 장 있다. 무슨 종이인지는 아직 아무도 모른다.'
      ],
      items: [
        { img: 'assets/items/terminal.svg', title: '단속 단말기', desc: '사진 두 장 사이엔 언제나 10분. 규정이라서요. …마지막 한 장은, 늘 같은 번호판.' },
        { img: 'assets/items/pen.svg', title: '볼펜', desc: '잉크가 떨어지기 전에 바꾼다. 아침은 기다려 주지 않으니까.' },
        { img: 'assets/items/badge.svg', title: '뒤집힌 명찰', desc: '앞면엔 사진과 이름. 그래서 늘 뒷면이 보이게 단다. 팀장님 지적, 이번 달만 네 번.' },
        { img: 'assets/items/form.svg', title: '접힌 서류 한 장', desc: '가방 안쪽 주머니, 3년째 같은 자리. 칸은 다 채웠고, 날짜만 비어 있다.' }
      ],
      themeTitle: '',
      music: '',
      portrait: 'assets/portrait.webp',
      booth: ['assets/booth/char1_1.png', 'assets/booth/char1_2.png'],   // 인생 두컷 1컷 원칙 · 2컷 옅은 미소
      crack: '',                                     // 크랙 공개 후 주소를 넣어요
      gallery: [
        { img: 'assets/gallery/g01_duty.webp', label: '07:50, 1장', desc: '오늘도 같은 자리. 단말기가 먼저 움직인다.' },
        { img: 'assets/gallery/g02_glare.webp', label: '9분 50초', desc: '두 번째 사진 직전. 이 눈을 보면 다들 뛰어나온다.' },
        { img: 'assets/gallery/g03_glare2.webp', label: '규정입니다', desc: '봐 달라는 말엔 늘 같은 대답.' },
        { img: 'assets/gallery/g04_annoyed.webp', label: '핑계는 안 찍혀요', desc: '단말기에는 시간과 번호판만 남는다.' },
        { img: 'assets/gallery/g05_firm.webp', label: '봐주는 거 없어요', desc: '무례하진 않다. 다만 물러서지도 않는다.' },
        { img: 'assets/gallery/g06_duty2.webp', label: '단속 담당입니다', desc: '이름을 물으면, 대화는 여기서 끝난다.' },
        { img: 'assets/gallery/g07_startled.webp', label: '…방금, 뭐라고 했어요?', desc: '처음 듣는 대답에 단말기가 멈췄다.' },
        { img: 'assets/gallery/g08_startled2.webp', label: '바람', desc: '골목으로 바람이 훅 밀려든 아침.' },
        { img: 'assets/gallery/g09_flustered.webp', label: '…봤어요?', desc: '명찰이 넘어간 3초. 귀부터 붉어졌다.' },
        { img: 'assets/gallery/g10_shy.webp', label: '그 뜻, 누가 알려 줬어요?', desc: '새벽을 아는 아이. 그 말을 들은 날.' },
        { img: 'assets/gallery/g11_shy2.webp', label: '대답하기 곤란해요', desc: '그렇게 부르면, 무슨 표정을 해야 할지 모르겠다.' },
        { img: 'assets/gallery/g12_holdback.webp', label: '웃은 거 아니에요', desc: '입꼬리가 먼저 배신했다.' },
        { img: 'assets/gallery/g13_holdback2.webp', label: '기침이에요', desc: '두 번째 변명은 첫 번째보다 약하다.' },
        { img: 'assets/gallery/g14_holdback3.webp', label: '규정엔 없지만', desc: '웃지 말라는 규정은 없다. 그래서 더 곤란하다.' },
        { img: 'assets/gallery/g15_waver.webp', label: '…안 나오는 줄 알았어요', desc: '유예가 끝나 가던 9분째.' },
        { img: 'assets/gallery/g16_waver2.webp', label: '10분이 이렇게 길었나', desc: '같은 10분인데, 오늘은 다르게 흘렀다.' },
        { img: 'assets/gallery/g17_lonely.webp', label: '새벽에 일어나시던 분', desc: '할머니 이야기가 나오면, 시선이 내려간다.' },
        { img: 'assets/gallery/g18_angry.webp', label: '한 번만 더 해 보세요', desc: '"고지서가 고지서 붙이네." 금지어를 들은 날.' },
        { img: 'assets/gallery/g19_glare3.webp', label: '번호판, 외웠어요', desc: '사진을 안 찍어도 누군지 안다.' },
        { img: 'assets/gallery/g20_annoyed2.webp', label: '또 20초', desc: '매번 아슬아슬하게 나오는 사람.' },
        { img: 'assets/gallery/g21_startled3.webp', label: '일요일인데', desc: '단속 없는 날, 같은 골목에서 마주쳤다.' },
        { img: 'assets/gallery/g22_faint.webp', label: '오늘은 1장만', desc: '두 번째 사진은 찍지 않았다. 유예 안에 나왔으니까.' },
        { img: 'assets/gallery/g23_faint2.webp', label: '나쁘지 않은 아침', desc: '비가 안 오는 월요일.' },
        { img: 'assets/gallery/g24_faint3.webp', label: '내일도 7시 50분', desc: '약속이 아니라, 규정이라고 했다.' },
        { img: 'assets/gallery/g25_laugh.webp', label: '…진짜, 못 말려', desc: '3년 만에 처음, 단속 중에 웃었다.' },
        { img: 'assets/gallery/g26_glare4.webp', label: '도망가도 사진은 남아요', desc: '번호판은 거짓말을 안 한다.' },
        { img: 'assets/gallery/g27_startled4.webp', label: '그거, 제 거예요?', desc: '떨어뜨린 볼펜을 주워 건넸을 때.' },
        { img: 'assets/gallery/g28_waver3.webp', label: '집중 안 돼요', desc: '말 걸지 말라는 말은, 사실 반대였다.' },
        { img: 'assets/gallery/g29_duty3.webp', label: '단속 중', desc: '형광 조끼, 남색 재킷, 하루 2만 보.' },
        { img: 'assets/gallery/g30_street.webp', label: '골목 끝', desc: '상가 골목 끝, 늘 같은 자리. 오늘도 그녀가 서 있다.' }
      ]
    }
  },

  ticker: [
    '07:50. 오늘도 같은 자리.',
    '사진 두 장 사이엔 언제나 10분.',
    '명찰은 오늘도 뒤집혀 있다.',
    "'규정입니다.' 오늘만 세 번째.",
    '형광 조끼가 골목 끝에서 꺾어 들어온다.',
    '누적 딱지가 한 장 늘었다.',
    '그녀는 번호판을 외운다. 이름은 묻지 않는다.',
    '9분 50초. 상가 문이 열린다.',
    '하루 2만 보. 마지막 한 장은 늘 같은 번호판.',
    '가방 안쪽, 3년째 접힌 종이 한 장.',
    '일요일엔 단속이 없다. 그래도 7시 50분에 눈을 뜬다.',
    '새벽 5시 41분에 태어난 사람.'
  ]
};
