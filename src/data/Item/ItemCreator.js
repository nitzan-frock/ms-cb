import Item from './Item';

class ItemCreator {
    static create = (serial, mac, database) => {
        return new Item(serial, mac, database);
    }
}

export default ItemCreator;