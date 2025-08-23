// --- CONFIG LOGIN ---
const USERNAME = 'admin';
const PASSWORD = '123456';

// --- LOGIN HANDLER ---
function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user === USERNAME && pass === PASSWORD) {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('tokenManager').classList.remove('hidden');
    loadTokens();
  } else {
    document.getElementById('loginError').innerText = 'Login gagal!';
  }
}

// --- TOKEN CRUD ---
function getTokens() {
  const data = localStorage.getItem('tokens');
  return data ? JSON.parse(data) : [];
}

function saveTokens(tokens) {
  localStorage.setItem('tokens', JSON.stringify(tokens, null, 2));
}

function loadTokens() {
  const list = document.getElementById('tokenList');
  list.innerHTML = '';
  const tokens = getTokens();

  tokens.forEach((t, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${t.bot_name}</strong>: ${t.token} 
      <button onclick="deleteToken(${index})">Hapus</button>`;
    list.appendChild(li);
  });
}

function addToken() {
  const name = document.getElementById('botName').value.trim();
  const token = document.getElementById('botToken').value.trim();

  if (!name || !token) {
    alert('Nama dan token harus diisi!');
    return;
  }

  const tokens = getTokens();
  tokens.push({ bot_name: name, token });
  saveTokens(tokens);
  loadTokens();

  document.getElementById('botName').value = '';
  document.getElementById('botToken').value = '';
}

function deleteToken(index) {
  const tokens = getTokens();
  tokens.splice(index, 1);
  saveTokens(tokens);
  loadTokens();
}
