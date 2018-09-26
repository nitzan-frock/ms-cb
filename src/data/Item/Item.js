class Item {
    constructor(serial, mac){
        this.serial = serial;
        this.mac = mac;
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