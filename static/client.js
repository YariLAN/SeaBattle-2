const socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

let buttonPlay = document.getElementById("play");
let buttonExit = document.querySelector('[data-scene="exit"] > button');


socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

const reloadUsers = (data) => {
  const hello = document.getElementById("PlayerJOIN");
  hello.innerHTML = "";
  
  for(let i = 0; i < Object.keys(data).length; i++) {
    hello.innerHTML += `<p>игрок с id: ${data[i].id}, подключился</p>`;
  }
};

// Событие - стрельба по сопернику
function Shot() {

  tab2.onmouseover = (event) => {
    let td = event.target.closest("td");
    if(td.classList.contains("no_click")) {
      return false;
    }

    td.classList.add("shot");
  
  }

  tab2.onclick = (event) => {
    let td = event.target.closest("td");
    
    if(td.classList.contains("no_click")) {
      return false;
    }
    td.classList.remove("shot");

    socket.emit("shipSearch", td.id);

    socket.on("Found", (found) => {

      if(found === true) {
        td.classList.add("backlight");
        
      }
      else if(!td.classList.contains("backlight") ) {
        td.classList.add("Notbacklight");
      }
    });
    
    td.classList.add("no_click");
  }

  tab2.onmouseout = (event) => {
    let td = event.target.closest("td");
    td.classList.remove("shot");
  }

  return true;
}

socket.on("Fall", (id) => {
  document.getElementById(id).appendChild(imgShot.cloneNode(true));
}); 

socket.on("NotFall", (id) => {
  document.getElementById(id).appendChild(imgNotFall.cloneNode(true));
}); 

socket.on("killed",  (n, isNum) => {
  (isNum == true) ? document.querySelector(".numPl").innerText = n :
                    document.querySelector(".numEn").innerText = n;
});

// Обновление статуса игрока
function statusUpdate(arg) {
  const StatusDIV = document.querySelector('.battlefield-status');
  if(statusGame == "") {
    StatusDIV.textContent = "";

  } else if (statusGame === "randomFinding") {
    StatusDIV.textContent = "Поиск соперника";

  } else if( statusGame === "randomIsFound") {
    StatusDIV.textContent = "Соперник найден!";
    document.querySelector('[data-scene="bar"]').classList.remove("hide");
    setTimeout(() => {}, 1000);
  } else if(statusGame === "play") {
    (arg) ? StatusDIV.textContent = "Ваш ход" : 
            StatusDIV.textContent = "Ход соперника";

    (arg) ? Shot() : tab2.onclick = null;

  } else if(statusGame === "win") {
    (arg) ? StatusDIV.textContent = "Вы победили" : 
            StatusDIV.textContent = "Соперник победил";
    tab2.onclick = null;
    document.querySelector('[data-scene="exit"]').classList.remove("hide");

  } return StatusDIV.textContent;
}

socket.on("playerCount", n => {
  document.querySelector(".amountPlayer").innerText = n;
});

socket.emit('new player');

socket.on('state', function(data) {
  reloadUsers(data);
});

socket.on("status", (status, arg = null) => {
  statusGame = status;
  statusUpdate(arg);
});

let checkButton = setInterval(() => Game(), 100);

function Game() {
  if(Object.entries(mainContainers).length >= 10) {
    clearInterval(checkButton);
    buttonPlay.classList.remove("hide");
  }
  console.log("Число кораблей на поле: ", Object.entries(mainContainers).length);
}

// запуск игры
const LoadingGame = () => {
  
  document
  .querySelectorAll(".app-actions")
  .forEach((elem) => elem.classList.add("hide"));

  document.querySelector('[data-scene="online"]').classList.remove("hide");

  statusUpdate();

  const listTD = tab1.querySelectorAll("tbody > tr > td");

  for(let td of listTD) {
    td.ondragover = null;
    td.ondrop = null;

    if(td.querySelector("div") != null) {

      let div = td.querySelector("div");
      div.onmouseover = null;
      div.onmouseout = null;
      div.oncontextmenu = null;
      div.ondragstart = null;
      div.ondragend = null;
    };
  }

  // Передача данных о расположении
  // всех кораблей и поиск соперника
  socket.emit('findEnemy', ArraySHIPS.map(ship => ({
    NameShip: ship.nameShip, 
    Size: ship.size, 
    Table: ship.NameT.id,
    MasTD: ship.masTd.map(td => ({
      id: td.id
    })),
  })));
}

const playOff = () => {
  socket.disconnect();
  location.reload();
}


buttonPlay.addEventListener("click", LoadingGame);

buttonExit.addEventListener("click", playOff);




// socket.on("new", function(data) {
//     console.log(data);
//     socket.emit("hi", `Игрок с id ${data} подключился`);
// });
