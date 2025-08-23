// --- CONFIG ---
const GIST_ID = 'YOUR_GIST_ID'; // Ganti dengan Gist kamu
const GH_TOKEN = 'YOUR_GITHUB_TOKEN'; // Ganti dengan token GitHub kamu

// --- LOGIN ---
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

// --- LOAD TOKEN DARI GIST ---
async function loadTokens() {
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`);
  const data = await res.json();
  const tokens = JSON.parse(data.files['token.json'].content);
  renderTokens(tokens);
}

// --- UPDATE GIST ---
async function updateGist(newTokens) {
  await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${GH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        'token.json': {
          content: JSON.stringify(newTokens, null, 2)
        }
      }
    })
  });
  loadTokens();
}

// --- TAMBAH TOKEN ---
async function addToken() {
  const name = document.getElementById('botName').value.trim();
  const token = document.getElementById('botToken').value.trim();
  if (!name || !token) return alert('Isi semua!');

  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`);
  const data = await res.json();
  const tokens = JSON.parse(data.files['token.json'].content);

  tokens.push({ bot_name: name, token });
  await updateGist(tokens);
}

// --- HAPUS TOKEN ---
async function deleteToken(index) {
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`);
  const data = await res.json();
  const tokens = JSON.parse(data.files['token.json'].content);

  tokens.splice(index, 1);
  await updateGist(tokens);
}

// --- RENDER TOKEN ---
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
