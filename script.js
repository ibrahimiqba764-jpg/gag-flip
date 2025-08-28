// Users database
const users = {
  "admin": {password:"adminpass", roblox:"AdminRoblox", balance:0, items:[], canPlay:true, history:[]}
};

let currentUser = null;

// Register a new player
function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const roblox = document.getElementById("roblox").value;

  if(!username || !password) return alert("Enter username and password");
  if(users[username]) return alert("Username already exists");

  users[username] = {password, roblox, balance:0, items:[{name:"Dog", value:34}], canPlay:true, history:[]};
  alert(`Registered player: ${username} with initial item Dog`);
}

// Login function
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if(!users[username]) return alert("Username not found");
  if(users[username].password !== password) return alert("Incorrect password");

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

// Coinflip
function createCoinFlip(){
  const player = users[currentUser];
  if(player.items.length === 0) return alert("No item to flip!");
  const itemIndex = document.getElementById("item-use").value;
  const item = player.items[itemIndex];

  // Animate coin
  const coin = document.getElementById("coin");
  const resultEl = document.getElementById("flip-result");
  coin.classList.remove("flip");
  void coin.offsetWidth; // restart animation
  coin.classList.add("flip");
  resultEl.innerText = "";

  setTimeout(()=>{
    const result = Math.random() < 0.5 ? "H" : "T";
    resultEl.innerText = `Result: ${result}, used ${item.name}`;
    if(result==="H"){
      player.balance += item.value;
      player.history.push(`Used ${item.name}, Result: H, +${item.value}`);
    } else {
      player.balance -= Math.floor(item.value/2);
      player.history.push(`Used ${item.name}, Result: T, -${Math.floor(item.value/2)}`);
    }
    player.items.splice(itemIndex,1); // remove item used
    renderPlayer();
  },2000); // match animation duration
}

// Admin gives item
function adminAddItem(){
  if(currentUser !== "admin") return alert("Only admin!");
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
  if(currentUser !== "admin") return;
  const ul = document.getElementById("all-players");
  ul.innerHTML = "";
  for(const u in users){
    const li = document.createElement("li");
    li.innerText = `${u} | Roblox: ${users[u].roblox || "N/A"} | Balance: ${users[u].balance} | Items: ${users[u].items.map(i=>i.name+"-"+i.value).join(", ") || "None"}`;
    ul.appendChild(li);
  }
}
