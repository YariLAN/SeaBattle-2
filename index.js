// зависимости
const session = require('express-session')
const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const PartyManager = require("./static/PartyManager");
const Party = require('./static/Party');
const PartyMan = new PartyManager();

// создание приложение ExpressJS
const app = express();
const server = http.createServer(app);

// Регистрация Socket приложения
const io = socketIO(server);
const port = 80;

// Настройка сессий
app.set('trust proxy', 1) // trust first proxy
app.use(
    session({
        secret: 's3Cur3',
        name: 'sessionId',
    })
);

// Настройка статики
app.use("/static", express.static(__dirname + "/static/"));


app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "index.html"));
}); 

// Поднятие сервера
server.listen(port, function() {
    console.log(`Starting server on port http://localhost:${port}`);
});


// Данные для передачи пользователям

// Не забыть поменять на SET
const players = [];
let count = 1;

// Прослушивание Socket соединений
io.on("connection", (socket) => {

    //PartyMan.connection(socket);
    PartyMan.addPlayer(socket);

    // Консольные данные для пользователя
    io.emit("playerCount", io.eio.clientsCount);

    socket.on('chat message', (msg) => {
        socket.emit('chat message', msg);
    });
    
    socket.on('new player', function() {
        
        players.push({
            id: socket.id,
            count: count,
        });
        count++;

        console.log(players);

        io.emit('state', players);
    });

    socket.on('disconnect', function() {

        // удаление партии
        let Party = PartyMan.parties.find((party) => socket === party.youSocket);
        PartyMan.deleteParty(Party);

        // удаление игрока
        PartyMan.deletePlayer(socket);

        // Консольные данные для всех пользователей
        io.emit("playerCount", io.eio.clientsCount);
        
        players.splice(players.indexOf(socket), 1);
        //players.pop();
        io.emit('state', players);
        count--;

        console.log(PartyMan);
        
    });


    socket.on('findEnemy', function(ships) {
      socket.emit("status", "randomFinding");
      PartyMan.playRandom(socket, ships);
    });

    socket.on("shipSearch", (id) => {
        
        let isFound = false; let emptyMasTD;
        let Party = PartyMan.parties.find((party) => socket === party.youSocket);

        Party.turnField.forEach(ship => {
            
            for(let i = 0; i < Object.keys(ship.MasTD).length; i++) {
                if(ship.MasTD[i].id === id) {

                    isFound = true;

                    ship.MasTD = ship.MasTD.filter((elem) => elem.id != id);

                    emptyMasTD = ship.MasTD;
                }
            }
        });
        
        // если игрок добил корабль
        if (isFound == true && emptyMasTD.length === 0) {

            Party.turnField = Party.turnField.filter(obj =>  {
                return Object.keys(obj.MasTD).length != 0;
            });

            let size = Array.from(Party.turnField).length;
            // сообщение счетчику о полностью подбитом корабле
            socket.emit("killed", 10 -size, true);
            Party.turnPlayer.emit("killed", 10 - size, false);

            (size === 0) ? Party.win(socket, Party.turnPlayer) : null;
        }

        // если игрок попал по кораблю
        if (isFound == true) {
        
            // продумать функцию класса

            // сообщение об успехе игроку
            socket.emit("Found", isFound );

            // сообщение о неудаче сопернику
            Party.turnPlayer.emit("Fall", id);
        }
        // если игрок не попал по кораблю
        else {

            // сообщение о промахе игроку 
            socket.emit("Found", isFound);
            // сообщение о промахе сопернику
            Party.turnPlayer.emit("NotFall", id);
          
            // смена хода
            Party.turnUpdate();
        }
    });
});
