/* ===== 권세율 — 작품 내용 (이 파일만 고치면 됩니다) =====
   · 글자는 작은따옴표(' ') 안만 바꾸세요. 따옴표·쉼표·괄호는 지우면 안 돼요.
   · 캐릭터챗이라 캐릭터는 한 명(char1)이에요.
   · 이 작품 전용 기능은 audit/js 폴더에 있어요 (shared 는 그대로).
   · 서식(손익계산서·통지서)은 실제 서식의 '느낌'만 빌린 창작물이에요. */
window.ARCHIVE = {
  page: {
    title: '권세율 — Room 3, Day One',
    brand: 'KWON SEYUL',
    theme: 'audit',                                  // audit/theme.css
    intro: 'door',                                   // 시작 화면: 닫힌 회의실 문 (audit/js/door.js)
    introTitle: '권세율',
    fonts: { display: 'Nanum Myeongjo', title: 'DM Mono', text: 'Gothic A1' },

    /* 시작 화면: 제3회의실 문 앞 */
    door: {
      image: 'assets/door.jpg',
      room: '제3회의실', inUse: '사용 중',
      top: 'TAX AUDIT · ROOM 3',
      line: '문은 닫혀 있다.\n안에서 서류 넘기는 소리. 맨 뒷장부터, 거꾸로.',
      cells: ['조사', '커피', '불신'],               // 아래 숫자는 사이트가 채워요
      namePh: '이름 (안 적어도 돼요)',
      knock: '노크하기', quiet: '조용히 들어가기',
      hint: '노크하면 소리가 납니다',
      answer: '…들어오세요. 문은 닫고요.',            // 노크했을 때
      answerQuiet: '노크는 하고 들어오셔야죠. …앉으세요.', // 조용히 들어갔을 때
      sign: 'KWON SEYUL · ROOM 3, DAY ONE'
    },

    heroLabel: 'TAX AUDIT · FILE 1103',
    heroTitle: '권세율',
    heroSub: 'Room 3, Day One',
    heroLine: ['증빙 없는 건 다 부인합니다.', '대표님 말도요.'],   // 둘째 줄은 포인트색
    heroImage: 'assets/hero.jpg',
    heroPosition: '50% 26%',
    worldLabel: 'Ⅰ · The Audit',
    worldTitle: ['첫날 아침,', '문이 닫혔다'],
    heroText: [
      '당신의 회사에 세무조사 통지가 왔다. 기간은 20일.',
      '첫날 아침, 베이지 코트를 입은 조사관이 회의실 하나를 비워 달라고 했다.',
      '탁자 위에는 텀블러 하나와 자료 목록 세 장. 당신이 내민 커피는 책상 끝으로 밀려났다.',
      '"조사 대상한테는 안 받습니다." 그리고 그녀는 문을 닫았다.'
    ],
    quote: '숫자를 틀리는 건 괜찮아요. 숫자로 거짓말하는 게 문제죠.',
    quoteBy: '권세율',
    pages: ['회의실', '기록', '제작소'],
    galleryTitle: '20일, 회의실 3',
    gallerySub: '크랙에서는 잠겨 있는 장면을, 이 회의실에서 먼저.',
    guestName: '대표님',                              // 이름을 안 적었을 때 들어가는 이름
    metal: 'silver',
    enamel: ['#2C4FA3', '#1B2130'],
    boothPaper: ['#F7F5F0', '#E8E4DB', '#1B2130', '#5A6272'],
    footer: '© 2026 페르르. ALL RIGHTS RESERVED.\nAll characters, text, images and code on this page are original works. Unauthorized copying, redistribution or reuse is prohibited.',

    /* 조사 장치 (audit/js/audit.js)
       미리보기: ?day=7 (조사 n일차) · ?coffee=6 (거절한 날 수) · ?date=0331 (3월 31일) · ?hour=23 */
    audit: {
      by: '권세율',
      days: 20,
      doubtStart: 90,                                // 불신 % 시작값
      status: { day: '조사', request: '오늘 요청 자료', coffee: '커피', doubt: '불신', closed: '조사 종결' },

      /* ① 커피 내밀기 — 하루 한 번. 거절한 날이 쌓이다 acceptAfter 번째 날에 처음 받는다 */
      coffee: {
        label: 'Ⅲ · Coffee', title: ['커피,', '드릴까요?'],
        sub: '하루에 한 번만 내밀 수 있어요.',
        img: 'assets/gallery/g05_refusal.webp', cap: 'DAY 01 · 책상 끝의 커피',
        btn: '커피 내밀기', btnDone: '오늘은 이미 내밀었어요',
        acceptAfter: 7,
        refuse: [
          '조사 대상한테는 안 받습니다.',
          '텀블러 있어요. 보리차요.',
          '…내일도 가져오실 거면, 오늘 건 대표님이 드세요.',
          '규정이에요. 커피가 싫은 게 아니라.',
          '식으면 버리지 말고 드세요. 아깝잖아요.',
          '몇 번째인지는 저도 세고 있어요. 여섯 번째.'
        ],
        accept: '…오늘만이에요. 조사 끝나면, 그땐 제가 살게요.',
        after: [
          '오늘은 제가 텀블러를 채워 왔어요. 보리차요. 데운 거.',
          '받았다고 판정이 달라지진 않아요. …알죠?',
          '커피 맛은 모르겠어요. 받은 날은 기억나요.'
        ],
        countLabel: '거절 {n}일째', none: '아직', acceptedLabel: '받음 {d}',
        secretTag: 'COFFEE · ACCEPTED', secretBy: '— 권세율, 처음 받아 든 날'
      },

      /* ② 오늘 요청 자료 — 조사 n일차마다 바뀜 (첫 방문 날이 1일차) */
      requests: [
        ['법인 통장 거래내역 3개월분', '통장부터요. 숫자는 사람보다 거짓말을 덜 하니까.'],
        ['매출 세금계산서 합계표', '오늘은 매출. 내일은 매입이에요. 미리 말씀드리는 거예요.'],
        ['매입 세금계산서 합계표', '어제 자료는 잘 받았어요. 한 장이 비지만, 그건 내일 여쭤볼게요.'],
        ['법인카드 사용 내역', '주말 사용분만 따로 표시해 주세요. 이유는 묻지 마시고요.'],
        ['대표자 가지급금 명세', '대표님 거 맞는지, 대표님이 제일 잘 아시겠죠.'],
        ['급여대장·원천징수 내역', '사람 이름이 많은 서류는 오래 봐요. 한 명씩.'],
        ['거래처 원장 상위 10곳', '세 번째 거래처요. 주소가 두 번 바뀌었네요.'],
        ['접대비 지출 증빙', '접대비는 금액보다 날짜를 봐요. 일요일이 많네요.'],
        ['재고자산 수불부', '창고에 직접 가 보진 않을게요. 오늘은요.'],
        ['외주용역 계약서', '계약서 날짜랑 입금 날짜가 같으면 편하죠. 다르면 제가 바빠지고요.'],
        ['차량 운행 기록부', '주행거리는 거짓말을 못 해요. 적는 사람이 하지.'],
        ['현금 출납장', '현금은 흔적이 적어요. 그래서 제일 오래 봐요.'],
        ['대표자 개인 계좌 내역 (동의서 첨부)', '동의는 대표님이 하시는 거예요. 안 하셔도 돼요. 대신 그만큼 오래 걸려요.'],
        ['이사회 의사록', '회의를 했다는 기록보다, 무슨 말을 했는지가 궁금해요.'],
        ['감가상각 명세서', '오래 쓴 건 값이 줄어요. 장부에서는요.'],
        ['퇴직금 지급 내역', '작년에 나간 사람이 한 명 있죠. 그 사람 이야기를 듣고 싶어요.'],
        ['미지급금 명세', '갚을 돈 목록이에요. 대표님 모르는 게 하나 있을 거예요.'],
        ['전년도 법인세 신고서 사본', '작년 대표님이 쓴 숫자예요. 올해 대표님이랑 비교해 볼게요.'],
        ['소명 자료 최종본', '마지막으로 하실 말씀 있으면, 증빙이랑 같이 주세요.'],
        ['확인서 서명', '마지막 날이에요. 여기, 서명해 주세요. …수고하셨어요.']
      ],

      /* ③ 소명서 제출 — 적은 글로 판정 (같은 글이면 같은 판정) */
      plea: {
        label: 'Ⅳ · Statement', title: ['소명하세요.', '듣고 있으니까.'],
        sub: '적은 글은 내 기기에서만 쓰여요. 같은 글이면 언제나 같은 판정이 나와요.',
        img: 'assets/gallery/g04_scorn.webp', cap: '그건 대표님 사정이고요',
        namePh: '이름 (안 적으면 대표님)', textPh: '예: 그 돈은 거래처 선급금입니다',
        btn: '소명서 제출', again: '다시 쓰기', copy: '기록 복사',
        copied: '복사했어요. 크랙 유저노트에 붙여 보세요.',
        verdicts: {
          '인정': ['확인했습니다. 이 건은 인정할게요.', '증빙은 없지만, 말은 맞아요. 이번만.', '…인정. 대표님 말이 처음으로 숫자랑 맞네요.'],
          '보류': ['보류할게요. 내일 증빙 가져오세요.', '믿고 싶은 거랑 믿는 건 달라요. 보류.', '반쯤은 맞는 말이네요. 나머지 반을 가져오세요.'],
          '부인': ['부인합니다. 증빙이 없으니까요.', '세 번째 변명이네요. 부인.', '대표님 사정은 알겠어요. 판정은 부인이에요.']
        },
        keys: [
          { k: ['커피'], v: '보류', line: '커피 얘기는 소명이 아니에요. …알고 있어요, 몇 번째인지.' },
          { k: ['좋아', '사랑', '보고 싶'], v: '보류', line: '업무와 무관한 소명이네요. 증빙을 첨부하세요. …농담이에요.' },
          { k: ['권세율', '세율'], v: '부인', line: '제 이름으로 소명하시면 곤란해요. 부인.' },
          { k: ['증빙', '영수증', '계약서'], v: '인정', line: '증빙이 있다고요? 그럼 얘기가 다르죠. 인정.' }
        ],
        disclaimer: '※ 창작물입니다. 실제 세무조사·소명 절차와 관계없습니다.'
      },

      /* ④ 관계 손익계산서 — 이 사이트에서 한 일로 숫자가 채워져요 */
      pl: {
        label: 'Ⅴ · Statement of Income', title: ['당신과 나 사이,', '손익계산서'],
        sub: '방문한 날, 내민 커피, 낸 소명으로 숫자가 채워져요.',
        head: '손 익 계 산 서', period: '제 1 기  조사 개시일부터 오늘까지', unit: '(단위: 원)',
        rows: {
          sales: ['Ⅰ. 매출액', '함께한 조사일', 1000000],
          cogs: ['Ⅱ. 매출원가', '거절당한 커피', 4500],
          gross: ['Ⅲ. 매출총이익'],
          sga: ['Ⅳ. 판매비와관리비', '부인당한 소명', 300000, '보류된 소명', 100000],
          op: ['Ⅴ. 영업이익'],
          nonopIn: ['Ⅵ. 영업외수익', '인정받은 소명', 500000, '받아 든 커피', 3000000],
          nonopOut: ['Ⅶ. 영업외비용', '밤에 찾아온 날', 50000],
          pretax: ['Ⅷ. 법인세비용차감전순이익'],
          tax: ['Ⅸ. 법인세비용', '불신율 적용'],
          net: ['Ⅹ. 당기순이익']
        },
        opinion: { label: '조사관 의견', loss: '적자예요. 그래도 조사는 계속됩니다.', low: '흑자네요. 아직 작지만.', mid: '숫자가 좋아지고 있어요. …대표님 덕분인지는 모르겠지만.', high: '이 정도면, 제가 부인할 게 없네요.' },
        copy: '기록 복사', copied: '복사했어요.',
        disclaimer: '※ 손익계산서 서식의 느낌만 빌린 창작물입니다. 실제 회계·세무와 관계없습니다.'
      },

      /* ⑤ 거꾸로 넘기는 서류 — 앞에서부터 읽으면 4장, 맨 뒷장부터 넘기면 숨은 한 장 */
      memo: {
        label: 'Ⅵ · Her Notes', title: ['조사관 메모', ''],
        sub: '그녀는 의심이 들면, 서류를 맨 뒷장부터 넘긴다.',
        img: 'assets/gallery/g03_suspicion.webp', cap: 'DAY 03 · 맞지 않는 숫자',
        pages: [
          '1일차. 회의실 3. 창을 등진 자리.\n대표는 커피를 두 잔 가져옴. 한 잔은 본인 것인 줄 알았음.',
          '3일차. 거래처 지급액, 장부와 통장이 맞지 않음.\n대표의 표정: 모르는 쪽에 가까움.',
          '7일차. 소명 세 번째.\n말은 서툴다. 숫자는 맞다.',
          '12일차. 새는 곳은 대표의 책상이 아니다.\n확인 필요. 서두를 것.'
        ],
        hidden: '맨 뒷장, 연필로 쓴 한 줄.\n"배정이 아니라 신청. 이유는 적지 않는다."',
        hiddenTag: 'READ BACKWARDS · FOUND',
        prev: '← 앞 장', next: '다음 장 →', back: '맨 뒷장부터'
      },

      /* ⑥ 3월 31일 (그녀의 생일이자 법인세 신고 마감일) — ?date=0331 로 미리보기 */
      march31: {
        tag: '03.31 · DEADLINE',
        line: '3월 31일. 법인세 신고 마감일이에요.\n…그리고 네, 제 생일이기도 해요.',
        say: '오늘은 커피, 받을게요. 마감일이니까요. 다른 이유는 없어요.'
      },

      /* ⑦ 조사 종결 통지 — 20일차부터 열려요 (법인세 신고서 첫 장 서식을 빌린 창작물) */
      closing: {
        label: 'Ⅶ · Closing Notice', title: ['조사 종결', '통지'],
        btn: '통지서 열기',
        form: '세무조사 결과 통지 (창작)',
        rows: [
          ['조사 대상', '{name}'],
          ['조사 기간', '20일 (제3회의실)'],
          ['요청 자료', '20건 · 전부 제출'],
          ['소명', '{plea}건'],
          ['커피', '{coffee}'],
          ['결정 내용', '신고 내용 인정']
        ],
        note: '조사관 의견란',
        noteText: '숫자는 다 맞았습니다.\n다음에는 조사관이 아닌 채로 뵙겠습니다.',
        sign: '조사관  권 세 율',
        img: 'assets/closing.webp',
        disclaimer: '※ 법인세 신고서 서식의 느낌만 빌린 창작물입니다. 실제 기관·서식·효력과 관계없습니다.'
      }
    },

    /* 방문 회차 · 머무름 · 탭 이탈 · 시간대 (shared/presence.js) · 미리보기 ?visit=4 · ?hour=23 */
    presence: {
      by: '권세율',
      visits: {
        label: '방문 {n}회',
        labelNamed: '{name} 대표 · {n}회',
        lines: [
          '권세율입니다. 20일 동안 이 회의실을 쓸게요.',
          '또 오셨네요. 자료는요?',
          '세 번째. 노크는 하셨죠?',
          '네 번째예요. 문 앞에 서 계신 거, 알고 있었어요.',
          '다섯 번째. …커피는 오늘도 안 받아요.',
          '여섯 번째. 의자, 대표님 자리로 하나 더 갖다 놨어요. 업무상.'
        ],
        many: [
          { from: 8, line: '{n}번째. 이제 노크 소리만 들어도 누군지 알아요.' },
          { from: 20, line: '{n}번째. 조사 기간보다 많이 오셨네요.' }
        ]
      },
      linger: {
        sec: 45, gap: 55, max: 3,
        lines: [
          '할 말 있으시면 하세요. 없으시면, 저는 서류 볼게요.',
          '…거기 서 계시면 신경 쓰여요.',
          '말 안 하셔도 시간은 가요. 조사 기간도요.'
        ]
      },
      away: { title: '…자료 가지러 가셨어요?', back: '오셨네요.', say: '자리 비우신 동안 서류, 맨 뒷장까지 다 봤어요.', after: 20 },
      hours: [
        { name: 'dawn', from: 5, to: 8, line: '이 시간엔 아직 출근 전이에요. …저 말고는요.', ticker: ['06:40. 회의실 불이 먼저 켜진다.'], vars: { '--bg': '#EEEFF2' } },
        { name: 'night', from: 22, to: 5, line: '회의실 불은 9시에 꺼져요. …오늘은 좀 늦었네요.', ticker: ['22시. 텀블러의 보리차는 아직 차갑다.'], vars: { '--bg': '#ECEBE7' } }
      ]
    }
  },

  config: { bgm: 'assets/music/main.mp3' },          // Closed Door, Open Ledger

  characters: {
    char1: {
      num: 'FILE No. 1103',
      name: '권세율',
      nameEn: 'Kwon Seyul',
      age: 31,
      birth: '3월 31일',
      mbti: 'ISTJ',
      nationality: '대한민국',
      height: '170cm',
      tags: ['#경멸', '#혐관', '#철벽', '#무뚝뚝', '#독설', '#갑을관계'],
      bio: '관할 세무서 조사과 국세조사관. 조사 기간 20일, 당신 회사의 회의실 하나를 차지했다. 끝까지 존댓말이고, 화가 날수록 더 정중해진다. 조사 대상에게는 커피 한 잔도 받지 않는다.',
      extras: [
        ['직업', '국세조사관 · 조사과'],
        ['조사 기간', '20일 (연장 가능)'],
        ['말버릇', '"확인하겠습니다."'],
        ['버릇', '의심이 들면 서류를 맨 뒷장부터'],
        ['좋아하는 것', '맞아떨어지는 숫자, 식은 보리차'],
        ['싫어하는 것', '숫자로 하는 거짓말']
      ],
      tmi: [
        { q: '점심은 어디서 먹어요?', a: '회의실에서 혼자. 조사 대상 회사 근처 식당엔 가지 않는다. 영수증이 남으니까.' },
        { q: '웃은 적은 있어요?', a: '있다. 숫자가 끝자리까지 맞아떨어질 때. 사람한테는, 아직.' },
        { q: '코트는 왜 안 벗어요?', a: '벗으면 오래 있을 사람처럼 보여서. 20일이 지나면 떠날 사람이니까.' },
        { q: '주말엔 뭐 해요?', a: '세무서 근처 도서관에서 판례를 읽는다. 커피는 거기서만 마신다. 계산은 늘 자기가 한다.' }
      ],
      story: [
        '아버지는 작은 금형 공장을 했다. 기계 소리가 멈추지 않는 집이었다. 장부는 오래 알고 지낸 사람에게 맡겼다. 아버지는 숫자를 몰랐고, 그 사람을 믿었다.',
        '고등학교 2학년 겨울, 공장 문에 종이가 붙었다. 아버지는 끝까지 그 사람을 탓하지 않았다. "내가 장부를 안 본 탓이지." 그날부터 그녀는 숫자를 봤다. 한 줄도 빼놓지 않고.',
        '스물다섯, 국세조사관이 됐다. 숫자를 틀리는 사람은 많았다. 그건 괜찮았다. 견딜 수 없는 건 숫자로 거짓말하는 사람, 그리고 그 거짓말을 덮어쓰는 정직한 사람이었다.',
        '올해 조사 목록에서 당신의 회사를 봤다. 장부 한 귀퉁이에서 낯익은 모양의 숫자가 새고 있었다. 그녀는 그날 오후 담당자 칸에 자기 이름을 적었다. 이유는 쓰지 않았다.'
      ],
      items: [
        { title: '스테인리스 텀블러', icon: 'TEA', desc: '식은 보리차. 데우지 않는다. 데우면 오래 머물게 되니까.' },
        { title: '12자리 계산기', icon: '=', desc: '엑셀이 틀릴 리 없다. 그래도 한 번 더, 손으로.' },
        { title: '파란 인덱스 플래그', icon: 'FLAG', desc: '붙은 데는 확인 끝, 빈 데는 아직. 당신 장부엔 빈 데가 많다.' },
        { title: '접이식 우산', icon: 'RAIN', desc: '비 오는 퇴근길은 일정에 넣지 않는다. 그래서 늘 들고 다닌다.' }
      ],
      themeTitle: 'Unfinished Correspondence',
      music: 'assets/music/theme.mp3',
      portrait: 'assets/portrait.webp',
      booth: ['assets/booth/char1_1.webp', 'assets/booth/char1_2.webp'],   // 인생 두컷 1컷 원칙 · 2컷 옅은 미소
      crack: '',                                      // 크랙 공개 후 주소를 넣어요
      gallery: [
        { img: 'assets/gallery/g01_cold.webp', label: '확인하겠습니다', desc: '조사 1일차 아침. 인사보다 자료 목록이 먼저였다.' },
        { img: 'assets/gallery/g02_window.webp', label: '창을 등지고', desc: '빛을 등진 자리. 얼굴보다 서류가 먼저 보이게 앉는다.' },
        { img: 'assets/gallery/g03_suspicion.webp', label: '맨 뒷장부터', desc: '숫자가 안 맞으면, 서류는 거꾸로 넘어간다.' },
        { img: 'assets/gallery/g04_scorn.webp', label: '그건 대표님 사정이고요', desc: '탁자를 짚은 손. 변명은 증빙이 되지 못한다.' },
        { img: 'assets/gallery/g05_refusal.webp', label: '조사 대상한테는 안 받습니다', desc: '내민 커피는 책상 끝에서 식어 갔다. 그녀는 서류만 들어 보였다.' },
        { img: 'assets/gallery/g06_polite_anger.webp', label: '말씀 끝나셨어요?', desc: '화가 날수록 존댓말이 더 깍듯해진다.' },
        { img: 'assets/gallery/g07_firm.webp', label: '다음 자료요', desc: '복도 끝에서 서류철을 안고 오는 걸음. 오늘 목록은 세 장.' },
        { img: 'assets/gallery/g09_tablet.webp', label: '보류', desc: '오늘의 판정. 믿지도, 버리지도 않는다.' },
        { img: 'assets/gallery/g10_hallway_tablet.webp', label: '복도에서', desc: '회의실 밖에서는 말이 조금 짧아진다.' },
        { img: 'assets/gallery/g11_hallway.webp', label: '문은 닫아 주세요', desc: '들어올 땐 노크. 나갈 땐 조용히.' },
        { img: 'assets/gallery/g12_hallway_far.webp', label: '20일', desc: '길다고 생각하면 길고, 짧다고 생각하면 짧다.' },
        { img: 'assets/gallery/g13_protect.webp', label: '제 조사 대상이에요', desc: '그날 복도에서, 그녀가 먼저 앞을 막아섰다.' },
        { img: 'assets/gallery/g14_angry_b.webp', label: '숫자로 거짓말하지 마세요', desc: '틀린 숫자는 고치면 된다. 거짓말한 숫자는 다르다.' },
        { img: 'assets/gallery/g15_angry.webp', label: '증빙은 여기 있습니다', desc: '그 사람 앞에 서류를 내려놓는 소리가, 회의실을 울렸다.' },
        { img: 'assets/gallery/g16_flustered.webp', label: '…업무와 무관한 질문이네요', desc: '귀부터 붉어졌다. 대답은 끝내 하지 않았다.' },
        { img: 'assets/gallery/g17_shaken.webp', label: '머리, 넘긴 거예요', desc: '흔들린 게 아니라.' },
        { img: 'assets/gallery/g18_shaken_b.webp', label: '잠깐만요', desc: '책상에 기댄 팔. 서류가 한 장, 넘어가지 않는다.' },
        { img: 'assets/gallery/g19_laugh_hold.webp', label: '웃은 거 아니에요', desc: '서류 한 장이 입을 가렸다. 눈까지는 못 가렸다.' },
        { img: 'assets/gallery/g20_laugh_hold_b.webp', label: '기침이에요', desc: '두 번째 변명은 첫 번째보다 약하다.' },
        { img: 'assets/gallery/g21_faint.webp', label: '오늘은 인정', desc: "판정 칸에 처음으로 '인정'이 적힌 날." },
        { img: 'assets/gallery/g22_reading_smile.webp', label: '이 숫자는 맞네요', desc: '서류를 넘기던 손이 멈췄다. 입꼬리는 먼저 알았다.' },
        { img: 'assets/gallery/g23_lean.webp', label: '그래서요?', desc: '몸을 기울이면 거리가 가까워진다. 그녀는 그걸 모르는 척한다.' },
        { img: 'assets/gallery/g24_tired.webp', label: '야근', desc: '회의실 불은 9시에 꺼진다. 오늘은 11시였다.' },
        { img: 'assets/gallery/g25_evening.webp', label: '퇴근 안 하세요?', desc: '저녁 햇빛이 서류 위로 길게 누웠다.' },
        { img: 'assets/gallery/g26_chin.webp', label: '생각 중이에요', desc: '턱을 괸 손. 질문은 아직 정리되지 않았다.' },
        { img: 'assets/gallery/g27_thinking.webp', label: '창가', desc: '아버지의 공장에도 이런 창이 있었다.' },
        { img: 'assets/gallery/g28_cold_a.webp', label: '대표님', desc: '이름 대신 직함. 거리를 재는 가장 쉬운 방법.' },
        { img: 'assets/gallery/g29_cold_b.webp', label: '규정이에요', desc: '조사 대상과 사적으로 얽히면, 이 조사에서 빠져야 한다.' },
        { img: 'assets/gallery/g30_cold_d.webp', label: '네, 듣고 있어요', desc: '듣는 얼굴과 믿는 얼굴은 다르다.' },
        { img: 'assets/gallery/g31_cold_e.webp', label: '오늘 요청 자료', desc: '목록은 늘 짧고, 마감은 늘 내일 아침.' },
        { img: 'assets/gallery/g32_surprised.webp', label: '…방금, 뭐라고 하셨어요?', desc: '처음 듣는 대답에 펜 대신 숨이 멈췄다.' },
        { img: 'assets/gallery/g33_rain.webp', label: '비 오는 퇴근길', desc: '우산은 하나. 일정에 없던 비.' },
        { img: 'assets/gallery/g34_rain_b.webp', label: '혼자 가요', desc: '세무서까지 버스 두 정거장. 걸어가는 게 더 빠르다고 했다.' },
        { img: 'assets/gallery/g35_worry.webp', label: '젖었잖아요', desc: '손수건을 내민 손이 조금 늦게 거둬졌다.' },
        { img: 'assets/gallery/g36_sad.webp', label: '비상계단', desc: '장부를 믿었던 사람이 있었다. 그 사람이 망한 걸 봤다.' },
        { img: 'assets/gallery/g37_laugh.webp', label: '…진짜, 못 말리겠네요', desc: '20일 중 처음, 소리 내서 웃었다.' },
        { img: 'assets/gallery/g38_laugh_b.webp', label: '증빙 없는 농담', desc: '인정할 수밖에 없었다.' },
        { img: 'assets/gallery/g39_flutter.webp', label: '가까워요', desc: '엘리베이터 안, 한 걸음이 남았다.' },
        { img: 'assets/gallery/g40_relief.webp', label: '조사 종결', desc: '회의실 문을 닫고, 그녀가 숨을 내쉬었다.' },
        { img: 'assets/gallery/g41_relief_b.webp', label: '끝났네요', desc: '가슴에 얹은 손. 다음 말은 조사관이 아닌 채로.' },
        { img: 'assets/gallery/g42_apology.webp', label: '제가 틀렸습니다', desc: '숫자가 아니라, 사람을 잘못 읽었다고 했다.' },
        { img: 'assets/gallery/g43_tuck.webp', label: '부인합니다', desc: '대표님 말도요.' },
        { img: 'assets/gallery/g44_tuck_b.webp', label: '증빙 없는 건', desc: '다 부인합니다.' },
        { img: 'assets/gallery/g45_tuck_c.webp', label: '소명하세요', desc: '시간은 충분해요. 20일이니까.' },
        { img: 'assets/secret_coffee.webp', label: '받은 날', desc: '처음으로, 커피를 두 손으로 받아 들었다.', secret: true }
      ]
    }
  },

  ticker: [
    '제3회의실. 오늘도 사용 중.',
    '텀블러 안에는 식은 보리차.',
    '"확인하겠습니다." 오늘만 네 번째.',
    '서류가 맨 뒷장부터 넘어간다.',
    '커피는 책상 끝에서 식어 간다.',
    '20일. 길다고 생각하면 길다.',
    '코트는 오늘도 의자 위가 아니라 그녀 어깨 위에.',
    '판정: 보류. 이유: 증빙 없음.',
    '3월 31일, 마감일에 태어난 사람.',
    '회의실 불은 9시에 꺼진다. 보통은.',
    '숫자를 틀리는 건 괜찮다. 거짓말이 문제다.',
    '노크 소리. 서류 넘기는 소리가 잠깐 멈춘다.'
  ]
};
