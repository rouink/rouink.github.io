/* ===== 이이레 — 작품 내용 (이 파일만 고치면 됩니다) =====
   · 글자는 작은따옴표(' ') 안만 바꾸세요. 따옴표·쉼표·괄호는 지우면 안 돼요.
   · 캐릭터챗이라 캐릭터는 한 명(char1)이에요. 늘리려면 char1 블록을 복사해 char2로 이름만 바꿔 붙이세요(앞 블록 끝에 쉼표 필요). */
window.ARCHIVE = {
  page: {
    intro: 'psalter',                                 // 시작 화면 효과 이름 (shared/intro-list.txt 참고) · 미리보기: 주소 뒤에 ?intro=이름
    fonts: {},                                       // 글꼴: { display:'학교안심 붓펜', text:'학교안심 산뜻바탕' } · 목록은 shared/font-list.txt
    theme: 'lavender',                           // 색 테마: cream · blue · rose · sage · lavender · mono
    pages: ['기록', '갤러리', '제작소'],          // 하단 메뉴 바의 페이지 이름 (I · II · III)
    galleryTitle: '이이레 갤러리',                  // 페이지 II 제목
    gallerySub: '크랙에 반영된 이미지 입니다.',
    brand: '이이레',                             // 작품명: 상단 로고·주화·포토카드·인생 두컷 프레임의 'PROJECT ARCHIVE' 자리에 들어가요
    title: '이이레',                              // 브라우저 탭 제목
    heroImage: 'assets/hero.jpg',               // 표지 사진 (비우면 글자만)
    heroVideo: 'assets/hero.mp4',              // 움직이는 표지 영상 · 소리 없이 반복 재생, 비우면 사진만
    heroPosition: '40% 30%',                    // 표지 사진에서 보여 줄 위치 (가로% 세로%)
    heroCaption: '처형식 가는 길',             // 표지 사진 설명 (오른쪽 아래 작은 글씨)
    heroLabel: 'Chapter I',
    heroTitle: '이이레',                          // 첫 화면 큰 제목
    heroSub: 'The Saint Who Was Kept',          // 큰 제목 아래 영문 부제 (비우면 숨김)
    worldLabel: 'Ⅰ · The World',
    quote: '……또 내 추락을 구경하러 온 건가요? 차라리 당장 나를 죽여요.',                                  // 인상적인 대사 한 줄 (비우면 숨김)
    quoteBy: 'Iire',
    heroText: [                                 // 세계관 소개글 (한 줄씩)
      '제국의 찬란한 빛이었던 성녀, 이이레.',
      '이단자로 찍혀 감옥에 갇힌 후 자애를 잃었다',
      '기도는 이제 그들의 것. 성녀의 기도는 당신만을 향한다'
    ],
    footer: '© 2026 페르르. ALL RIGHTS RESERVED.\nAll designs, code, images and text on this site are protected by copyright. Any unauthorized copying, distribution or reuse is strictly prohibited.'   // 맨 아래 저작권 고지 (\n = 줄바꿈)
  },
  config: {
    bgm: 'assets/music/main.mp3'                // 메인 음악 (첫 화면~스크롤)
  },
  ticker: [                                     // 화면 곳곳에 5초마다 랜덤으로 뜨는 문장 (몇 개든 가능)
    '이이레가 당신을 바라봅니다.',
    '이이레가 고통에 울부짖습니다.',
    '교단이 당신을 주시합니다.',
    '제국의 기사가 당신을 의심합니다.',
    '교황이 비웃음을 흘립니다.',
    '목격자가 오늘 사라집니다.',
    '성스러운 빛이 제국에서 사라집니다.',
    '이이레가 당신에게 간절한 눈빛을 보냅니다.',
    '이이레가 절망에 신음합니다.',
    '성직자들이 숨어서 다음 희생자를 고릅니다.'
  ],
  characters: {
  char1: {
    num:'FILE 01',
    name:'이이레',                 // 한글 이름 — 여기 한 곳만 고치면 카드·팝업·인생 2컷에 모두 반영돼요
    nameEn:'IIRE',               // 영문 이름
    tags:['성녀', '감금', '애증'],
    bio:'자애롭고 희생정신 투철한, 모두의 성녀였다. 감금과 고립 속에서 오직 당신에게만 애증과 의존을 쏟아 내기 시작한다. 은발에 가까운 백금발, 투명할 정도로 하얀 피부, 처연한 자줏빛 눈동자. 몸을 옥죄는 단정한 성복은 감금 이후 해지고 흐트러졌다.',
    birth:'685년 1월 5일', age:22,    // 나이는 작품 속 기준으로 직접 적기
    mbti:'INFJ', enneagram: '1w2', nationality:'제국', height:'167cm',
    extras:[['혈액형', 'A'], ['직업', '제국 교단의 성녀'], ['취미', '성서 읽기'], ['말버릇', '...나를 죽여요']],
    tmi:[
      { q:'TMI 1', a:'성녀가 되기 전에는, 제국 외곽 시골에서 부모님과 함께 살았다.' },
      { q:'TMI 2', a:'사탕을 좋아했지만, 먹다 목에 걸릴뻔한 일 이후로는 먹지 않는다.' }
    ],
    story:[
      '열 살 무렵, 마을 우물가에서 처음으로 기도를 올렸다. 그날 밤 말라 있던 우물에 물이 차올랐고, 사흘 뒤 교단의 마차가 그녀를 데리러 왔다. 그 뒤로 부모님의 얼굴을 본 날은 손에 꼽을 만큼이다.',
      '열두 해 동안 제국의 성녀로 살았다. 그러다 신탁이 교황의 뜻과 다른 말을 하기 시작한 날, 그녀는 이단이 되었다. 그 신탁이 무엇이었는지는 아무도 묻지 않았다.'
    ],
    items:[
      { img:'assets/items/bible.webp', title:'낡은 성서', desc:'손때로 닳은 유일한 위로. 감옥에서도 이것만은 빼앗기지 않았다.' },
      { img:'assets/items/candy.webp', title:'빈 사탕 깡통', desc:'사탕은 더 이상 먹지 않지만, 깡통은 버리지 못했다. 안에는 말린 꽃잎 몇 장.' }
    ],
    gallery:[                                   // 페이지 II 표정·상황 갤러리 (가로 4:3 · img: 파일 경로, label: 화면에 나오는 이름, desc: 짧은 설명(비워도 됨), secret:true 를 붙이면 흐리게 가려져요)
      { img:'assets/gallery/iire_01_contempt.webp', label:'경멸', desc:'' },
      { img:'assets/gallery/iire_02_longing.webp', label:'그리움', desc:'' },
      { img:'assets/gallery/iire_03_prayer.webp', label:'기도', desc:'' },
      { img:'assets/gallery/iire_04_default.webp', label:'기본', desc:'' },
      { img:'assets/gallery/iire_05_fear.webp', label:'두려움', desc:'' },
      { img:'assets/gallery/iire_06_helpless.webp', label:'막막함', desc:'' },
      { img:'assets/gallery/iire_07_smile.webp', label:'미소', desc:'' },
      { img:'assets/gallery/iire_08_sorrow.webp', label:'슬픔', desc:'' },
      { img:'assets/gallery/iire_09_oracle.webp', label:'신과소통', desc:'' },
      { img:'assets/gallery/iire_10_tearful.webp', label:'울먹임', desc:'' },
      { img:'assets/gallery/iire_11_execution.webp', label:'처형식', desc:'' },
      { img:'assets/gallery/iire_12_resignation.webp', label:'체념', desc:'' }
      // 더 넣으려면 위 줄 끝에 쉼표(,)를 찍고 같은 모양으로 한 줄씩 추가
    ],
    themeTitle:'이이레 테마',
    video:'assets/hero.mp4', poster:'assets/hero.jpg',                                  // 영상(.mp4) 주소, 비워 두면 Video coming soon
    music:'assets/music/char1.mp3',                      // 팝업에서 나오는 캐릭터 음악
    booth:['assets/booth/char1_1.png', 'assets/booth/char1_2.png'],  // 인생 두컷용 배경 투명 PNG (1컷, 2컷)
    crack:'https://crack.wrtn.ai/characters/6acb14cda305f4d2da554073/detail'   // '크랙에서 대화하기' 버튼 주소
  }
  }
};
