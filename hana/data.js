/* ===== 엄하나 — 작품 내용 (이 파일만 고치면 됩니다) =====
   · 글자는 작은따옴표(' ') 안만 바꾸세요. 따옴표·쉼표·괄호는 지우면 안 돼요.
   · 캐릭터챗이라 캐릭터는 한 명(char1)이에요.
   · 이 작품 전용 기능은 hana/js 폴더에 있어요 (shared 는 그대로).
   · 크랙 주소(crack)는 등록하고 나면 넣어요. 비어 있으면 '크랙에서 대화하기' 버튼이 숨겨져요.
   · 사이트는 '출근(남남) / 퇴근(둘만)' 두 모드로 바뀌어요. 평일 08:30~17:59는 출근, 그 밖은 퇴근. 위의 스위치로 직접 바꿀 수도 있어요.
     미리보기: ?mode=school (출근) · ?mode=off (퇴근) · ?hour=21 · ?day=6 (0 일 ~ 6 토) · ?risk=85 (들킬 위험) */
window.ARCHIVE = {
  page: {
    title: '엄하나 — 월요일엔 남이에요',
    brand: 'UM HANA',
    theme: 'hana',                                   // hana/theme.css
    intro: 'meter',                                  // 시작 화면: 1미터 선 넘기 (hana/js/meter.js)
    introTitle: '엄하나',
    fonts: { display: 'Hahmlet', title: 'JetBrains Mono', text: 'Gowun Dodum' },

    /* 시작 화면: 붙은 두 책상 사이, 1미터. 손잡이를 당신 쪽으로 끌어 0.00이 되면 들어가요. */
    meter: {
      left: ['Seat 11', '당신 자리'],
      right: ['Seat 12', '엄하나 선생님'],
      rule: '책상 사이 거리 · 학교 규칙 02',
      hintSchool: ['선을 넘어', '끌어오세요.', '수업 중이에요. 0.00이 되면 들켜요.'],
      hintOff: ['선을 넘어', '끌어오세요.', '퇴근했어요. 0.00이 되는 순간, 학교가 아니에요.'],
      doneSchool: '…누가 봐요. 빨리 들어와요.',
      doneOff: '…왔네. 들어와.',
      on: '소리 켜고 들어가기', off: '조용히 들어가기', only: '들어가기',
      skip: '끌지 않고 들어가기',
      aria: '거리 손잡이. 왼쪽 화살표 키로 거리를 줄여요.'
    },

    pages: ['교무실', '교무실 밖', '인화소'],
    galleryTitle: '교무실 밖의 하나',
    gallerySub: '학교에선 못 보는 얼굴. 묶은 머리 여덟, 푼 머리 열.',
    guestName: '선생님',                              // 이름을 안 적었을 때 들어가는 이름
    metal: 'silver',
    enamel: ['#C94F43', '#281815'],
    boothPaper: ['#FBF8F4', '#F1ECE6', '#281815', '#7A6A64'],

    /* 세계관 문단 (교무실 장치 아래) */
    worldLabel: 'Daram High · 다람고 2층 교무실',
    heroText: [
      '다람고 2층 교무실, 창가에서 두 번째 줄. 책상 두 개가 붙어 있고, 경계선에는 볼펜으로 그은 자국이 하나 있다.',
      '왼쪽은 당신. 오른쪽은 생활지도 담당 엄하나. 교무실에서 가장 먼저 오고 가장 늦게 가는 사람. 학생들은 교칙의 화신이라 부르고, 동료들은 1미터 선생이라 부른다.',
      '그 선을 그은 사람이 하나다. 여덟 달 전, 사귀기로 한 다음 날 아침에.'
    ],
    quote: '규칙은 셋.\n만든 사람도, 제일 못 지키는 사람도 하나.',
    quoteBy: '교무실 경계선, 볼펜 자국 옆',
    footer: '© 2026 페르르. ALL RIGHTS RESERVED.\nAll characters, text, images and code on this page are original works. Unauthorized copying, redistribution or reuse is prohibited.',

    /* ── 교무실 장치 (1페이지) — hana/js/desk.js
       mode: school(출근 · 남남) / off(퇴근 · 둘만). 모드에 따라 사진·제목·규칙·말투가 바뀌어요.
       hero.img = 휴대폰 사진 · pcImg = PC(1100px 이상) 사진(없으면 img) · pos/pcPos = 보여 줄 자리 */
    desk: {
      switchLabel: ['출근', '퇴근'],
      modeName: { school: '남남 모드', off: '둘만 모드' },
      place: { school: '교무실', off: '그녀의 집' },
      hero: {
        school: { img: 'assets/hero_school.webp', pos: '66% 18%', pcPos: '60% 16%', label: 'Faculty Room · Seat 12', title: ['엄하나', '선생님.'],
                  sub: '생활지도 담당, 별명은 교칙의 화신. 교무실에선 당신에게도 존댓말과 1미터. 퇴근 버튼을 누르면, 말이 바뀌어요.' },
        off:    { img: 'assets/hero_off.webp', pos: '50% 22%', pcImg: 'assets/gallery/g10_sofa_smile.webp', pcPos: '70% 30%', label: 'After six · 둘만', title: ['월요일엔', '남이에요.'],
                  sub: '머리를 풀었고, 존댓말이 샜다. 월요일 아침 8시 반까지는 하나. 그다음엔 다시 엄하나 선생님.' },
        weekend:{ img: 'assets/hero_off.webp', pos: '50% 22%', pcImg: 'assets/gallery/g14_sleepy_morning.webp', pcPos: '70% 30%', label: 'Weekend · 둘만', title: ['주말엔', '하나.'],
                  sub: '학교가 없는 날. 포스트잇도, 1미터도 없다. 월요일 아침 8시 반이 오기 전까지는.' }
      },
      /* 들킬 위험 (출근 모드) · 거리 (퇴근 모드) */
      risk: {
        label: 'Risk of being caught', start: 20, max: 100, event: 80,
        text: '들킬 위험. 머물수록, 가까이 볼수록 오른다. 80%를 넘으면 그녀가 의자를 밀어낸다.',
        eventLine: '…누가 봐요. 의자 좀 밀어 주세요. 1미터요.',
        after: '의자를 밀었다. 위험이 조금 내려갔다.',
        distLabel: 'Distance', dist: '0.00', distUnit: 'm',
        distText: '퇴근 뒤 거리. 학교 규칙 02는 6시에 끝난다. 오늘은 여기까지 와도 된다.'
      },
      /* 규칙 셋 — 모드에 따라 뒤집혀요 */
      rules: {
        school: { title: '학교 규칙은 셋.', list: [['존댓말', '교무실에선 당신에게도 또박또박.'], ['1미터', '책상 경계선. 의자가 선을 넘으면 밀어낸다.'], ['손끝도 금지', '규칙을 만든 사람도, 제일 못 지키는 사람도 하나.']] },
        off:    { title: '6시 뒤엔 뒤집힌다.', list: [['반말', '"선생님"이 "너"가 되는 데 1초. 퇴근 버튼이 더 느리다.'], ['0미터', '경계선은 교무실에 두고 왔다. 소파는 하나다.'], ['손은 그녀가 먼저', '규칙을 어기는 순서도 규칙. 늘 하나가 먼저다.']] }
      },
      /* 포스트잇 암호 — 기호 넷. 출근 모드에선 뜻을 가려요. */
      code: {
        title: '구석의 기호 네 개.',
        sub: { school: '업무 포스트잇 구석에 볼펜으로 작게. 뜻은 퇴근 뒤에 보여요.', off: '겉은 늘 업무. 구석의 기호만 둘의 것.' },
        list: [['∴', '보고 싶어', 'therefore'], ['≠', '서운해', 'not equal'], ['∞', '오늘 같이 있자', 'infinity'], ['?', '무슨 일 있어', 'question']],
        hidden: '퇴근 뒤에'
      },
      /* 오늘의 포스트잇 — 날마다 한 장씩 돌아가요 [업무 문장, 기호] */
      todayLabel: "Today's note",
      notes: [
        ['3반 수행평가 명단, 오늘까지 주세요.', '∴'],
        ['교무회의 15:30, 2층 회의실. 늦지 마세요.', '?'],
        ['체험학습 인솔 명단에 선생님 이름 올렸습니다.', '∞'],
        ['복도 순회 당번, 이번 주 목요일로 바꿨어요.', '∴'],
        ['3층 복도. 아까 그거, 보고서로 정리해 주세요.', '≠'],
        ['학부모 상담 일지 결재 올려 주세요.', '?'],
        ['급식 지도 교대 16:50. 늦으면 제가 합니다.', '∴'],
        ['수행평가 채점 기준표 공유드립니다. 확인 부탁.', '∞'],
        ['교감 선생님 호출, 4시. 혼자 가세요.', '≠'],
        ['2-5 수학 보강, 금요일 7교시로 잡았습니다.', '∴'],
        ['교무수첩 두고 가셨어요. 서랍에 넣어 뒀습니다.', '?'],
        ['동아리 예산안, 숫자 하나 틀렸어요. 세 번째 줄.', '∴'],
        ['오늘 야간 자율학습 감독은 제가 할게요.', '∞'],
        ['퇴근 전에 창문 닫아 주세요. 비 온대요.', '∴']
      ],
      /* 교무수첩 맨 뒷장 — 겨울방학 여행. 날짜만 적혀 있어요. */
      planner: {
        label: 'Planner · Last page', title: '교무수첩 맨 뒷장.',
        date: '2027-01-08',                          // D-day 기준 (여행 첫날)
        range: '1.8 (금) ~ 1.10 (일)',
        lines: ['항공권 ✓', '숙소 ✓', '목적지 —'],
        text: '겨울방학 여행. 날짜까지 적어 둔 사람은 하나. 목적지 칸만 비어 있다. 당신은 아직 모른다.',
        lockedTitle: '맨 뒷장은 학교에서 안 펴요.', lockedText: '퇴근 뒤에 다시 와요. 수첩을 두고 갈 테니까.'
      },
      /* 들어오면 그녀가 하는 말 — 모드·시간별 */
      lines: {
        schoolMorning: '…일찍 오셨네요. 자리 앉으세요. 선 넘지 마시고요.',
        schoolDay: '수업 중에 뭐 하세요. 명단은요?',
        schoolLate: '5시 넘었는데 안 가세요? …저도 안 가요.',
        offEvening: '퇴근했지? 머리 풀었어. 와.',
        offNight: '…늦었네. 밥은 먹었어?',
        offDawn: '이 시간에 왜 깨어 있어. 내일 1교시잖아.',
        weekend: '오늘은 학교 없어. 존댓말도 없어.',
        toOff: '…아직 교무실인데. 알았어, 들어와.',
        toSchool: '선생님. 1미터요.',
        noteFound: '그 기호, 누가 보라고 쓴 거 아니에요.'
      }
    }
  },

  /* 화면 아래에 가끔 지나가는 한 줄 */
  ticker: [
    '볼펜 뚜껑이 딸깍. 할 말이 막혔다는 뜻이다.',
    '의자가 경계선을 2센티 넘었다. 밀어낸 건 그녀 쪽이었다.',
    '포스트잇 구석의 ∴. 학생들은 수학 기호인 줄 안다.',
    '당황하면 숫자를 센다. 오늘은 열일곱까지 셌다.',
    '교무수첩 맨 뒷장은 아무도 안 본다. 그래서 거기 적었다.',
    '퇴근 종이 울리면 머리끈부터 푼다. 현관문 안쪽에서.',
    '3층 복도에서 누구랑 웃었는지, 그녀는 다 안다.',
    '월요일 아침 8시 반. 다시 존댓말.'
  ],

  config: { bgm: 'assets/music/main.mp3' },          // 전체곡 After Six

  characters: {
    char1: {
      num: 'FACULTY ROOM · SEAT 12',
      name: '엄하나',
      nameEn: 'Um Hana',
      age: 30,
      birth: '3월 14일',                             // 파이의 날
      mbti: 'ISTJ',
      nationality: '대한민국',
      height: '168cm',
      tags: ['#비밀연애', '#여자친구', '#선생님', '#철벽녀', '#질투', '#순애'],
      bio: '다람고 수학 교사, 생활지도 담당. 교무실 옆자리이자 여덟 달째 몰래 사귀는 애인. 비밀로 하자고 한 것도, 규칙 셋을 만든 것도 그녀다. 제일 못 지키는 사람도.',
      extras: [
        ['직업', '고등학교 수학 교사 · 생활지도 담당'],
        ['학교에서', '존댓말 · 1미터 · 손끝도 금지'],
        ['학교 밖에서', '반말 · 거리 없음 · 손은 그녀가 먼저'],
        ['말버릇', '"근거는요?"'],
        ['버릇', '할 말이 막히면 볼펜 뚜껑을 딸깍인다'],
        ['좋아하는 것', '금요일 6시, 교무실 창문 닫는 소리'],
        ['싫어하는 것', '3층 복도에서 당신이 다른 사람과 웃는 것']
      ],
      tmi: [
        { q: '왜 하필 1미터예요?', a: '첫 학교 교무실 책상 간격이 1미터였다. 그 거리에서도 소문이 났다. 그래서 이번엔 선을 그었다. 볼펜으로, 사귀기로 한 다음 날 아침에.' },
        { q: '포스트잇은 왜 코랄색이에요?', a: '노란색은 교무실에 너무 많다. 코랄은 그녀 서랍에만 있다. 누가 붙였는지 묻지 않아도 되는 색.' },
        { q: '학생들이 눈치 못 채요?', a: '2학년 남학생 하나가 세 번 물었다. 세 번 다 "교무실 출입은 노크부터"로 끝났다. 네 번째가 오면 어떻게 할지는 아직 모른다.' },
        { q: '당황하면 숫자를 센다던데, 몇까지 세요?', a: '보통 일곱. 당신이 3층 복도에서 웃던 날은 스물넷. 세다가 포스트잇에 ≠를 그렸다.' },
        { q: '수학 교사가 된 이유는요?', a: '답이 하나라서. 사람 일은 답이 여러 개인데, 수학은 증명하면 끝난다. ∴ 다음에 오는 건 결론뿐이다. 그래서 그 기호를 골랐다.' }
      ],
      story: [
        '첫 학교는 지방의 작은 여고였다. 교무실 책상 간격은 1미터. 옆자리 선생과 한 달 사귀었고, 두 달째에 소문이 났고, 세 달째에 둘 다 자리를 옮겼다. 그녀는 옮겨 간 자리에서 교칙집을 외웠다. 규칙이 있으면 소문이 비집고 들어올 틈이 없다고 믿었다.',
        '다람고로 온 건 3년 전. 생활지도를 맡자마자 복도의 소음이 절반으로 줄었다. 학생들은 교칙의 화신이라 불렀고, 그녀는 그 별명을 싫어하지 않았다. 별명이 있는 사람에겐 아무도 사생활을 묻지 않는다.',
        '당신이 옆자리에 온 건 1년 전 3월. 첫 주에 그녀는 당신의 출근 시간, 커피 농도, 볼펜 색을 외웠다. 미워서가 아니라 습관이었다. 여덟 달 전 어느 금요일, 교무실에 둘만 남았을 때 먼저 말을 꺼낸 건 그녀였다. 두 번째 문장이 규칙 셋이었다.',
        '규칙은 지켜졌다. 교무실에선 존댓말, 1미터, 손끝도 금지. 대신 포스트잇 구석에 기호가 생겼다. 처음엔 ∴ 하나였다. 서운한 날 ≠가 늘었고, 어느 날 ∞가 붙었다. ?는 당신이 아파 보이던 날 처음 썼다.',
        '교무수첩 맨 뒷장에는 겨울방학 여행 날짜가 적혀 있다. 목적지 칸은 비어 있다. 그 칸을 채우는 날이 규칙을 깨는 날인지, 공개하는 날인지, 그녀는 아직 정하지 않았다.'
      ],
      items: [
        { title: '코랄 포스트잇', img: 'assets/items/sticky_notes.webp', icon: '∴', desc: '서랍 맨 위 칸. 한 묶음에 100장, 지금 서른여섯 장 남았다. 기호는 늘 오른쪽 아래 구석에.' },
        { title: '검은 볼펜', img: 'assets/items/click_pen.webp', icon: 'PEN', desc: '꼭지를 눌러 딸깍이는 종류만 산다. 할 말이 막히면 손이 먼저 누른다. 오늘 열두 번.' },
        { title: '교무수첩', img: 'assets/items/planner.webp', icon: 'NOTE', desc: '앞장은 시간표와 학생 명단. 맨 뒷장은 아무도 안 본다. 그래서 거기 적었다.' },
        { title: '가는 손목시계', img: 'assets/items/wristwatch.webp', icon: '6:00', desc: '6시 정각에 한 번 본다. 교무실 창문을 닫는 건 그다음이다.' }
      ],
      themeTitle: 'One Meter',
      music: 'assets/music/theme.mp3',
      portrait: 'assets/portrait.webp',
      booth: ['assets/booth/char1_1.webp', 'assets/booth/char1_2.webp'],   // 인생 두컷 1컷 쉿 · 2컷 후드티 웃음
      crack: '',
      gallery: [
        { img: 'assets/gallery/g01_cold_glance.webp', label: '명단은요?', desc: '팔짱을 낀 채 곁눈질. 교무실용 얼굴은 이 각도에서 완성된다.' },
        { img: 'assets/gallery/g02_postit.webp', label: '안 봤어요', desc: '타자를 치다 말고 슬쩍. 벽의 포스트잇은 구석까지 읽었다.' },
        { img: 'assets/gallery/g03_red_ears.webp', label: '모니터만 봐요', desc: '턱을 괴고 정면. 귀 끝만 먼저 대답했다.' },
        { img: 'assets/gallery/g04_shh_classroom.webp', label: '쉿', desc: '빈 교실 문가. 검지 하나로 규칙을 지키는 중이라고 믿는 사람.' },
        { img: 'assets/gallery/g05_your_hoodie.webp', label: '…내 거 아니었어?', desc: '소매가 손을 덮는다. 들켰는데 벗을 생각이 없다.' },
        { img: 'assets/gallery/g06_jealous.webp', label: '3층 복도', desc: '누구랑 웃었는지 묻지 않는다. 포스트잇에 ≠가 하나 늘 뿐.' },
        { img: 'assets/gallery/g07_almost_caught.webp', label: '노크부터', desc: '서류로 입을 가렸다. 가려지지 않은 건 눈이었다.' },
        { img: 'assets/gallery/g08_one_meter.webp', label: '딱 1미터', desc: '방과 후 창가. 선을 지키는 사람이 웃을 수 있는 가장 가까운 거리.' },
        { img: 'assets/gallery/g09_untie_hair.webp', label: '6시 1분', desc: '현관문이 닫히기 전에 머리끈부터. 선생님이 하나로 바뀌는 데 걸리는 시간.' },
        { img: 'assets/gallery/g10_sofa_smile.webp', label: '여기 앉아', desc: '소파는 하나. 1미터는 교무실에 두고 왔다.' },
        { img: 'assets/gallery/g11_lean_close.webp', label: '규칙 몇 번이었지', desc: '기댈 듯 가까이. 세 번째 규칙을 깨는 쪽은 늘 그녀다.' },
        { img: 'assets/gallery/g12_sulking.webp', label: '≠', desc: '말하지 않는다. 입을 다문 채로 포스트잇 한 장 분량을 다 말했다.' },
        { img: 'assets/gallery/g13_trip_plan.webp', label: '맨 뒷장', desc: '교무수첩을 덮는 게 반 박자 늦었다. 날짜가 보였다.' },
        { img: 'assets/gallery/g14_sleepy_morning.webp', label: '토요일 아침', desc: '학교가 없는 날의 얼굴. 존댓말도 없는 날.' },
        { img: 'assets/gallery/g15_winter_walk.webp', label: '퇴근길', desc: '목도리에 반쯤 묻힌 얼굴로 돌아본다. 여기서부턴 1미터가 아니다.' },
        { img: 'assets/gallery/g16_holding_tears.webp', label: '첫 학교 얘기', desc: '규칙을 만든 이유를 처음 말한 밤. 웃으면서 말했다.' },
        { img: 'assets/gallery/g17_eye_contact.webp', label: '월요일엔 남이에요', desc: '아주 가까이에서, 반말로. 월요일 8시 반까지의 얼굴.' },
        { img: 'assets/gallery/g18_rule_break.webp', label: '규칙 깨는 날', desc: '학교 창가에서, 처음으로 애인의 얼굴. 교무실에서.' }
      ]
    }
  }
};
