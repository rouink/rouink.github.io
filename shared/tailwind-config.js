// Tailwind 글꼴 설정 (공통)
tailwind.config = { theme: { extend: { fontFamily: {
  display: ['"Cinzel Decorative"', '"Song Myung"', 'serif'], // 화려한 큰 제목: 영문 Cinzel Decorative + 한글 송명
  serif: ['"Cinzel"', '"Song Myung"', 'serif'],      // 작은 제목: 영문 Cinzel + 한글 송명
  text: ['"Gowun Batang"', 'serif'],                 // 본문: 한글·영문 고운바탕
  mono: ['"Cinzel"', '"Gowun Batang"', 'serif'],     // 작은 라벨
  sans: ['Pretendard', 'sans-serif'] } } } }
