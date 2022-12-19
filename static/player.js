module.exports = class Player {
    
    socket = null;
    party =  null;

    placedShips = null;

    get ready() {
        if(Object.keys(this.placedShips) < 10)
            return false;
            
        if(this.party) {
            return false;
        }
        
        return false;
    }
};