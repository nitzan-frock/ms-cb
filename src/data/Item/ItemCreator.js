import Item from './Item';

class ItemCreator {
    static create = (serial, mac) => {
        return new Item(serial, mac);
    }
}

export default ItemCreator;