class Item {
    constructor(serial, mac, database){
        this.serial = serial;
        this.mac = mac;
        this.db = database;
        this.invalid = null;
        return this.checkValidity();
    }

    getSerial = () => this.serial;

    getMAC = () => this.mac;

    isDatahub = () => {
        const re = /dhb/i;
        if(this.serial.match(re)) return true;
        return false;
    }
}

export default Item;