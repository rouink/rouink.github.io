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
      statusLabels: { wall: '철벽', fee: '이사비', now: '지금' }
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
      tmi: [
        { q: '집을 왜 사요?', a: '고쳐서 팔려고요. 정 붙이면 손해라서. …이번 건 좀 오래 걸리고 있지만.' },
        { q: '2등은 누구였어요?', a: '0.3% 차이로 진 사람. 아직도 가끔 이 집 앞에 차를 세운다. 그녀는 커튼을 치지 않는다.' },
        { q: '커피는요?', a: '하루 두 잔. 두 번째 잔은 영수증을 붙이면서. 머그는 이 집에 원래 있던 걸 쓴다.' },
        { q: '생일이 언제예요?', a: '4월 12일. 물건 번호를 처음 봤을 때, 그녀는 입찰서를 한 번에 썼다.' }
      ],
      story: [
        '스물두 살, 첫 월급으로 경매 강의를 들었다. 남들은 감정가를 봤고, 그녀는 낙찰가와 감정가 사이의 숫자를 봤다. 그 차이가 그녀의 일이 됐다.',
        '스물넷부터 2년 동안, 공동 투자로 일곱 채를 고쳐 팔았다. 등기부에 이름이 혼자 올라간 적은 한 번도 없었다. 그래서 이번엔 전 재산과 대출을 넣었다. 첫 단독 낙찰, 2등과의 차이는 0.3%.',
        '잔금에는 살던 오피스텔 보증금까지 들어갔다. 갈 곳이 없다는 말은 누구에게도 하지 않았다. 남은 방에 짐 가방을 내려놓던 밤, 그녀는 자기 방 보일러를 껐다. 아끼는 거라고, 수첩에는 그렇게만 적었다.'
      ],
      /* 소지품 = 영수증 (평면도 아래 '영수증 수첩'에 그려져요) */
      items: [
        { title: '노란 줄자 5.5m', desc: '첫 임장 때 산 줄자. 눈금 몇 군데가 지워졌다.',
          shop: '골목 철물점', date: '10.29 19:42', rows: [['줄자 5.5M', '6,500'], ['실리콘 ×2', '6,400']], total: '12,900', memo: '거실 3,420. 생각보다 넓네.' },
        { title: '핫팩 두 개', desc: '자기 방에만 쓰는 것.',
          shop: '24시 편의점', date: '10.30 01:12', rows: [['핫팩 ×2', '2,000'], ['컵라면', '1,500']], total: '3,500', memo: '핫팩은 비용 처리 안 됨.' },
        { title: '클리어 파일', desc: '서랍 맨 아래, 아직 접수하지 않은 서류가 들어 있다.',
          shop: '문구점', date: '10.29 11:05', rows: [['클리어 파일 A4', '1,200']], total: '1,200', memo: '아직 안 낼 거예요. 아직은.' },
        { title: '집게핀', desc: '머리를 대충 올릴 때 쓰는 갈색 집게핀.',
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
        { img: 'assets/gallery/03_flustered.webp', label: '그건, 계산에 없었어요', desc: '찔린 곳을 손으로 가린다. 표정까지는 못 가렸다.' },
        { img: 'assets/gallery/04_wavering.webp', label: '끝까지 들을게요', desc: '사정은 다 들어 준다. 금액만 그대로다.' },
        { img: 'assets/gallery/05_annoyed.webp', label: '협상 3시간째', desc: '머리를 쓸어 올리는 건 지는 것 같아서 싫다고 했다.' },
        { img: 'assets/gallery/06_glaring.webp', label: '식탁 위의 숫자', desc: '양손을 짚고 몸을 내민다. 이번엔 안 물러선다.' },
        { img: 'assets/gallery/07_pointing.webp', label: '너, 지금 웃었어?', desc: '존댓말이 샜다. 본인만 모른다.' },
        { img: 'assets/gallery/08_surprised.webp', label: '열쇠, 아직 있었어요?', desc: '현관문 앞에서 멈춘 손.' },
        { img: 'assets/gallery/09_smug_win.webp', label: '계약 성립', desc: '안경을 밀어 올리는 건 이겼을 때만.' },
        { img: 'assets/gallery/10_light_smile.webp', label: '두 번째 잔', desc: '남는 거예요. 남는 거.' },
        { img: 'assets/gallery/11_holding_laugh.webp', label: '웃은 거 아니에요', desc: '손등이 먼저 입을 막았다.' },
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
