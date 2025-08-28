// Users database
const users = {
  "EzFlxshW": {password:"Ibrahimiqbal786", roblox:"AdminRoblox", balance:0, items:[], canPlay:true, history:[]}
};

let currentUser = null;
const onlinePlayers = [];
const activeCoinflips = [];

// Register
function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const roblox = document.getElementById("roblox").value;
  if(!username || !password) return alert("Enter username and password");
  if(users[username]) return alert("Username already exists");
  users[username] = {password, roblox, balance:0, items:[{name:"Ride Dog", value:34}], canPlay:true, history:[]};
  alert(`Registered: ${username} with Ride Dog - 34`);
}

// Login
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if(!users[username]) return alert("Username not found");
  if(users[username].password !== password) return alert("Incorrect password");
  currentUser = username;
  if(!onlinePlayers.includes(currentUser)) onlinePlayers.push(currentUser);
  document.getElementById("login-section").style.display = "none";
  document.getElementById("player-info").style.display = "block";
  document.getElementById("coinflip-section").style.display = "block";
  document.getElementById("online-players-section").style.display = "block";
  if(currentUser === "EzFlxshW") document.getElementById("admin-section").style.display = "block";
  renderPlayer();
  renderAllPlayers();
  renderOnlinePlayers();
  renderActiveCoinflips();
  populateItemSelect();
}

// Render player info
function renderPlayer(){
  const p = users[currentUser];
  document.getElementById("balance").innerText = `Balance: ${p.balance}`;
  document.getElementById("items").innerText = `Items: ${p.items.map(i=>i.name+"-"+i.value).join(", ") || "None"}`;
  const h = document.getElementById("history");
  h.innerHTML = "";
  p.history.forEach(e=>{ const li = document.createElement("li"); li.innerText=e; h.appendChild(li); });
  populateItemSelect();
}

// Populate item select
function populateItemSelect() {
  const sel = document.getElementById("item-use");
  sel.innerHTML = "";
  if(users[currentUser].items.length>0){
    users[currentUser].items.forEach((i,index)=>{
      const opt = document.createElement("option");
      opt.value = index; opt.text=`${i.name} - ${i.value}`; sel.appendChild(opt);
    });
  } else {
    const opt = document.createElement("option"); opt.text="No items"; sel.appendChild(opt);
  }
}

// Render online players
function renderOnlinePlayers(){
  const c = document.getElementById("online-players-list"); c.innerHTML="";
  onlinePlayers.forEach(u=>{
    if(u===currentUser) return;
    const d=document.createElement("div"); d.className="player-card";
    d.innerHTML=`<span>${u} | Items: ${users[u].items.map(i=>i.name+"-"+i.value).join(", ")}</span>
    <button onclick="challengePlayer('${u}')">Join Game</button>`; c.appendChild(d);
  });
}

// Admin give item
function adminAddItem(){
  if(currentUser!=="EzFlxshW") return alert("Only admin!");
  const username=document.getElementById("give-item-user").value;
  const itemName=document.getElementById("give-item-name").value;
  const itemValue=Number(document.getElementById("give-item-value").value);
  if(!users[username]) return alert("Player not found");
  if(!itemName||!itemValue) return alert("Enter valid item");
  users[username].items.push({name:itemName,value:itemValue});
  alert(`Gave ${itemName}(${itemValue}) to ${username}`);
  renderAllPlayers();
}

// Render all players (admin)
function renderAllPlayers(){
  if(currentUser!=="EzFlxshW") return;
  const ul=document.getElementById("all-players"); ul.innerHTML="";
  for(const u in users){
    const li=document.createElement("li");
    li.innerText=`${u} | Roblox: ${users[u].roblox||"N/A"} | Balance: ${users[u].balance} | Items: ${users[u].items.map(i=>i.name+"-"+i.value).join(", ")||"None"}`;
    ul.appendChild(li);
  }
}

// Create Coinflip session
function createCoinFlipSession(){
  const p=users[currentUser];
  const idx=document.getElementById("item-use").value;
  if(p.items.length===0) return alert("No items!");
  const item=p.items.splice(idx,1)[0];
  activeCoinflips.push({creator:currentUser,creatorItem:item});
  renderActiveCoinflips();
}

// Render active coinflips
function renderActiveCoinflips(){
  const c=document.getElementById("coinflip-sessions"); c.innerHTML="";
  activeCoinflips.forEach((s,i)=>{
    const div=document.createElement("div"); div.className="player-card";
    div.innerHTML=`<span>${s.creator}'s coinflip | Item: ${s.creatorItem.name}-${s.creatorItem.value}</span>
    ${s.creator!==currentUser?`<button onclick="joinCoinflipSession(${i})">Join</button>`:""}`;
    c.appendChild(div);
  });
}

// Join coinflip session
function joinCoinflipSession(i){
  const s=activeCoinflips[i]; const p=users[currentUser];
  if(p.items.length===0) return alert("No items!");
  const pItem=p.items.shift();
  const coin=document.getElementById("coin"); const resultEl=document.getElementById("flip-result");
  coin.classList.remove("flip"); void coin.offsetWidth; coin.classList.add("flip"); resultEl.innerText="";
  setTimeout(()=>{
    const res=Math.random()<0.5?"H":"T";
    let winner,loser,wItem,lItem;
    if(res==="H"){ winner=s.creator; loser=currentUser; wItem=s.creatorItem; lItem=pItem; }
    else { winner=currentUser; loser=s.creator; wItem=pItem; lItem=s.creatorItem; }
    users[winner].items.push(lItem);
    users[winner].history.push(`Won coinflip vs ${loser}, won ${lItem.name}`);
    users[loser].history.push(`Lost coinflip vs ${winner}, lost ${lItem.name}`);
    resultEl.innerText=`${winner} wins! Takes ${lItem.name} from ${loser}`;
    activeCoinflips.splice(i,1);
    renderPlayer(); renderAllPlayers(); renderOnlinePlayers(); renderActiveCoinflips();
  },2000);
}

// Challenge online player directly
function challengePlayer(u){
  // Optional: You could trigger a direct coinflip or create session
  alert(`Use 'Create Coinflip' to start a session and let others join.`);
}
