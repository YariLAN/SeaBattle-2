const Party = require("./Party");


module.exports = class PartyManager {
    players = [];
    parties = [];
    waitingRandom = [];
    placedShips = [];

    addPlayer(player) {
        if(this.players.includes(player)) {
            return false;
        }

        this.players.push(player);

        return true;
    }

    deletePlayer(player) {
        if(!this.players.includes(player))
            return false;
        
        const index = this.players.indexOf(player);
        this.players.splice(index, 1);

        if(this.waitingRandom.includes(player)) {
            const index = this.waitingRandom.indexOf(player);
            this.players.splice(index, 1);
        }
       return true;
    }

    deleteAllPlayers() {
        const players = this.players.slice();
        for(const player of players) {
            this.deletePlayer(player);
        }

        return players.lenght;
    }

    addParty(party) {
        if(this.parties.includes(party)) {
            return false;
        }
        this.parties.push(party);

        return true;
    }

    deleteParty(party) {

        if(!this.parties.includes(party))
            return false;
    
        const index = this.parties.indexOf(party);
        this.parties.splice(index, 1);



        return true;
    }

    deleteAllParty() {
        const parties = this.parties.slice();
        for(const party of parties) {
            this.deleteParty(party);
        }

        return parties.lenght;
    }
    
    playRandom(player, ships) {

        if(this.waitingRandom.includes(player)) {
            return false;
        }

        if(this.parties.includes(player)) {
            return false;
        }

        this.waitingRandom.push(player);

        
        const setShips = [];
        for(const {NameShip, Size, Table, MasTD} of ships ) {
            setShips.push({NameShip, Size, Table, MasTD});   
        }
        
        this.placedShips.push(setShips);

        if(this.waitingRandom.length >= 2) {

            const [Player, Enemy] = this.waitingRandom.splice(0,2);
            const [shipSetONE, shipSetTWO] = this.placedShips.splice(0,2);
            shipSetTWO.map(ship => ({
                Table: ship.Table = "EnenyMap",
            }));
            Player.emit("status", "randomIsFound");
            Enemy.emit("status", "randomIsFound");
            
            const party = new Party(Player, Enemy, shipSetONE, shipSetTWO);
            this.addParty(party);
           
        }
        
        return true;
    }

}





