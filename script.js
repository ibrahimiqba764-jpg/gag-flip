// Users database
const users = {
  "EzFlxshW": {password:"Ibrahimiqbal786", roblox:"AdminRoblox", balance:0, items:[], canPlay:true, history:[]}
};

let currentUser = null;
const onlinePlayers = []; // list of online users

// Register a new player
function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const roblox = document.getElementById("roblox").value;

  if(!username || !password) return alert("Enter username and password");
  if(users[username]) return alert("Username already exists");

  users[username] = {password, roblox, balance:0, items:[{name:"Ride Dog", value:34}], canPlay:true, history:[]};
  alert(`Registered player: ${username} with Ride Dog - 34`);
}

// Login function
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if(!users[username]) return alert("Username not found");
  if(users[username].password !== password) return alert("Incorrect password");

  currentUser = username;
  if(!onlinePlayers.includes(currentUser)) onlinePlayers.push(currentUser);

  alert(`Logged in as ${username}`);
  document.getElementById("login-section").style.display = "none";
  document.getElementById("player-info").style.display = "block";
  document.getElementById("coinflip-section").style.display = "block";
  document.getElementById("online-players-section").style.display = "block";

  if(currentUser === "EzFlxshW"){
    document.getElementById("admin-section").style.display = "block";
  }

  renderPlayer();
  renderAllPlayers();
  renderOnlinePlayers();
  populateItemSelect();
}

// Render player info
function renderPlayer(){
  const player = users[currentUser];
  document.getElementById("balance").innerText = `Balance: ${player.balance}`;
  document.getElementById("items").innerText = `Items: ${player.items.map(i=>i.name+"-"+i.value).join(", ") || "None"}`;
  const historyEl = document.getElementById("history");
  historyEl.innerHTML = "";
  player.history.forEach(h => {
    const li = document.createElement("li");
    li.innerText = h;
    historyEl.appendChild(li);
  });
  populateItemSelect();
}

// Populate item select dropdown
function populateItemSelect() {
  const select = document.getElementById("item-use");
  select.innerHTML = "";
  if(currentUser && users[currentUser].items.length > 0){
    users[currentUser].items.forEach((i,index)=>{
      const option = document.createElement("option");
      option.value = index;
      option.text = `${i.name} - ${i.value}`;
      select.appendChild(option);
    });
  } else {
    const option = document.createElement("option");
    option.text = "No items";
    select.appendChild(option);
  }
}

// Render online players
function renderOnlinePlayers(){
  const container = document.getElementById("online-players-list");
  container.innerHTML = "";
  onlinePlayers.forEach(u=>{
    if(u === currentUser) return;
    const div = document.createElement("div");
    div.className = "player-card";
    div.innerHTML = `<span>${u} | Items: ${users[u].items.map(i=>i.name+"-"+i.value).join(", ")}</span>
    <button onclick="joinCoinflip('${u}')">Join Game</button>`;
    container.appendChild(div);
  });
}

// Coinflip vs opponent
function joinCoinflip(opponent){
  const player = users[currentUser];
  const opp = users[opponent];

  if(player.items.length === 0) return alert("You have no items!");
  if(opp.items.length === 0) return alert("Opponent has no items!");

  const playerItem = player.items[0];
  const oppItem = opp.items[0];

  const coin = document.getElementById("coin");
  const resultEl = document.getElementById("flip-result");
  coin.classList.remove("flip");
  void coin.offsetWidth;
  coin.classList.add("flip");
  resultEl.innerText = "";

  setTimeout(()=>{
    const result = Math.random() < 0.5 ? "H" : "T";
    let winner, loser;
    if(result==="H"){
      winner = currentUser; loser = opponent;
    } else {
      winner = opponent; loser = currentUser;
    }

    // Transfer items
    const wonItem = users[loser].items.shift();
    users[winner].items.push(wonItem);

    users[currentUser].history.push(`Flipped with ${opponent}, result ${result}, used ${playerItem.name}`);
    users[opponent].history.push(`Flipped with ${currentUser}, result ${result}, used ${oppItem.name}`);

    resultEl.innerText = `${winner} wins! Takes ${wonItem.name} from ${loser}`;
    renderPlayer();
    renderAllPlayers();
    renderOnlinePlayers();
  },2000);
}

// Admin gives item
function adminAddItem(){
  if(currentUser !== "EzFlxshW") return alert("Only admin!");
  const username = document.getElementById("give-item-user").value;
  const itemName = document.getElementById("give-item-name").value;
  const itemValue = Number(document.getElementById("give-item-value").value);

  if(!users[username]) return alert("Player not found");
  if(!itemName || !itemValue) return alert("Enter valid item name and value");

  users[username].items.push({name:itemName, value:itemValue});
  users[username].canPlay = true;
  alert(`Gave item ${itemName} (${itemValue}) to ${username}`);
  renderAllPlayers();
}

// Display all players
function renderAllPlayers(){
  if(currentUser !== "EzFlxshW") return;
  const ul = document.getElementById("all-players");
  ul.innerHTML = "";
  for(const u in users){
    const li = document.createElement("li");
    li.innerText = `${u} | Roblox: ${users[u].roblox || "N/A"} | Balance: ${users[u].balance} | Items: ${users[u].items.map(i=>i.name+"-"+i.value).join(", ") || "None"}`;
    ul.appendChild(li);
  }
}
