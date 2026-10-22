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
      again: '또 틀렸어. 이번엔 몇 초 남았을까.',          // (wrong 이 비었을 때만 쓰임)
      wrong: [                                       // 틀린 횟수마다 바뀌는 한 줄 (2번째, 3번째, 5번째, 6번째… 끝까지 가면 마지막 두 줄을 번갈아)
        '또 틀렸어. 이번엔 몇 초 남았을까.',
        '세 번째. 손이 떨리는 게 여기까지 보여.',
        '다섯 번. 네 시간이 아깝지도 않나 봐.',
        '계속 해. 구경하는 거, 꽤 재밌거든.',
        '틀릴 때마다 장부에 적고 있어. 이자까지.'
      ],
      laugh: {                                       // 네 번째로 틀리면 — 그녀가 웃는다 (부제 '틀리면 — 그녀가 웃는다'의 진짜 장면)
        at: 4,
        img: 'assets/gallery/yuna_08_laugh.webp',
        line: '…하. 네 번째야. 이쯤 되면 일부러 틀리는 거지?',
        by: '그녀가 웃었다.'
      },
      photos: [                                      // 시크릿 사진 · 밀어서(휴대폰) 또는 ← → (PC) 로 넘김
        { img: 'assets/secret/secret_01.webp', line: '이 얼굴은 금고 안에만 둬. 밖에서 떠들면 — 계약 위반이야.' },
        { img: 'assets/secret/secret_02.webp', line: '이게 누군가의 십 년이야. 생각보다 가볍지?' },
        { img: 'assets/secret/secret_03.webp', line: '이 거리면 네 시계 소리가 다 들려. 생각보다 얼마 안 남았네.' },
        { img: 'assets/secret/secret_04.webp', line: '내가 웃는 거, 처음 봤지? 공짜는 아니야.' },
        { img: 'assets/secret/secret_05.webp', line: '이건 장부에 없는 얼굴이야. 오늘 밤만 기억해.' },
        { img: 'assets/secret/secret_06.webp', line: '그렇게 오래 보면, 그것도 시간으로 계산할 거야.' }
      ],
      finale: '다 봤으면 됐어. 이제 네가 본 시간만큼, 너도 내 거야.',   // 사진을 전부 한 번씩 보면 맨 아래 나옴
      empty: '아직 비어 있어. 네가 채울 차례야.'
    },
    guestName: '쥐',                                 // 이름을 안 적었을 때 계약서·인생 두컷에 들어가는 이름
    boothStyles: {                                   // 인생 두컷 모양 (shared/booth-styles.js) — 조작판 맨 위 'Style' 줄
      list: ['classic', 'cctv', 'badge'],
      labels: { classic: '인생 두컷', cctv: '보안 카메라', badge: 'VIP 출입증' },
      cctv: {                                        // 보안 카메라: 두 컷 (나 + 서윤아)
        head: 'AURORA TOWER · SECURITY', file: 'FILE 0229',
        cams: ['CAM 03 · VAULT B2', 'CAM 07 · VIP ROOM'],
        tags: ['INTRUDER', 'TARGET ACQUIRED'],
        title: '침입자 · {name}',
        sub: 'with 서윤아 — 지운 기록 없음',
        foot: 'FOOTAGE KEPT BY S.Y.'
      },
      badge: {                                       // VIP 출입증: 내 사진 한 장만
        brand: 'BLUE MOON', level: 'VIP ACCESS · LEVEL S',
        zone: 'VIP 룸 · 금고 B2 (그녀와 동행 시)',
        owner: 'OWNED BY S.Y.', sign: 'Seo Yoon-ah',
        note: '이 출입증의 주인은, 지니고 있는 사람이 아니다.',
        empty: '사진 한 장을 올려 주세요'
      }
    },
    contract: {                                      // 3페이지 맨 아래 '시간 계약서' (shared/contract.js)
      label: 'Contract', title: '시간 계약서', sub: '입력한 이름과 생일은 내 기기에서만 처리돼요.',
      note: '이름과 생일을 적고 서명하면, 그녀가 네 시간에 값을 매겨요. 같은 이름과 생일이면 결과도 늘 같아요.',
      head: 'AURORA GROUP · TIME TRANSFER', doc: '시간 양도 계약서', no: 'AUR',
      art1: "계약자 {name}(이하 '을')은 남은 시간 가운데 아래의 기간을 오로라 그룹(이하 '갑')에 양도한다.",
      art2: '대가는 갑이 정한다. 을은 묻지 않는다.',
      specials: [                                    // 특약 (이름+생일로 하나)
        '을은 매일 밤 열한 시, 블루문 VIP 룸에 출석한다.',
        '을은 갑의 커피가 식을 때까지, 아무 데도 가지 않는다.',
        '을은 갑이 이름을 세 번 부르기 전에 대답한다.',
        '을의 손목시계는 갑이 정한 시각을 가리킨다.',
        '을은 도망칠 수 있다. 다만 어디로 가든, 갑의 영역이다.',
        '을은 금고의 비밀번호를 잊는다. 단, 갑의 생일은 잊지 않는다.',
        '을은 갑보다 먼저 늙지 않도록 노력한다.',
        '을은 갑 앞에서 거짓말을 하지 않는다. 해도 갑은 안다.'
      ],
      years: [3, 49], unit: '년',
      place: '오로라 타워 최상층', sign: 'Seo Yoon-ah',
      lines: [                                       // 연수에 따라 그녀의 한마디
        { max: 9, line: '고작 {n}년? 아껴 쓰는 타입이네.' },
        { max: 19, line: '{n}년. 적당하네, 오래 부려 먹기 좋게.' },
        { max: 34, line: '{n}년이라… 꽤 비싼 쥐새끼네.' },
        { max: 99, line: '{n}년. 이 정도면 평생 내 옆에 있어야겠는데.' }
      ],
      gift: {                                        // 생일이 그녀와 같은 2월 29일이면 — 계약 대신 선물
        birthday: '02-29',
        head: 'AURORA GROUP · A GIFT OF TIME', doc: '시간 증여서',
        art1: '갑 서윤아는 같은 날 태어난 을 {name}에게, 갑의 시간 가운데 아래의 기간을 대가 없이 준다.',
        amount: 4,
        art2: '4년에 한 번 오는 생일. 그 사이의 시간을, 을에게.',
        special: '이 선물은 반품할 수 없다. 갑도 처음 해 보는 일이므로.',
        line: '같은 생일. …이번만, 계약 대신 선물로 하지.'
      }
    },
    presence: {                                      // 숨은 장치 (shared/presence.js) — 그녀가 직접 하는 말은 화면 아래 먹색 상자로 잠깐 끼어들어요
      by: 'S.Y.',
      visits: {                                      // 방문 회차 (같은 기기) · 오른쪽 위 GUEST 자리에 표시
        label: '침입 {n}회차',                        // 이름을 안 적었을 때
        labelNamed: '{name} · {n}회차',               // 금고 화면에서 이름을 적었을 때
        lines: [
          '처음이지? 들어오는 건 쉬워. 나가는 게 어렵지.',
          '또 왔네. 두 번째야. 길은 기억했나 봐.',
          '또 기어들어 왔네. 세 번째야.',
          '네 번째. 이쯤 되면 도둑이 아니라 단골이지.',
          '다섯 번째. 이제 네 발소리는 구분할 수 있어.'
        ],
        many: [
          { from: 6, line: '{n}번째야. 문 잠그는 걸 잊은 척해 줄까.' },
          { from: 10, line: '{n}번째. …그래, 네 자리 하나 비워 둘게.' }
        ]
      },
      linger: {                                      // 40초 동안 아무것도 안 만지면 한마디 (한 번 방문에 3번까지)
        sec: 40, gap: 50, max: 3,
        lines: [
          '그렇게 오래 보면, 요금 붙어.',
          '…아직 거기 있네. 다 보여.',
          '숨은 쉬어. 그건 아직 네 거니까.',
          '멈춰 있지 마. 구경하는 사람 지루하게.'
        ]
      },
      away: {                                        // 다른 탭으로 가면 브라우저 탭 제목이 바뀜
        title: '…어딜 가?',
        back: '돌아올 줄 알았어.',
        say: '어디 갔다 왔어? 시간 재고 있었어.',      // 20초 넘게 비웠다 돌아오면
        after: 20
      },
      hours: [
        {                                            // 새벽 5시~7시 전: 오로라의 시간 (표지 위로 옅은 오로라 빛)
          name: 'dawn', from: 5, to: 7, aurora: true,
          line: '새벽이야. 오로라의 시간. …운 좋네, 이걸 다 보고.',
          ticker: ['하늘 끝에서 오로라가 번지기 시작합니다.', '서윤아가 오늘 처음으로 시계를 봅니다.']
        },
        {                                            // 밤 10시~새벽 5시 전: 달빛 회색 (검정 아님)
          name: 'night', from: 22, to: 5,
          line: '이 시간에 깨어 있는 건 나랑 쥐새끼뿐이지.',
          ticker: ['블루문, 지금 영업 중입니다.', 'VIP 룸의 문이 소리 없이 닫힙니다.', '자정이 지나도 그녀의 시계는 멈추지 않습니다.'],
          vars: { '--bg': '#E2E5EA', '--paper': '#EFF1F4', '--line': '#C8CCD3', '--line2': '#D8DBE1', '--bg-rgb': '226 229 234', '--paper-rgb': '239 241 244' }
        }
      ]
    },
                                // 음악 플레이어 모양: 타임 레저 (shared/player-ledger.js) · 비우면 기본 모양
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
    music:'assets/music/theme.mp3?v=28',               // 테마곡 (The Keeper's Vigil, 앞 15초를 잘라 낸 판) — 기록 팝업이 열려 있을 때만 자동 재생
    musicWave:{"dur":154.64,"peaks":[0.71,0.61,0.52,0.42,0.39,0.49,0.49,0.39,0.25,0.36,0.45,0.48,0.35,0.34,0.43,0.47,0.48,0.31,0.22,0.66,0.71,0.55,0.41,0.39,0.47,0.44,0.44,0.31,0.23,0.47,0.39,0.41,0.3,0.31,0.44,0.48,0.4,0.25,0.33,0.78,0.57,0.46,0.43,0.46,0.39,0.48,0.42,0.39,0.45,0.33,0.44,0.34,0.39,0.44,0.44,0.46,0.35,0.37,0.85,0.87,0.8,0.74,0.78,0.75,0.69,0.8,0.86,0.84,0.95,0.81,0.82,0.67,0.79,0.66,0.86,0.71,0.84,0.95,0.86,0.9,0.8,0.77,0.83,0.63,0.81,0.75,0.9,1.0,0.85,0.85,0.79,0.71,0.77,0.67,0.78,0.76,0.93,0.83,0.54,0.45,0.41,0.39,0.36,0.39,0.35,0.28,0.31,0.33,0.34,0.31,0.34,0.39,0.4,0.42,0.32,0.25,0.66,0.71,0.53,0.43,0.4,0.48,0.43,0.42,0.31,0.35,0.44,0.29,0.44,0.39,0.35,0.43,0.48,0.38,0.33,0.46,0.93,0.91,0.8,0.76,0.8,0.79,0.86,0.83,0.84,0.96,0.91,0.9,0.73,0.8,0.78,0.86,0.81,0.85,0.89,0.94,0.89,0.91,0.79,0.81,0.9,0.88,0.82,0.81,0.84,0.92,0.88,0.8,0.91,0.89,0.86,0.89,0.76,0.77,0.84,0.82,0.5,0.52,0.37,0.35,0.32,0.34,0.29,0.23,0.61,0.61,0.41,0.4,0.32,0.33,0.31,0.28,0.22,0.16,0.1,0.04,0.03,0.02,0.02,0.02]},   // 테마곡 파형 (자동으로 뽑은 값 · 곡을 바꾸면 이 줄은 지워도 돼요)
    booth:['assets/booth/char1_1.png?v=25', 'assets/booth/char1_2.png?v=25'],  // 인생 두컷용 배경 투명 PNG (1컷 정면, 2컷 미소)
    crack:'https://crack.wrtn.ai/characters/6ad9f872ba5b7c3db70e18fd/detail'   // '크랙에서 대화하기' 버튼 주소
  }
  }
};
