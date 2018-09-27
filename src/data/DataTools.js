import PropTypes from 'prop-types';
import UUID from 'uuid/v1';

import userData from './users/userData.json';
import companyData from './companies/companyData.json';
import itemStore from './itemStore/itemStore.json';
import DataManipulator from './DataManipulator';

export default class DataTools {
    static async getUser(user_id) {
        const url = `http://localhost:8080/users`;
        let data = (await fetch(url).then(res => res.json()));
        return data.filter(user => user.id === user_id)[0];
    }

    static async getCompany(company_id) {
        const url = `http://localhost:8080/companies`;
        let data = (await fetch(url).then(res => res.json()));
        return data.filter(company => company.id === company_id)[0];
    }

    static async getCompanyName(company_id) {
        return (await this.getCompany(company_id)).displayName;
    }

    static async getSensors(company_id) {
        return (await this.getCompany(company_id)).sensors;
    }

    static async getDatahubs(company_id) {
        return (await this.getCompany(company_id)).datahubs;
    }

    static async getLocations(company_id) {
        return (await this.getCompany(company_id)).locations;
    }

    static async getZones(company_id, location_id) {
        return this.getLocations(company_id)
            .filter(location => location.id === location_id);
    }

    static getMachines(company_id, location_id, zone_id) {
        return this.getZones(company_id, location_id)
            .filter(zone => zone.id === zone_id);
    }

    static async getAvailableInventory() {
        const url = `http://localhost:8080/itemInventory`;
        return (await fetch(url).then(res => res.json()));
    }

    static async addItemToCompanyInventory(item, company_id) {
        const inventory = await this.getAvailableInventory();
        const isValid = await this._isItemValid(item, inventory);
        if (isValid){
            // TODO: add item to co.
            const url = `http://localhost:8080/companies?id=${company_id}`;
            const appender = new DataManipulator(url);
            appender.appendToCompany(item);
            return {ok: true, msg: "success"};
            //appender.appendToCompany(company_id, item);
        } else {
            const err = this._resolveInvalidEntry(item, inventory);
            return {ok: false, msg: err};
        }
    }

    static _isItemValid(target, inventory) {
        return inventory.some(item => {
            return item.company === null && 
                item.serial === target.getSerial() && 
                item.mac === target.getMAC();
        });
    }

    static _resolveInvalidEntry(target, inventory) {
        if (target.getSerial() === "" || target.getMAC() === "") return "blank";

        const validSerial = inventory.some(item => {
            if (item.serial !== target.getSerial()) return false;
            return true;
        });

        const validMAC = inventory.some(item => {
            if (validSerial && item.mac !== target.getMAC()) return false;
            return true;
        });

        const unavailable = inventory.some(item => {
            if (validSerial && validMAC && !item.company) return false;
            return true;
        });
        
        if (!validSerial) return "serial";
        if (!validMAC) return "mac";
        if (unavailable) return 'unavailable';
    }   
}