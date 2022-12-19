
let tab1 = createMap("Test", "tables");
let tab2 = createMap("EnenyMap", "tablesEnemy");

let tab = document.getElementsByTagName("table");

let setGame = false;

let mainContainers = [];
let ArraySHIPS = [];
let discoveryTD = { };

let statusGame = "";

let imgShot = new Image();
imgShot.src = "./static/gg_assign.png";

let imgNotFall = new Image();
imgNotFall.src = "./static/tabler_point.png";



setDiscoveryTD("Test");

for(let TAB of tab)
  TAB.oncontextmenu = function () {return false};


document.body.addEventListener("click", function(e) {
  console.log(e.pageX, e.pageY);
})

// создание поля
function createMap(name, divName) {

  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  const div = document.getElementById(divName);

  table.id = name;
  
  for (let y = 0; y < 10; y++) {
                
    const tr = document.createElement("tr");

    for (let x = 0; x < 10; x++) {
      const td = document.createElement("td");
      td.id = y.toString() + x.toString();
                      
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);  
  div.appendChild(table);

  return table;
}
// создание поля

// заполнение словаря из ячеек поля
function setDiscoveryTD(TABLE) {
  const table = document.getElementById(TABLE);
  const listTD = table.querySelectorAll("tbody > tr > td ");

  for(let TD of listTD) {
    discoveryTD[TD.id] = 0;
  }
}


function DiscoveryFromSHIP(ship,num) {
  for(let TD of ship.allTD) {
    discoveryTD[TD] = num;
  }
}
function DiscoveryFromMasTD(ship,num) {
  for(let TD of ship.allTD) {
    console.log(TD.id, "  ", ship.masTd);
    console.log(discoveryTD[TD.id]);
    if(discoveryTD[TD.id] === num) {
      
      return false;
    }
  }
}
function ClearDiscovery(ship, num) {
  for(let TD of ship.allTD) {
    discoveryTD[TD] = num;
  }
}



function createShip(Name, Size, nTab, Color = "rgba(0, 55, 255, 0.45)") {
  return {
    ObjShip: document.createElement('div'), 
    nameShip: Name,
    size: [Size, 1], 
    NameT: document.getElementById(nTab),
    color: Color,
    masTd: [],
    allTD: [],
  };
}

// выделение объекта
function chooseShipOn(event) {
  event.target.draggable = true;
  event.target.style.background = "#4a5fef";
}
function chooseShipOff(event) {
  event.target.draggable = false;
  event.target.style.background = "rgba(0, 55, 255, 0.45";
}
// выделение объекта

function setShipOnDiv(ship, nameDiv, startX, startY) {

  const marginDiv = document.createElement('div');
  const mainDiv = document.getElementById(nameDiv);

  let shDiv = ship.ObjShip;  
      shDiv.id = ship.nameShip;

  FormStyle(ship);  
  
  marginDiv.style.margin = 3 + "px";

  shDiv.style.position = "absolute";
  shDiv.style.left = startX + "px";
  shDiv.style.top = startY + "px";

  marginDiv.appendChild(shDiv);
  mainDiv.appendChild(marginDiv);

  shDiv.onmouseover = function(event) {
    
    chooseShipOn(event); 
    DragAndDrop(ship);
    rotateShip(ship);
  };
  //либо тут, либо как внутренняя

  shDiv.onmouseout = function(event) {
    
    chooseShipOff(event);
  };
 
}

function FormStyle(ship, defect_W = 0, defect_H = 0) {
  ship.ObjShip.style.cssText = `width: ${ship.size[0]*39 + defect_W + "px"}; 
                                height: ${ship.size[1]*39 + defect_H + "px"}; 
                                background: ${ship.color};
                                border: 1px solid #0400ff;`;
}


function removePosition(ship) {
  for(let td of ship.allTD) {
    const DIV = td.querySelector("section");
    DIV.remove();
  }
  return ship.allTD;
}

function GetDataObj(obj, anyShip) {

  let boolPosition = true;
  let n = 0, k = 0;
  
  // удаление div точек - границ корабля
  //anyShip.allTD = removePosition(anyShip);

  let objX = parseInt(obj.id[1]),
      objY = parseInt(obj.id[0]);

  if( (10 - objX ) < anyShip.size[0]  || 
      (10 - objY ) < anyShip.size[1]) {
    return !boolPosition;
  }
  

  for(let TR = 0; TR < anyShip.size[1]+2; TR++) {

    let Y = (objY - 1 + TR).toString(); 
  
    for(let TD = 0; TD < anyShip.size[0]+2; TD++) {
      
      let X = (objX - 1 + TD).toString();

      const cell = document.getElementById(Y+X);

      // если вне границы
      if(cell === null) {
        continue;
      } 
      // если корабль на границе другого корабля
      // if(cell.firstChild) {
      //   anyShip.allTD = removePosition(anyShip);
      //   return !boolPosition;
      // }
      // позиция самого корабля

      if( 0 <  (TR && TD) && (TR <= (anyShip.size[1])) 
                          && (TD  <= (anyShip.size[0])) )
      {
      anyShip.masTd[n++] = cell;
      }
      anyShip.allTD[k++] =  cell;

      // const section = document.createElement("section");
      // section.innerHTML = "";
      // cell.appendChild(section);
      
    } 
  }
  mainContainers[anyShip.nameShip] = anyShip.masTd;

  console.log(anyShip.allTD);

  return boolPosition;
}

 // Поворот

function rotateShip(ship) {
  
  if(setGame === true)
    return;

  let Selector = ship.ObjShip.parentNode;
  //[ship.defW, ship.defH] = [3,1];
  
  ship.ObjShip.oncontextmenu = function() 
  {
    ship.size.reverse();
    let BPos = GetDataObj(Selector, ship);

    if(BPos === false || Selector.tagName === "DIV") {
        ship.size.reverse();
        return;
    }
    //[ship.defW, ship.defH] = [ship.defH, ship.defW];
    FormStyle(ship);

  };
}


function changeListTD(arr) {
  
  for(let i = 0; i < allContainers.length; i++) {
    arr.splice(arr.indexOf(allContainers[i]), 1);
  }
  return arr;
} 



function DragAndDrop(ship) {
  
  if(setGame === true)
    return;

  const objSHIP = ship.ObjShip;
  const table = ship.NameT;
  const listTD = table.querySelectorAll("tbody > tr > td ");

  for(let td of listTD) {
    td.ondragover = alowDrop;
    td.ondrop = drop;
  }

  function alowDrop(event) {
    event.preventDefault();
  }

  //либо тут, либо как внешняя
  // objSHIP.onmouseout = function(event) {
  //   chooseShipOff(event);
  //   rotateShip(ship);
  // };

  objSHIP.ondragstart = drag;
  objSHIP.ondragend = drEnd;

  // тяга..
  function drag(event) {
    
    setTimeout(() => {
      event.target.classList.add("hide");
    },10);
    event.dataTransfer.setData('id', objSHIP.id);   
  }

  function drEnd(e) {
    e.target.classList.remove("hide");
  }
  // тяга..

  // дропалка //


  function drop(event) {

    
    let itemId = event.dataTransfer.getData("id");
    let boatDIV = document.getElementById(itemId);
    
    let bPos = GetDataObj(event.target, ship);
    
    if(itemId == "" || !bPos)
      return;

    event.target.append(boatDIV);

    boatDIV.style.removeProperty("left");
    boatDIV.style.removeProperty("top");

    boatDIV.classList.add("SetD");

  }

}

let ship_1 = createShip("boat_1", 3, "Test");
let ship_2 = createShip("boat_2", 2, "Test");
let ship_3 = createShip("boat_3", 2,"Test");
let ship_4 = createShip("boat_4", 2, "Test");
let ship_5 = createShip("boat_5", 1, "Test");
let ship_6 = createShip("boat_6", 1, "Test");
let ship_7 = createShip("boat_7", 1, "Test");
let ship_8 = createShip("boat_8", 3, "Test");

let ship_10 = createShip("boat_10", 4, "Test");
let ship_11 = createShip("boat_11", 1, "Test");

setShipOnDiv(ship_2, "genDiv", 10, 10);
setShipOnDiv(ship_3, "genDiv", 95, 10);
setShipOnDiv(ship_4, "genDiv", 180, 10);
setShipOnDiv(ship_5, "genDiv", 265, 10);
setShipOnDiv(ship_6, "genDiv", 310, 10);
setShipOnDiv(ship_11, "genDiv", 355, 10);
setShipOnDiv(ship_1, "genDiv", 10, 60);
setShipOnDiv(ship_8, "genDiv", 135, 60);
setShipOnDiv(ship_10, "genDiv", 10, 105);
setShipOnDiv(ship_7, "genDiv", 260, 60);

ArraySHIPS = [
  ship_1, ship_2, ship_3, ship_4, ship_5, 
  ship_6, ship_7, ship_8, ship_10, ship_11
];

//console.log(discoveryTD);
