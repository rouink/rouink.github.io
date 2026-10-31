/* ===== 주인하 — 작품 내용 (이 파일만 고치면 됩니다) =====
   · 글자는 작은따옴표(' ') 안만 바꾸세요. 따옴표·쉼표·괄호는 지우면 안 돼요.
   · 캐릭터챗이라 캐릭터는 한 명(char1)이에요.
   · 이 작품 전용 기능은 auction/js 폴더에 있어요 (shared 는 그대로). */
window.ARCHIVE = {
  page: {
    title: '주인하 — The Occupant\'s House',
    brand: 'JU INHA',
    theme: 'auction',                                // auction/theme.css
    intro: 'doorlock',                               // 시작 화면: 밤 현관 도어락 (auction/js/doorlock.js)
    introTitle: '주인하',
    fonts: { display: 'Hahmlet', title: 'Space Mono', text: 'Noto Sans KR' },
    logo: 'assets/logo-dark.webp',                   // 제목 로고 (평면도 글자)

    /* 시작 화면: 밤 현관 */
    doorlock: {
      top: 'LOT No.0412 · 잔금 다음 날 · 19:40',
      hint: '도어락 번호, 아직 안 바꿨어요.\n…오늘 바꿀 거지만.',
      hintEn: 'ENTER YOUR OLD CODE',
      knock: '번호가 기억 안 나면 · 노크하기',
      opened: '…들어와요. 신발은 거기.',
      lot: '그건 물건 번호예요. …뭐, 열리긴 하네요.',     // 0412 를 누르면
      knocked: '노크는 왜 해요. 당신 번호로 열리는데.',
      namePh: '이름 (안 적어도 돼요)',
      enterBgm: '소리 켜고 들어가기',
      enterQuiet: '조용히 들어가기',
      sign: 'JU INHA · THE OCCUPANT\'S HOUSE'
    },

    heroLabel: 'LOT No.0412 · 잔금 다음 날 저녁',
    heroTitle: '주인하',
    heroSub: 'The Occupant\'s House',
    heroLine: ['등기는 내 거,', '짐은 당신 거.'],      // 둘째 줄은 포인트색
    heroImage: 'assets/hero.jpg',
    heroVideo: 'assets/hero.mp4',
    heroPosition: '64% 26%',
    worldLabel: 'Ⅰ · The Lot',
    worldTitle: ['잔금 다음 날,', '도어락이 열렸다'],
    heroText: [
      '현관 번호는 그대로였다. 당신이 살던 집의, 당신이 정한 네 자리.',
      '거실 한가운데에 짐 가방 하나와, 노란 줄자를 든 여자가 서 있었다.',
      '"등기는 넘어왔어요. 이제 이 집은 물건이고, 당신은 점유자예요."',
      '이사비 200만 원. 그녀는 당신이 나갈 때까지 남은 방에서 지내겠다고 했다.'
    ],
    quote: '그건 비용이에요. 다시 불러 보세요.',
    quoteBy: '주인하',
    pages: ['물건', '장면', '인화'],
    galleryTitle: '방마다, 그녀',
    gallerySub: '크랙에서는 잠겨 있는 장면을, 이 집에서 먼저.',
    guestName: '점유자님',                            // 이름을 안 적었을 때 인생 두컷·포토카드에 들어가는 이름
    metal: 'gold',
    enamel: ['#3A2C1E', '#15100B'],
    boothPaper: ['#F7F2E8', '#E9E0CF', '#2B2420', '#6B5A48'],
    footer: '© 2026 페르르. ALL RIGHTS RESERVED.\nAll characters, text, images and code on this page are original works. Unauthorized copying, redistribution or reuse is prohibited.',

    /* 이 집 (auction/js/house.js) — 평면도 · 영수증 · 이사비 협상 · 철벽 · 보일러
       미리보기: ?hour=23 (밤) · ?visit=5 · ?wall=40 (철벽 % 바꿔 보기) */
    house: {
      by: '주인하',
      planLabel: 'Ⅱ · Floor Plan',
      planTitle: ['이 집,', '재 봤어요.'],
      planSub: '방을 누르면, 그 방의 그녀가 열려요.',
      rooms: [
        { id: 'entry',   name: '현관',     en: 'ENTRANCE',  dims: '1,200 × 1,800', img: 'assets/gallery/08_surprised.webp',
          line: '…열쇠, 아직 갖고 있었어요?', desc: '문을 열다 멈춘 손. 번호를 바꾸겠다던 사람이, 바꾸지 않은 이유는 말하지 않았다.' },
        { id: 'living',  name: '거실',     en: 'LIVING',    dims: '3,420 × 4,860', img: 'assets/gallery/01_sarcastic.webp',
          line: '얼마면 돼요?', desc: '벽에 기대 팔짱을 낀 채, 그녀가 먼저 금액을 꺼낸다. 집은 물건, 당신은 점유자님.' },
        { id: 'kitchen', name: '부엌',     en: 'KITCHEN',   dims: '2,400 × 4,200', img: 'assets/gallery/10_light_smile.webp',
          line: '커피는 비용 처리 안 돼요. …마셔요.', desc: '이 집에 원래 있던 머그. 그녀는 두 번째 잔을 늘 조금 남긴다.' },
        { id: 'boxes',   name: '빈 방',    en: 'YOUR BOXES', dims: '2,860 × 2,600', img: 'assets/gallery/16_tired.webp',
          line: '당신 짐 빼면, 여기부터 칠할 거예요.', desc: '반쯤 칠한 벽에 기대 앉은 오후. 롤러를 놓을 때까지 그녀는 한 번도 쉬지 않았다.' },
        { id: 'util',    name: '다용도실', en: 'BOILER',    dims: '1,800 × 1,100', img: 'assets/gallery/14_lonely_phone.webp',
          line: '보일러요? …고장 아니에요.', desc: '화면을 엎어 둔 휴대폰. 매달 같은 날, 같은 문자가 온다.' },
        { id: 'her',     name: '그녀의 방', en: 'HER ROOM', dims: '2,700 × 2,400', img: 'assets/gallery/13_cold_blanket.webp', locked: true,
          lockedLine: '노크하지 마세요. 계약에 없는 방이에요.',
          line: '…보일러 소리, 원래 이렇게 조용했어요?', desc: '불 꺼진 방, 담요 한 장. 아끼는 거라고 했다. 그 말을 믿어 준 사람은 아직 없다.' }
      ],
      bath: { name: '욕실', en: 'BATH', note: '수리 예정' },
      openHer: { night: true, wallBelow: 50 },          // 그녀의 방이 열리는 조건: 밤 10시~새벽 5시, 또는 철벽 50% 미만
      lockedHint: '밤 10시 이후, 또는 철벽이 50% 아래로 내려가면',

      /* 영수증 수첩 (소지품 + TMI) */
      rcLabel: 'Ⅳ · Receipts',
      rcTitle: ['영수증은', '한 장도 안 버려요.'],
      rcSub: '소지품도, 대답도, 전부 영수증으로 남아 있다.',

      /* 이사비 협상 */
      dealLabel: 'Ⅴ · Moving Fee',
      dealTitle: ['얼마면', '나가요?'],
      dealSub: '다이얼을 돌려 금액을 부르세요. 단위는 만 원.',
      dealStart: 200,
      dealMin: 0, dealMax: 1000, dealStep: 10,
      dealBtn: '이 금액으로 부르기',
      dealSave: '영수증 저장',
      deal: [
        { max: 0,    line: '…0원이요? 나가는 데 돈이 안 든다고요? 그럼 내일 나가요.' },
        { max: 190,  line: '그 돈이면 도장 찍죠. …왜 더 안 불렀어요?' },
        { max: 200,  line: '200. 제가 처음 부른 금액이네요. 계약 성립.' },
        { max: 300,  line: '{n}… 250. 더는 안 돼요.' },
        { max: 500,  line: '그건 비용이에요. 다시 불러 보세요.' },
        { max: 999,  line: '점유자님, 그 돈이면 제가 나가겠네요.' },
        { max: 1000, line: '천만 원. …농담이죠? 웃지 마요. 저 지금 계산하고 있으니까.' }
      ],
      dealLot: '412만 원? 물건 번호로 장난치지 마세요. …외웠어요?',
      dealNote: '같은 금액을 또 부르면, 그녀도 같은 대답은 안 해요.',
      dealAgain: '아까랑 똑같은 금액이네요. 대답도 똑같을 줄 알았어요?',

      /* 철벽 게이지 */
      wall: { label: '철벽', start: 100, perVisit: 6, perDeal: 2, dealMax: 6, perStay: 2, staySec: 180, stayMax: 10, nameAt: 50,
        low: '{name}. …아, 방금 이름 불렀네요. 못 들은 걸로 해요.',
        secret: { img: 'assets/gallery/19_real_laugh.webp', tag: 'WALL < 50% · UNLOCKED', line: '"웃은 거 아니에요. 계산이 맞아서 그래요."', by: '— 주인하, 철벽이 무너진 날' } },

      boilerOn: '보일러 ON', boilerOff: '보일러 OFF',
      statusLabels: { wall: '철벽', fee: '이사비', now: '지금' },

      /* ① 보일러 켜 주기 — 밤(22~5시)에만 상태 줄에 버튼. 켜 두고 다음 날 오면 그녀가 묻는다. 켤 때마다 철벽 −4 (최대 −20) */
      boiler: {
        btn: '그녀 방 보일러 켜 주기',
        on: '보일러 ON', onNote: '몰래 켰음',
        done: '…방금 무슨 소리 났어요? 보일러 돌아가는 소리 같은데. 기분 탓이겠죠.',
        next: '어젯밤에 제 방 보일러, 누가 켰어요? …가스비는 반반이에요. 고맙다는 말은 아니고요.',
        again: '또 켰죠. 이번 달 가스비 고지서, 점유자님 앞으로 돌려 놓을 거예요.',
        perOn: 4, max: 20
      },

      /* ② 하루 한 장 영수증 — 다른 날 들어올 때마다 수첩에 한 장씩 더 붙는다 */
      dailyLabel: '오늘 붙은 영수증',
      daily: [
        { shop: '골목 철물점', rows: [['도어락 건전지 ×4', '4,800']], memo: '번호는 안 바꿨다. 아직은.' },
        { shop: '24시 편의점', rows: [['참치마요 ×2', '2,400']], memo: '할인 스티커. 오늘은 운이 좋다.' },
        { shop: '생활용품점', rows: [['수납 바구니 ×3', '6,000']], memo: '점유자님 짐이 거실까지 넘어옴. 바구니 값 청구 예정.' },
        { shop: '동네 약국', rows: [['종합 감기약', '4,500']], memo: '보일러랑은 상관없음. 진짜로.' },
        { shop: '골목 철물점', rows: [['실리콘', '3,200'], ['헤라', '6,600']], memo: '욕실 줄눈, 혼자 했다. 잘했다.' },
        { shop: '세탁소', rows: [['셔츠 ×2', '6,000']], memo: '오버핏 아님. 그냥 큰 걸 산 거임.' },
        { shop: '24시 편의점', rows: [['핫팩 ×4', '4,000']], memo: '지난주보다 두 개 더.' },
        { shop: '동네 마트', rows: [['계란 한 판', '6,900'], ['대파', '3,000']], memo: '두 사람 분량은 아님. 한 판이 싸서.' },
        { shop: '복사 출력', rows: [['입찰 서류 출력', '1,200']], memo: '다음 물건. 혼자 볼 거임.' },
        { shop: '골목 카페', rows: [['아메리카노 ×2', '9,000']], memo: '두 잔 다 내 거. 오해 금지.' },
        { shop: '골목 철물점', rows: [['문고리', '12,000']], memo: '점유자님 방 문고리. 덜컹거려서. 비용 처리 안 함.' },
        { shop: '24시 편의점', rows: [['컵라면 ×2', '3,000']], memo: '야근. 점유자님 몫 아님. …물은 두 번 끓였다.' },
        { shop: '열쇠집', rows: [['보조키 복사', '3,000']], memo: '한 개 더. 이유는 안 적음.' },
        { shop: '문구점', rows: [['영수증 수첩 리필', '2,500']], memo: '수첩이 모자란다. 이 집 때문에.' }
      ],

      /* ③ 이자 날 — 매달 이 날짜. 그날 들어오면 장면 하나 */
      interest: {
        day: 25, label: '이자일',
        img: 'assets/gallery/14_lonely_phone.webp',
        tag: 'THE 25TH · 이자 나가는 날',
        line: '"오늘이요? 아무 날도 아니에요. …문자 하나 온 거 말고는."',
        say: '오늘은 25일이에요. 저녁은 각자 먹어요. 아, 남는 건 있는데. 남는 거예요.'
      },

      /* ④ 2등의 차 — 들어올 때 가끔(약 20%) 상태 줄 아래에 뜬다 */
      car: {
        chance: 0.2,
        alert: '집 앞에 차 한 대 · 2등 입찰자',
        btn: '창밖 보기',
        img: 'assets/gallery/17_thinking.webp',
        tag: 'RUNNER-UP · 0.3%',
        line: '"커튼이요? 안 쳐요. 졌다는 거, 매일 보라고 열어 둔 거예요."',
        close: '창 닫기'
      },

      /* ⑤ 다음 물건 임장 카드 (가상의 물건) — 철벽이 낮을수록 끝 문장이 바뀐다 */
      nextLabel: 'Next Lot',
      nextTitle: ['다음 물건,', '임장 노트'],
      nextSub: '그녀가 수첩 맨 뒤에 접어 둔 물건들. 모두 가상의 물건이에요.',
      next: [
        { no: 'LOT No.0519', kind: '언덕 위 다가구 · 3층', price: [['감정가', '4억 1,000만'], ['최저가', '2억 8,700만']], pen: '계단 87개. 무릎값 별도.' },
        { no: 'LOT No.0703', kind: '오래된 상가 주택 · 1층 점포', price: [['감정가', '3억 2,000만'], ['최저가', '2억 2,400만']], pen: '1층 빵집 자리. 오븐은 놓고 갔으면.' },
        { no: 'LOT No.0826', kind: '볕 드는 투룸 · 5층', price: [['감정가', '2억 6,000만'], ['최저가', '1억 8,200만']], pen: '방이 두 개. …아니, 그냥 그렇다고요.' }
      ],
      nextEnd: [
        { below: 101, line: '혼자 볼 거예요. 따라오지 마요.' },
        { below: 70, line: '…주말에 시간 돼요? 운전만 해 줘요. 기름값은 줄게요.' },
        { below: 40, line: '같이 볼래요? 이번엔, 방 두 개짜리로.' }
      ]
    },

    /* 숨은 장치: 방문 회차 · 머무름 · 탭 이탈 · 시간대 (shared/presence.js) · 미리보기 ?visit=4 · ?hour=23 */
    presence: {
      by: '주인하',
      visits: {
        label: '점유 {n}일째',
        labelNamed: '{name} · 점유 {n}일째',
        lines: [
          '처음 뵙네요, 점유자님. 번호는 안 바꿨어요. …아직은.',
          '또 오셨네요. 짐은요?',
          '세 번째. 이사비 생각은 해 봤어요?',
          '네 번째네요. 슬리퍼, 제 거 신지 마세요.',
          '다섯 번. 오늘은 커피 두 잔 내렸어요. 계산은 따로.',
          '여섯 번째. 이 정도면 짐이 아니라 사람이 안 나가는 거예요.'
        ],
        many: [
          { from: 8, line: '{n}번째. 등기부엔 제 이름인데, 왜 당신이 더 자주 와요?' },
          { from: 15, line: '{n}번째. …이제 번호 바꿔도 당신은 알겠네요.' }
        ]
      },
      linger: {
        sec: 40, gap: 50, max: 3,
        lines: [
          '그렇게 서 있으면 점유 기간도 늘어요.',
          '재는 거 구경해요? 3,420이에요.',
          '말 안 할 거면 짐이라도 싸요.',
          '계속 보면 그것도 비용 청구해요.'
        ]
      },
      away: { title: '…짐 싸러 갔어요?', back: '돌아왔네요.', say: '어디 다녀왔어요? …안 물어본 걸로 해요.', after: 20 },
      hours: [
        { name: 'night', from: 22, to: 5, line: '이 시간엔 보일러 안 틀어요. 아끼는 거예요. …진짜로.', ticker: ['그녀의 방에서는, 보일러 소리가 나지 않는다.'] },
        { name: 'morning', from: 6, to: 9, line: '커피 내렸어요. 한 잔은 남는 거예요. 남는 거.', ticker: ['부엌에 머그 두 개. 하나는 아직 따뜻하다.'] }
      ]
    }
  },

  config: { bgm: 'assets/music/main.mp3' },                               // Sass in the Sunlight

  characters: {
    char1: {
      num: 'LOT No.0412',
      name: '주인하',
      nameEn: 'Ju Inha',
      age: 26,
      birth: '4월 12일',
      mbti: 'ENTP',
      nationality: '대한민국',
      height: '165cm',
      tags: ['#경멸', '#싸가지', '#철벽녀', '#혐관', '#동거'],
      bio: '법원 경매로 낡은 집을 사서 고쳐 파는 투자자. 집은 \'물건\', 당신은 \'점유자님\'. 사정은 끝까지 들어 주지만, 금액은 한 푼도 깎아 주지 않는다. 약이 오르면 존댓말 사이로 반말이 샌다.',
      extras: [
        ['직업', '부동산 경매 투자 · 첫 단독 낙찰'],
        ['말버릇', '"그건 비용이에요."'],
        ['버릇', '방에 들어가면 줄자부터 꺼낸다'],
        ['좋아하는 것', '딱 떨어지는 숫자, 첫 열쇠를 받는 날'],
        ['싫어하는 것', '2등, 깎아 달라는 말']
      ],
      /* 영수증 수첩의 Q&A 영수증 (평면도 아래) */
      receiptQA: [
        { q: '집을 왜 사요?', a: '고쳐서 팔려고요. 정 붙이면 손해라서. …이번 건 좀 오래 걸리고 있지만.' },
        { q: '2등은 누구였어요?', a: '0.3% 차이로 진 사람. 아직도 가끔 이 집 앞에 차를 세운다. 그녀는 커튼을 치지 않는다.' },
        { q: '커피는요?', a: '하루 두 잔. 두 번째 잔은 영수증을 붙이면서. 머그는 이 집에 원래 있던 걸 쓴다.' },
        { q: '생일이 언제예요?', a: '4월 12일. 물건 번호를 처음 봤을 때, 그녀는 입찰서를 한 번에 썼다.' }
      ],
      /* 기록 팝업 TMI (영수증 수첩의 Q&A 와 다른 내용) */
      tmi: [
        { q: '좋아하는 음식은요?', a: '편의점 참치마요 삼각김밥. 이 값에 이만한 효율이 없어서요. 할인 스티커가 붙으면 두 개.' },
        { q: '쉬는 날엔 뭐 해요?', a: '쉬는 날이 뭔데요. …소파 끝에 앉아 다른 동네 매물 사진을 넘긴다. 보는 건 공짜라서.' },
        { q: '무서운 거 있어요?', a: '법원 마크가 찍힌 등기 우편 봉투. 받는 쪽이 될 때만요.' },
        { q: '안경은 언제부터 썼어요?', a: '감정평가서 글씨가 작아지던 스물셋부터. 도수는 안 올랐다고 우기는 중이다.' },
        { q: '연애는요?', a: '비용 대비 효율이 안 나와서요. 질문 끝났으면, 계산 다시 할게요.' }
      ],

      story: [
        '스물두 살, 첫 월급날. 동기들이 가방을 고를 때 그녀는 경매 입문 강의를 결제했다. 강사는 감정가를 보라고 했다. 그녀는 감정가와 낙찰가 사이, 아무도 오래 들여다보지 않는 몇 퍼센트를 봤다. 그날부터 숫자는 그녀에게 거짓말을 하지 않는 유일한 것이 됐다.',
        '스물셋의 겨울, 처음 임장을 나간 날 골목 철물점에서 노란 줄자를 샀다. 그해 입찰 봉투를 열한 번 냈고, 열한 번 떨어졌다. 법정에서 이름이 불린 적은 한 번도 없었다. 지는 날에도 방은 재 둘 수 있었다. 그래서 줄자는 늘 허리춤에 있었다.',
        '스물넷부터 2년, 공동 투자로 일곱 채를 고쳐 팔았다. 벽지를 뜯고, 배관을 갈고, 밤새 줄눈을 긁었다. 수익은 나눴지만 등기부에는 늘 다른 사람 이름이 먼저 올랐다. 누가 얼마를 냈는지 증명할 수 있는 건 종이뿐이었다. 영수증을 한 장도 버리지 않는 버릇은 그때 생겼다.',
        '스물여섯, 법원 경매 공고에서 물건번호 0412를 봤다. 낡았지만 오후 볕이 거실 끝까지 드는 집. 생일과 같은 숫자라서가 아니라고, 그녀는 지금도 말한다. 입찰서는 한 번에 썼다. 전 재산에 대출을 얹었다. 개찰이 끝났을 때, 2등과의 차이는 0.3%. 처음으로, 혼자 이긴 날이었다.',
        '잔금에는 살던 오피스텔 보증금까지 들어갔다. 갈 곳이 없다는 말은 누구에게도 하지 않았다. 잔금 다음 날 밤, 남은 방에 짐 가방을 내려놓고 그녀는 자기 방 보일러를 껐다. 수첩에는 \'난방비 절감\'이라고만 적었다. 그 아래, 몇 번이고 지웠다 다시 쓴 날짜가 하나 있다. 매달 이자가 빠져나가는 날.'
      ],
      /* 소지품 = 영수증 (평면도 아래 '영수증 수첩'에 그려져요) */
      items: [
        { title: '노란 줄자 5.5m', icon: '5.5M', desc: '첫 임장 때 산 줄자. 눈금 몇 군데가 지워졌다.',
          shop: '골목 철물점', date: '10.29 19:42', rows: [['줄자 5.5M', '6,500'], ['실리콘 ×2', '6,400']], total: '12,900', memo: '거실 3,420. 생각보다 넓네.' },
        { title: '핫팩 두 개', icon: '×2', desc: '자기 방에만 쓰는 것.',
          shop: '24시 편의점', date: '10.30 01:12', rows: [['핫팩 ×2', '2,000'], ['컵라면', '1,500']], total: '3,500', memo: '핫팩은 비용 처리 안 됨.' },
        { title: '클리어 파일', icon: 'A4', desc: '서랍 맨 아래, 아직 접수하지 않은 서류가 들어 있다.',
          shop: '문구점', date: '10.29 11:05', rows: [['클리어 파일 A4', '1,200']], total: '1,200', memo: '아직 안 낼 거예요. 아직은.' },
        { title: '집게핀', icon: 'CLIP', desc: '머리를 대충 올릴 때 쓰는 갈색 집게핀.',
          shop: '생활용품점', date: '10.28 18:30', rows: [['집게핀 브라운', '3,000'], ['줄자 케이스', '2,000']], total: '5,000', memo: '머리 묶을 시간에 한 방 더 잰다.' }
      ],
      themeTitle: 'Before the Day Begins',
      music: 'assets/music/theme.mp3',
      video: 'assets/popup.mp4',                    // 기록 팝업 영상 (벽에 기대 팔짱)
      poster: 'assets/popup.jpg',
      mediaShape: 'wide',
      portrait: 'assets/portrait.webp',
      booth: ['assets/booth/char1_1.webp', 'assets/booth/char1_2.webp'],   // 인생 두컷 1컷 팔짱 · 2컷 옅은 미소
      crack: '',                                    // 크랙 공개 후 주소를 넣어요
      gallery: [
        { img: 'assets/gallery/00_base_neutral.webp', label: '19:40, 거실 창가', desc: '잔금 다음 날 저녁. 그녀가 먼저 와 있었다.' },
        { img: 'assets/gallery/01_sarcastic.webp', label: '얼마면 돼요?', desc: '집은 물건, 당신은 점유자님.' },
        { img: 'assets/gallery/02_calculating.webp', label: '법원 복도', desc: '서류 위로 숫자를 다시 센다. 0.3%는 운이 아니라고.' },
        { img: 'assets/gallery/03_flustered.webp?v=2', label: '그건, 계산에 없었어요', desc: '찔린 곳을 손으로 가린다. 표정까지는 못 가렸다.' },
        { img: 'assets/gallery/04_wavering.webp', label: '끝까지 들을게요', desc: '사정은 다 들어 준다. 금액만 그대로다.' },
        { img: 'assets/gallery/05_annoyed.webp', label: '협상 3시간째', desc: '머리를 쓸어 올리는 건 지는 것 같아서 싫다고 했다.' },
        { img: 'assets/gallery/06_glaring.webp', label: '식탁 위의 숫자', desc: '양손을 짚고 몸을 내민다. 이번엔 안 물러선다.' },
        { img: 'assets/gallery/07_pointing.webp', label: '너, 지금 웃었어?', desc: '존댓말이 샜다. 본인만 모른다.' },
        { img: 'assets/gallery/08_surprised.webp', label: '열쇠, 아직 있었어요?', desc: '현관문 앞에서 멈춘 손.' },
        { img: 'assets/gallery/09_smug_win.webp?v=2', label: '계약 성립', desc: '안경을 밀어 올리는 건 이겼을 때만.' },
        { img: 'assets/gallery/10_light_smile.webp', label: '두 번째 잔', desc: '남는 거예요. 남는 거.' },
        { img: 'assets/gallery/11_holding_laugh.webp?v=2', label: '웃은 거 아니에요', desc: '손등이 먼저 입을 막았다.' },
        { img: 'assets/gallery/12_shy.webp', label: '고맙다는 말', desc: '그 말엔 금액을 못 붙여서, 대답을 미뤘다.' },
        { img: 'assets/gallery/13_cold_blanket.webp', label: '보일러는 켜져 있어요', desc: '켜져 있다고 했다. 그 방만 빼고.' },
        { img: 'assets/gallery/14_lonely_phone.webp', label: '매달 같은 날', desc: '같은 문자가 온다. 화면을 엎어 둔다.' },
        { img: 'assets/gallery/16_tired.webp', label: '반만 칠한 벽', desc: '롤러를 놓은 건 해가 진 뒤였다.' },
        { img: 'assets/gallery/17_thinking.webp', label: '다음 물건', desc: '창밖을 보는 게 아니라, 창틀 폭을 재고 있었다.' },
        { img: 'assets/gallery/18_pouting.webp', label: '진 거 아니에요', desc: '돌아앉아 팔짱. 말싸움 한 판의 결과.' },
        { img: 'assets/gallery/19_real_laugh.webp', label: '…진짜, 못 말려', desc: '처음으로 계산 없이 웃었다.' },
        { img: 'assets/gallery/20_fluttered.webp', label: '그렇게 보지 마요', desc: '철벽은 1%씩 무너진다. 오늘은 조금 많이.' },
        { img: 'assets/gallery/21_sorry.webp', label: '말이 지나쳤어요', desc: '사과에도 금액이 있었다면, 그녀는 먼저 냈을 것이다.' },
        { img: 'assets/gallery/22_relieved.webp', label: '잔금 다 냈어요', desc: '소파에 몸을 묻는다. 오늘만은 숫자가 없다.' },
        { img: 'assets/gallery/23_angry.webp', label: '2등은 돌아가세요', desc: '현관을 막아선 등. 이 집은 이미 낙찰됐다.' },
        { img: 'assets/gallery/01b_armscrossed_neutral.webp', label: '협상 테이블', desc: '팔짱은 시작 신호.' },
        { img: 'assets/gallery/10b_light_smile_mug.webp', label: '아침 7시', desc: '머그를 두 손으로 쥐는 건 손이 차가워서다.' },
        { img: 'assets/gallery/13b_cold_floor.webp', label: '새벽 2시', desc: '상자 옆, 바닥에 앉아 무릎을 안는다.' },
        { img: 'assets/gallery/23b_angry_door.webp', label: '문 앞', desc: '이 문은 내가 연다.' }
      ]
    }
  },

  ticker: [
    'LOT No.0412. 등기는 그녀 이름으로.',
    '거실 3,420 × 4,860. 줄자는 거짓말을 안 한다.',
    '이사비 200만 원. 아직 아무도 도장을 찍지 않았다.',
    '도어락 번호는 그대로다. 오늘도.',
    '영수증 수첩이 한 장 더 두꺼워졌다.',
    '그녀는 2등과 0.3% 차이로 이겼다.',
    '서랍 맨 아래, 아직 내지 않은 서류 한 장.',
    '부엌에는 원래 이 집에 있던 머그가 남아 있다.',
    '그녀의 방은 노크 금지.',
    '다음 물건은 아직 정하지 않았다고 했다.'
  ]
};
