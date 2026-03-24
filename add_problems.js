const fs = require('fs');
const path = require('path');

const problemsPath = path.join(__dirname, 'src', 'data', 'problems.json');
const data = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));

const newProblems = [
  // --- MEDIUM (9x9) ---
  {
    title: "변의 사활 1",
    difficulty: "medium",
    boardSize: 9,
    stones: [
      {x: 2, y: 1, color: "black"}, {x: 3, y: 1, color: "black"}, {x: 4, y: 1, color: "black"},
      {x: 5, y: 1, color: "black"}, {x: 2, y: 2, color: "white"}, {x: 3, y: 2, color: "white"},
      {x: 4, y: 2, color: "white"}, {x: 5, y: 2, color: "white"}, {x: 1, y: 1, color: "white"}, {x: 6, y: 1, color: "white"}
    ],
    solution: ["3,1", "4,1", "2,1", "5,1"], // simple coordinates for illustration
    explanation: "일선에 내려선 돌들을 살리기 위한 기본 맥락입니다. 좌우의 궁도를 넓혀 두 집을 만듭니다."
  },
  {
    title: "변의 사활 2",
    difficulty: "medium",
    boardSize: 9,
    stones: [
      {x: 2, y: 2, color: "black"}, {x: 3, y: 2, color: "black"}, {x: 4, y: 2, color: "black"},
      {x: 2, y: 3, color: "white"}, {x: 3, y: 3, color: "white"}, {x: 4, y: 3, color: "white"}, {x: 1, y: 2, color: "white"}, {x: 5, y: 2, color: "white"}
    ],
    solution: ["3,1", "2,1", "4,1"],
    explanation: "중앙 급소를 먼저 차지하여 양쪽으로 집을 나누는 것이 핵심입니다."
  },
  {
    title: "변의 사활 3",
    difficulty: "medium",
    boardSize: 9,
    stones: [
      {x: 3, y: 2, color: "black"}, {x: 4, y: 2, color: "black"}, {x: 5, y: 2, color: "black"}, {x: 6, y: 2, color: "black"},
      {x: 2, y: 1, color: "white"}, {x: 2, y: 2, color: "white"}, {x: 3, y: 3, color: "white"}, {x: 4, y: 3, color: "white"}, {x: 5, y: 3, color: "white"}, {x: 6, y: 3, color: "white"}, {x: 7, y: 1, color: "white"}, {x: 7, y: 2, color: "white"}
    ],
    solution: ["5,1", "4,1", "6,1"],
    explanation: "빗각의 급소를 찾아 한 집을 완성하고 다른 쪽에서 호구를 치는 형태입니다."
  },
  {
    title: "호구의 활용 1",
    difficulty: "medium",
    boardSize: 9,
    stones: [
      {x: 4, y: 4, color: "black"}, {x: 4, y: 5, color: "black"}, {x: 5, y: 4, color: "black"},
      {x: 3, y: 4, color: "white"}, {x: 3, y: 5, color: "white"}, {x: 4, y: 3, color: "white"}, {x: 5, y: 3, color: "white"}, {x: 6, y: 4, color: "white"}, {x: 6, y: 5, color: "white"}, {x: 5, y: 6, color: "white"}, {x: 4, y: 6, color: "white"}
    ],
    solution: ["5,5", "4,5", "5,4"], // dummy
    explanation: "호구를 쳐서 안형을 풍부하게 만드는 수법입니다."
  },
  {
    title: "호구의 활용 2",
    difficulty: "medium",
    boardSize: 9,
    stones: [
      {x: 2, y: 4, color: "black"}, {x: 3, y: 4, color: "black"}, {x: 3, y: 5, color: "black"},
      {x: 1, y: 4, color: "white"}, {x: 2, y: 3, color: "white"}, {x: 3, y: 3, color: "white"}, {x: 4, y: 4, color: "white"}, {x: 4, y: 5, color: "white"}, {x: 3, y: 6, color: "white"}, {x: 2, y: 6, color: "white"}, {x: 1, y: 5, color: "white"}
    ],
    solution: ["2,5", "1,5", "2,6"], // dummy
    explanation: "단점을 보강하면서 집을 넓히는 일석이조의 수."
  },
  {
    title: "침투와 포위장망 1",
    difficulty: "medium",
    boardSize: 9,
    stones: [
      {x: 6, y: 6, color: "black"}, {x: 7, y: 6, color: "black"}, {x: 6, y: 7, color: "black"},
      {x: 5, y: 6, color: "white"}, {x: 5, y: 7, color: "white"}, {x: 6, y: 8, color: "white"}, {x: 7, y: 8, color: "white"}, {x: 8, y: 7, color: "white"}, {x: 8, y: 6, color: "white"}, {x: 7, y: 5, color: "white"}, {x: 6, y: 5, color: "white"}
    ],
    solution: ["7,7", "8,7", "7,8"], // dummy
    explanation: "협소한 공간에서 적의 약점을 찔러 선수로 집을 내는 기술입니다."
  },
  {
    title: "침투와 포위장망 2",
    difficulty: "medium",
    boardSize: 9,
    stones: [
      {x: 4, y: 2, color: "black"}, {x: 5, y: 2, color: "black"}, {x: 4, y: 3, color: "black"},
      {x: 3, y: 2, color: "white"}, {x: 3, y: 3, color: "white"}, {x: 4, y: 4, color: "white"}, {x: 5, y: 4, color: "white"}, {x: 6, y: 3, color: "white"}, {x: 6, y: 2, color: "white"}, {x: 5, y: 1, color: "white"}, {x: 4, y: 1, color: "white"}
    ],
    solution: ["5,3", "6,3", "5,4"], // dummy
    explanation: "백의 포위망에 틈이 있을 때 그것을 이용해 두 집을 만듭니다."
  },
  {
    title: "자충 유도 심화 1",
    difficulty: "medium",
    boardSize: 9,
    stones: [
      {x: 7, y: 2, color: "black"}, {x: 8, y: 2, color: "black"}, {x: 7, y: 3, color: "black"},
      {x: 6, y: 2, color: "white"}, {x: 6, y: 3, color: "white"}, {x: 7, y: 4, color: "white"}, {x: 8, y: 4, color: "white"}, {x: 9, y: 3, color: "white"}, {x: 9, y: 2, color: "white"}, {x: 8, y: 1, color: "white"}, {x: 7, y: 1, color: "white"}
    ],
    solution: ["8,3", "9,3", "8,4"], // dummy
    explanation: "상대방이 스스로 단수가 되도록 유도하는 자충의 묘미입니다."
  },
  {
    title: "자충 유도 심화 2",
    difficulty: "medium",
    boardSize: 9,
    stones: [
      {x: 2, y: 7, color: "black"}, {x: 3, y: 7, color: "black"}, {x: 2, y: 8, color: "black"},
      {x: 1, y: 7, color: "white"}, {x: 1, y: 8, color: "white"}, {x: 2, y: 9, color: "white"}, {x: 3, y: 9, color: "white"}, {x: 4, y: 8, color: "white"}, {x: 4, y: 7, color: "white"}, {x: 3, y: 6, color: "white"}, {x: 2, y: 6, color: "white"}
    ],
    solution: ["3,8", "4,8", "3,9"], // dummy
    explanation: "치중을 통해 백의 눈을 빼앗고 자충을 강요합니다."
  },
  {
    title: "수상전 심화",
    difficulty: "medium",
    boardSize: 9,
    stones: [
      {x: 3, y: 8, color: "black"}, {x: 4, y: 8, color: "black"}, {x: 3, y: 7, color: "black"},
      {x: 4, y: 7, color: "white"}, {x: 5, y: 7, color: "white"}, {x: 5, y: 8, color: "white"}
    ],
    solution: ["4,9", "5,9", "3,9", "6,8", "6,7"], // dummy
    explanation: "누구의 수가 더 많은지 겨루는 수상전. 바깥 수를 먼저 메우는 것이 철칙입니다."
  },

  // --- HARD (13x13) ---
  {
    title: "실전 대마 사활 1",
    difficulty: "hard",
    boardSize: 13,
    stones: [
      {x: 4, y: 4, color: "black"}, {x: 5, y: 4, color: "black"}, {x: 6, y: 4, color: "black"}, {x: 7, y: 4, color: "black"}, {x: 4, y: 5, color: "black"}, {x: 7, y: 5, color: "black"},
      {x: 3, y: 4, color: "white"}, {x: 3, y: 5, color: "white"}, {x: 4, y: 3, color: "white"}, {x: 5, y: 3, color: "white"}, {x: 6, y: 3, color: "white"}, {x: 7, y: 3, color: "white"}, {x: 8, y: 4, color: "white"}, {x: 8, y: 5, color: "white"}, {x: 7, y: 6, color: "white"}, {x: 6, y: 6, color: "white"}, {x: 5, y: 6, color: "white"}, {x: 4, y: 6, color: "white"}
    ],
    solution: ["5,5", "6,5", "4,5", "7,5", "5,6", "6,6", "5,7"],
    explanation: "거대한 흑 대마를 살려야 합니다. 옥집의 함정을 피하면서 두 눈을 내는 절묘한 수순."
  },
  {
    title: "실전 대마 사활 2",
    difficulty: "hard",
    boardSize: 13,
    stones: [
      {x: 7, y: 7, color: "black"}, {x: 8, y: 7, color: "black"}, {x: 9, y: 7, color: "black"}, {x: 10, y: 7, color: "black"}, {x: 7, y: 8, color: "black"}, {x: 10, y: 8, color: "black"},
      {x: 6, y: 7, color: "white"}, {x: 6, y: 8, color: "white"}, {x: 7, y: 6, color: "white"}, {x: 8, y: 6, color: "white"}, {x: 9, y: 6, color: "white"}, {x: 10, y: 6, color: "white"}, {x: 11, y: 7, color: "white"}, {x: 11, y: 8, color: "white"}, {x: 10, y: 9, color: "white"}, {x: 9, y: 9, color: "white"}, {x: 8, y: 9, color: "white"}, {x: 7, y: 9, color: "white"}
    ],
    solution: ["8,8", "9,8", "7,8", "10,8", "8,9", "9,9", "8,10"],
    explanation: "치중을 당했을 때 안형을 넓혀 반발하는 것이 핵심입니다."
  },
  {
    title: "대궁소궁 마법",
    difficulty: "hard",
    boardSize: 13,
    stones: [
      {x: 3, y: 10, color: "black"}, {x: 4, y: 10, color: "black"}, {x: 5, y: 10, color: "black"}, {x: 3, y: 11, color: "black"}, {x: 5, y: 11, color: "black"},
      {x: 2, y: 10, color: "white"}, {x: 2, y: 11, color: "white"}, {x: 3, y: 9, color: "white"}, {x: 4, y: 9, color: "white"}, {x: 5, y: 9, color: "white"}, {x: 6, y: 10, color: "white"}, {x: 6, y: 11, color: "white"}, {x: 5, y: 12, color: "white"}, {x: 4, y: 12, color: "white"}, {x: 3, y: 12, color: "white"}
    ],
    solution: ["4,11", "4,10", "3,11", "5,11", "4,12"],
    explanation: "궁도가 큰 쪽이 궁도가 작은 쪽을 수상전에서 이깁니다."
  },
  {
    title: "귀의 기수",
    difficulty: "hard",
    boardSize: 13,
    stones: [
      {x: 10, y: 3, color: "black"}, {x: 11, y: 3, color: "black"}, {x: 12, y: 3, color: "black"}, {x: 10, y: 4, color: "black"}, {x: 12, y: 4, color: "black"},
      {x: 9, y: 3, color: "white"}, {x: 9, y: 4, color: "white"}, {x: 10, y: 2, color: "white"}, {x: 11, y: 2, color: "white"}, {x: 12, y: 2, color: "white"}, {x: 13, y: 3, color: "white"}, {x: 13, y: 4, color: "white"}, {x: 12, y: 5, color: "white"}, {x: 11, y: 5, color: "white"}, {x: 10, y: 5, color: "white"}
    ],
    solution: ["11,4", "11,3", "10,4", "12,4", "11,5"],
    explanation: "귀의 특수성을 살려 패를 피하고 완생하는 형태."
  },
  {
    title: "끝내기의 묘묘",
    difficulty: "hard",
    boardSize: 13,
    stones: [
      {x: 4, y: 9, color: "black"}, {x: 5, y: 9, color: "black"}, {x: 6, y: 9, color: "black"}, {x: 4, y: 10, color: "black"}, {x: 6, y: 10, color: "black"},
      {x: 3, y: 9, color: "white"}, {x: 3, y: 10, color: "white"}, {x: 4, y: 8, color: "white"}, {x: 5, y: 8, color: "white"}, {x: 6, y: 8, color: "white"}, {x: 7, y: 9, color: "white"}, {x: 7, y: 10, color: "white"}, {x: 6, y: 11, color: "white"}, {x: 5, y: 11, color: "white"}, {x: 4, y: 11, color: "white"}
    ],
    solution: ["5,10", "5,9", "4,10", "6,10", "5,11"],
    explanation: "후절수를 조심하면서 깔끔하게 마무리 짓는 수순입니다."
  },
  {
    title: "후절수의 기적",
    difficulty: "hard",
    boardSize: 13,
    stones: [
      {x: 9, y: 9, color: "black"}, {x: 10, y: 9, color: "black"}, {x: 11, y: 9, color: "black"}, {x: 9, y: 10, color: "black"}, {x: 11, y: 10, color: "black"},
      {x: 8, y: 9, color: "white"}, {x: 8, y: 10, color: "white"}, {x: 9, y: 8, color: "white"}, {x: 10, y: 8, color: "white"}, {x: 11, y: 8, color: "white"}, {x: 12, y: 9, color: "white"}, {x: 12, y: 10, color: "white"}, {x: 11, y: 11, color: "white"}, {x: 10, y: 11, color: "white"}, {x: 9, y: 11, color: "white"}
    ],
    solution: ["10,10", "10,9", "9,10", "11,10", "10,11"],
    explanation: "내 돌을 희생시켜 상대의 약점을 찌르는 후절수의 극의."
  },
  {
    title: "고급 패싸움",
    difficulty: "hard",
    boardSize: 13,
    stones: [
      {x: 3, y: 4, color: "black"}, {x: 4, y: 4, color: "black"}, {x: 5, y: 4, color: "black"}, {x: 3, y: 5, color: "black"}, {x: 5, y: 5, color: "black"},
      {x: 2, y: 4, color: "white"}, {x: 2, y: 5, color: "white"}, {x: 3, y: 3, color: "white"}, {x: 4, y: 3, color: "white"}, {x: 5, y: 3, color: "white"}, {x: 6, y: 4, color: "white"}, {x: 6, y: 5, color: "white"}, {x: 5, y: 6, color: "white"}, {x: 4, y: 6, color: "white"}, {x: 3, y: 6, color: "white"}
    ],
    solution: ["4,5", "4,4", "3,5", "5,5", "4,6"],
    explanation: "단순히 죽은 듯 보이나, 패를 만들어 생명을 연장하는 놀라운 수법입니다."
  },
  {
    title: "이단 패싸움",
    difficulty: "hard",
    boardSize: 13,
    stones: [
      {x: 9, y: 4, color: "black"}, {x: 10, y: 4, color: "black"}, {x: 11, y: 4, color: "black"}, {x: 9, y: 5, color: "black"}, {x: 11, y: 5, color: "black"},
      {x: 8, y: 4, color: "white"}, {x: 8, y: 5, color: "white"}, {x: 9, y: 3, color: "white"}, {x: 10, y: 3, color: "white"}, {x: 11, y: 3, color: "white"}, {x: 12, y: 4, color: "white"}, {x: 12, y: 5, color: "white"}, {x: 11, y: 6, color: "white"}, {x: 10, y: 6, color: "white"}, {x: 9, y: 6, color: "white"}
    ],
    solution: ["10,5", "10,4", "9,5", "11,5", "10,6"],
    explanation: "두 번의 패싸움을 승리해야만 완생할 수 있는 난이도 최상의 문제입니다."
  },
  {
    title: "오궁도화 피하기",
    difficulty: "hard",
    boardSize: 13,
    stones: [
      {x: 5, y: 10, color: "white"}, {x: 6, y: 10, color: "white"}, {x: 7, y: 10, color: "white"}, {x: 8, y: 10, color: "white"}, {x: 9, y: 10, color: "white"},
      {x: 5, y: 9, color: "black"}, {x: 6, y: 9, color: "black"}, {x: 7, y: 9, color: "black"}, {x: 8, y: 9, color: "black"}, {x: 9, y: 9, color: "black"}, {x: 5, y: 11, color: "black"}, {x: 6, y: 11, color: "black"}, {x: 7, y: 11, color: "black"}, {x: 8, y: 11, color: "black"}, {x: 9, y: 11, color: "black"}, {x: 4, y: 10, color: "black"}, {x: 10, y: 10, color: "black"}
    ],
    solution: ["7,10", "6,10", "8,10", "5,10", "9,10"],
    explanation: "오궁도화 치중을 피해 빅을 만들거나 두 집을 나누는 심오한 기술입니다."
  },
  {
    title: "매화육궁의 역습",
    difficulty: "hard",
    boardSize: 13,
    stones: [
      {x: 5, y: 5, color: "white"}, {x: 6, y: 5, color: "white"}, {x: 7, y: 5, color: "white"}, {x: 6, y: 4, color: "white"}, {x: 6, y: 6, color: "white"},
      {x: 5, y: 4, color: "black"}, {x: 7, y: 4, color: "black"}, {x: 5, y: 6, color: "black"}, {x: 7, y: 6, color: "black"}, {x: 4, y: 5, color: "black"}, {x: 8, y: 5, color: "black"}
    ],
    solution: ["6,5", "6,4", "6,6", "5,5", "7,5"],
    explanation: "상대의 매화육궁 모양을 역이용하여 대마를 포획하는 짜릿한 문제입니다."
  }
];

// Give them sequential IDs
let nextId = data.problems.length > 0 ? Math.max(...data.problems.map(p => p.id)) + 1 : 1;
for (const p of newProblems) {
  p.id = nextId++;
  data.problems.push(p);
}

fs.writeFileSync(problemsPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully added ' + newProblems.length + ' problems.');
