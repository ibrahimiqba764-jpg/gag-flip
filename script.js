// Users database
const users = {
  "admin": {password:"adminpass", roblox:"AdminRoblox", balance:0, items:[], canPlay:true, history:[]}
};

let currentUser = null;

// Login function
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const roblox = document.getElementById("roblox").value;

  if(!users[username]){
    users[username] = {password, roblox, balance:0, items:[], canPlay:false, history:[]};
  }

  if(users[username].password !== password){
    alert("Incorrect password");
    return;
  }

  currentUser = username;
  alert(`Logged in as ${username}`);
  document.getElementById("login-section").style.display = "none";
  document.getElementById("player-info").style.display = "block";
  document.getElementById("coinflip-section").style.display = "block";

  if(currentUser === "admin"){
    document.getElementById("admin-section").style.display = "block";
  }

  renderPlayer();
  renderAllPlayers();
}

// Render player info
function renderPlayer(){
  const player = users[currentUser];
  document.getElementById("balance").innerText = `Balance: ${player.balance}`;
  document.getElementById("items").innerText = `Items: ${player.items.join(", ") || "None"}`;
  const historyEl = document.getElementById("history");
  historyEl.innerHTML = "";
  player.history.forEach(h => {
    const li = document.createElement("li");
    li.innerText = h;
    historyEl.appendChild(li);
  });
}

// Coinflip
function createCoinFlip(){
  const item = document.getElementById("item-use").value;
  const player = users[currentUser];

  if(!player.canPlay || !player.items.includes(item)){
    alert("You don't have the required item!");
    return;
  }

  const result = Math.random() < 0.5 ? "H" : "T";
  alert(`Coin flipped: ${result}`);

  if(result === "H"){
    player.balance += 10;
    player.history.push(`Used ${item}, Result: H, +10`);
  } else {
    player.balance -= 5;
    player.history.push(`Used ${item}, Result: T, -5`);
  }

  renderPlayer();
}

// Admin functions
function adminDeposit(){
  if(currentUser !== "admin") return alert("Only admin!");
  const username = document.getElementById("deposit-user").value;
  const amount = Number(document.getElementById("deposit-amount").value);
  if(!users[username]) return alert("Player not found");
  users[username].balance += amount;
  alert(`Deposited ${amount} to ${username}`);
  renderAllPlayers();
}

function adminWithdraw(){
  if(currentUser !== "admin") return alert("Only admin!");
  const username = document.getElementById("withdraw-user").value;
  const amount = Number(document.getElementById("withdraw-amount").value);
  if(!users[username]) return alert("Player not found");
  if(users[username].balance < amount) return alert("Not enough balance");
  users[username].balance -= amount;
  alert(`Withdrew ${amount} from ${username}`);
  renderAllPlayers();
}

function adminAddItem(){
  if(currentUser !== "admin") return alert("Only admin!");
  const username = document.getElementById("give-item-user").value;
  const item = document.getElementById("give-item").value;
  if(!users[username]) return alert("Player not found");
  users[username].items.push(item);
  users[username].canPlay = true;
  alert(`Gave item ${item} to ${username}`);
  renderAllPlayers();
}

function renderAllPlayers(){
  if(currentUser !== "admin") return;
  const ul = document.getElementById("all-players");
  ul.innerHTML = "";
  for(const u in users){
    const li = document.createElement("li");
    li.innerText = `${u} | Roblox: ${users[u].roblox} | Balance: ${users[u].balance} | Items: ${users[u].items.join(", ") || "None"}`;
    ul.appendChild(li);
  }
}
