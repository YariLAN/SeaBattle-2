module.exports = class Party {

    Player = null;
    Enemy = null;


    shipSetONE = null;
    shipSetTWO = null;

    TableName1 = null;
    TableName2 = null;

    turnPlayer = null;
    youSocket = null;
    turnField = null;

    isTurn = true;

    constructor(Player, Enemy, shipSetONE, shipSetTWO) {

        Object.assign(this, {
            Player, Enemy, 
            shipSetONE, shipSetTWO,
        });

        this.TableName2 = this.shipSetTWO[0].Table;
        this.TableName1 = this.shipSetONE[0].Table;

        this.turnUpdate();
    }

    turnUpdate() {
      
      if(this.isTurn === true) {

        this.turnPlayer = this.Enemy;
        this.youSocket = this.Player;
        this.turnField = this.shipSetTWO.filter(obj => 
          Object.keys(obj.MasTD).length != 0);
      }
      else {
        this.turnPlayer = this.Player;
        this.youSocket = this.Enemy;
        this.turnField = this.shipSetONE.filter(obj => 
          Object.keys(obj.MasTD).length != 0);

      }
      this.Player.emit("status", "play", this.isTurn);
      this.Enemy.emit("status", "play", !this.isTurn);

      this.isTurn = !this.isTurn; 

    }

    win(socket, enemy) {
      socket.emit("status", "win", true);
      enemy.emit("status", "win", false);
    }
}