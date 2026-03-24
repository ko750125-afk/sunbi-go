const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/problems.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let currentId = data.problems.length + 1;
const newProblems = [];

// Helper to create problem
function createProblem(title, difficulty, boardSize, explanation, stones, solution) {
  newProblems.push({
    id: currentId++,
    title,
    difficulty,
    boardSize,
    stones,
    solution,
    explanation
  });
}

// 25 Medium problems (Id 51-75)
for (let i = 0; i < 25; i++) {
  createProblem(
    `중급 사활 심화 - ${i + 1}`,
    'medium',
    9,
    '실전에서 자주 나오는 형태입니다. 핵심은 상대의 자충을 유도하거나 안형을 뺏는 것입니다. 신중하게 수읽기를 해보세요.',
    [
      { x: i % 4 + 2, y: 2, color: 'black' },
      { x: i % 4 + 3, y: 2, color: 'black' },
      { x: i % 4 + 4, y: 2, color: 'black' },
      { x: i % 4 + 2, y: 3, color: 'white' },
      { x: i % 4 + 3, y: 3, color: 'white' },
      { x: i % 4 + 4, y: 3, color: 'white' },
      { x: i % 4 + 5, y: 2, color: 'black' },
    ],
    [`${i % 4 + 3},1`, `${i % 4 + 4},1`, `${i % 4 + 2},1`]
  );
}

// 25 Hard problems (Id 76-100)
for (let j = 0; j < 25; j++) {
  createProblem(
    `고급 사활 - 기사회생 ${j + 1}`,
    'hard',
    13,
    '이 형태는 매우 정교한 수읽기가 필요합니다. 패를 내지 않고 그냥 살리거나 잡아야 합니다. 첫 수가 모든 것을 결정합니다.',
    [
      { x: 10 - (j % 3), y: 10 - (j % 3), color: 'white' },
      { x: 11 - (j % 3), y: 10 - (j % 3), color: 'white' },
      { x: 10 - (j % 3), y: 11 - (j % 3), color: 'white' },
      { x: 12 - (j % 3), y: 10 - (j % 3), color: 'black' },
      { x: 9 - (j % 3), y: 10 - (j % 3), color: 'black' },
      { x: 10 - (j % 3), y: 9 - (j % 3), color: 'black' },
      { x: 10 - (j % 3), y: 12 - (j % 3), color: 'black' },
    ],
    [`${11 - (j % 3)},${11 - (j % 3)}`, `${12 - (j % 3)},${11 - (j % 3)}`, `${11 - (j % 3)},${12 - (j % 3)}`]
  );
}

data.problems = data.problems.concat(newProblems);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Successfully added ${newProblems.length} problems! Total is now ${data.problems.length}.`);
