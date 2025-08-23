// === CONFIG ===
const OWNER = 'ResellerGaming';        // Ganti dengan username kamu
const REPO = 'telepon-l';         // Nama repo kamu
const PATH = 'token.json';
const BRANCH = 'main';                // atau 'master'
const TOKEN = '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';         // Token PAT kamu

// === LOGIN (hardcoded demo) ===
function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user === 'admin' && pass === '123456') {
    document.getElementById('panel').style.display = 'block';
    loadTokens();
  } else {
    alert('Login gagal!');
  }
}

// === UTILS ===
async function apiGet(path) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: 'application/vnd.github+json'
    }
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

async function apiPut(path, message, content, sha) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const body = {
    message,
    content: btoa(content), // base64
    branch: BRANCH,
    sha
  };
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

// === CRUD ===
let currentSha = null;

async function loadTokens() {
  try {
    const data = await apiGet(PATH);
    currentSha = data.sha;
    const tokens = JSON.parse(atob(data.content));
    renderTokens(tokens);
  } catch (err) {
    alert('Gagal load token: ' + err.message);
  }
}

async function saveTokens(tokens) {
  try {
    const content = JSON.stringify(tokens, null, 2);
    await apiPut(PATH, 'Update token.json via API', content, currentSha);
    await loadTokens();
  } catch (err) {
    alert('Gagal simpan token: ' + err.message);
  }
}

function renderTokens(tokens) {
  const list = document.getElementById('tokenList');
  list.innerHTML = '';
  tokens.forEach((t, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${t.bot_name}: ${t.token}
      <button onclick="deleteToken(${i})">Hapus</button>`;
    list.appendChild(li);
  });
}

async function addToken() {
  const name = document.getElementById('botName').value.trim();
  const token = document.getElementById('botToken').value.trim();
  if (!name || !token) return alert('Isi semua!');

  const data = await apiGet(PATH);
  currentSha = data.sha;
  const tokens = JSON.parse(atob(data.content));
  tokens.push({ bot_name: name, token });
  await saveTokens(tokens);

  document.getElementById('botName').value = '';
  document.getElementById('botToken').value = '';
}

async function deleteToken(index) {
  const data = await apiGet(PATH);
  currentSha = data.sha;
  const tokens = JSON.parse(atob(data.content));
  tokens.splice(index, 1);
  await saveTokens(tokens);
}
