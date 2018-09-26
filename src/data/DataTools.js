import PropTypes from 'prop-types';
import UUID from 'uuid/v1';

import userData from './users/userData.json';
import companyData from './companies/companyData.json';
import itemStore from './itemStore/itemStore.json';
import DataManipulator from './DataManipulator';

export default class DataTools {
    static getUser(user_id) {
        const url = `http://localhost:8080/users`;
        return fetch(url)
            .then(response => response.json())
            .then(users => users.filter(user => user.id === user_id)[0]);
    }

    static async getCompany(company_id) {
        const url = `http://localhost:8080/companies`;
        let data = await (await (fetch(url)
            .then(response => {
                return response.json();
            })));
        return data.filter(company => company.id === company_id)[0];
    }

    static getCompanyName(company_id) {
        return this.getCompany(company_id).displayName;
    }

    static getSensors(company_id) {
        const sensors = (async () => {
            const company = await this.getCompany(company_id);
            return company.sensors;
        })();
        console.log(sensors);
    }

    static getDatahubs(company_id) {
        return this.getCompany(company_id).datahubs;
    }

    static getLocations(company_id) {
        return this.getCompany(company_id).locations;
    }

    static getZones(company_id, location_id) {
        return this.getLocations(company_id)
            .filter(location => location.id === location_id);
    }

    static getMachines(company_id, location_id, zone_id) {
        return this.getZones(company_id, location_id)
            .filter(zone => zone.id === zone_id);
    }

    static getItems() {
        const url = `http://localhost:8080/itemInventory`;

        return fetch(url).then(response => response.json()).then(json => json.map(item => {
            //console.log(item);
            return item;
        }));
    }

    static addNewItem(item, company_id) {
        try {
            return this._addItemToCompanyInventory(item, company_id);
        } 
        catch (exception) {
            throw exception;
        }
    }

    static _addItemToCompanyInventory(item, company_id) {
        console.log(company_id);
        if (this._isItemValid(item)){
            // TODO: add item to co.
            const appender = new DataManipulator(companyData);
            console.log(company_id);
            //appender.appendToCompany(company_id, item);
        } else {
            this._resolveInvalidEntry(item);
        }
    }

    static _resolveInvalidEntry(target) {
        if (target.getSerial() === "" || target.getMAC() === "") throw "blank";

        const validSerial = this.getItems().every(item => {
            if (item.serial !== target.getSerial()) return false;
            return true;
        });
        console.log("valid serial: " + validSerial);
        const validMAC = this.getItems().some(item => {
            if (validSerial && item.mac !== target.getMAC()) return false;
            return true;
        });
        console.log("valid mac: " + validMAC);
        const unavailable = this.getItems().some(item => {
            if (validSerial && validMAC && !item.company) return false;
            return true;
        });
        console.log("unavailable: " + unavailable);
        
        if (!validSerial) throw "serial";
        if (!validMAC) throw "mac";
        if (unavailable) throw 'unavailable';
    }

    static _isItemValid(target) {
        console.log(this.getSensors("company1"));
        return this.getItems().some(item => {
            console.log(`checking valid`);
            console.log(item);
            console.log("valid? " + !item.company && item.serial === target.getSerial() && item.mac === target.getMAC());
            return !item.company && item.serial === target.getSerial() && item.mac === target.getMAC();
        });
    }
}