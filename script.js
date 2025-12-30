const form = document.getElementById('guestForm');
const entriesDiv = document.getElementById('entries');

// 데이터를 DOM이 아닌 변수에서 관리합니다.
let guestBookEntries = [];

// 모든 항목을 화면에 렌더링하는 함수
function renderEntries() {
  entriesDiv.innerHTML = ''; // 기존 항목들을 지웁니다.
  // 최신 글이 위에 오도록 배열을 역순으로 순회합니다.
  for (let i = guestBookEntries.length - 1; i >= 0; i--) {
    const entry = guestBookEntries[i];
    const entryDiv = createEntryElement(entry.name, entry.message, entry.timestamp, i); // timestamp, index 전달
    entriesDiv.appendChild(entryDiv); // 생성된 요소를 추가합니다.
  }
}

// Function to load entries from localStorage
function loadEntries() {
  guestBookEntries = JSON.parse(localStorage.getItem('guestBookEntries')) || [];
  renderEntries();
}

// Function to save entries to localStorage
function saveEntries() {
  // guestBookEntries 배열은 이미 시간순이므로 그대로 저장합니다.
  localStorage.setItem('guestBookEntries', JSON.stringify(guestBookEntries));
}

// Helper function to format timestamp
function formatTimestamp(isoString) {
  if (!isoString) return ''; // 타임스탬프가 없는 기존 데이터를 위한 처리
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

// Helper function to create an entry div with a delete button
function createEntryElement(name, message, timestamp, index) {
  const entryDiv = document.createElement('div');
  entryDiv.className = 'entry';
  // .innerHTML 대신 DOM API를 사용하여 XSS 공격을 방지합니다.
  const strong = document.createElement('strong');
  strong.textContent = name;

  const br = document.createElement('br');

  // createTextNode를 사용해 메시지를 안전하게 추가합니다.
  const messageText = document.createTextNode(message);

  entryDiv.appendChild(strong);
  entryDiv.appendChild(br);
  entryDiv.appendChild(messageText); // 메시지 추가

  // 타임스탬프 생성 및 추가
  if (timestamp) {
    const timeElement = document.createElement('div');
    timeElement.className = 'timestamp';
    timeElement.textContent = formatTimestamp(timestamp);
    entryDiv.appendChild(timeElement);
  }

  // 삭제 버튼 생성
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '삭제';
  deleteBtn.className = 'delete-btn'; // 스타일링을 위한 클래스
  deleteBtn.dataset.index = index; // 데이터 속성에 인덱스 저장

  entryDiv.appendChild(deleteBtn); // 삭제 버튼 추가

  return entryDiv;
}

// 글을 삭제하는 함수
function deleteEntry(index) {
  const password = prompt('삭제를 위해 비밀번호를 입력하세요:');
  if (password !== 'del') { // 비밀번호 확인
    alert('비밀번호가 틀렸습니다.');
    return;
  }
  else{
  guestBookEntries.splice(index, 1); // 배열에서 해당 인덱스의 항목 제거
  saveEntries(); // 변경사항을 localStorage에 저장
  renderEntries(); // 목록을 다시 렌더링
}}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const nameInput = document.getElementById('name');
  const messageInput = document.getElementById('message');
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) return;

  // 새 항목을 데이터 배열에 추가합니다.
  guestBookEntries.push({ name, message, timestamp: new Date().toISOString() });
  saveEntries(); // 업데이트된 배열을 localStorage에 저장합니다.
  renderEntries(); // 전체 목록을 다시 렌더링합니다.

  // 입력값 초기화
  form.reset();
  nameInput.focus(); // UX 개선: 이름 필드에 포커스
});

// 이벤트 위임을 사용하여 삭제 버튼 클릭 처리
entriesDiv.addEventListener('click', function (e) {
  // 클릭된 요소가 삭제 버튼인지 확인
  if (e.target.classList.contains('delete-btn')) {
    const index = parseInt(e.target.dataset.index, 10);
    deleteEntry(index);
  }
});

// Load entries when the page loads
document.addEventListener('DOMContentLoaded', loadEntries);

// 배경음악 설정
document.addEventListener('DOMContentLoaded', function() {
  const bgm = document.getElementById('bgm');
  
  // 볼륨 설정 (0.0 ~ 1.0 사이, 0.5는 50% 볼륨)
  bgm.volume = 0.5; 

  // 자동 재생 시도
  const playPromise = bgm.play();

  if (playPromise !== undefined) {
    playPromise.then(_ => {
      // 자동 재생 성공
      console.log("BGM 자동 재생 시작");
    })
    .catch(error => {
      // 자동 재생 실패 (브라우저 정책 등) -> 클릭 시 재생되도록 이벤트 추가
      console.log("자동 재생이 막혔습니다. 클릭 시 재생됩니다.");
      document.body.addEventListener('click', function() {
        bgm.play();
      }, { once: true }); // 한 번만 실행되도록 설정
    });
  }
});