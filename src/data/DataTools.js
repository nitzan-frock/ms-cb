import PropTypes from 'prop-types';
import UUID from 'uuid/v1';

import userData from './users/userData.json';
import companyData from './companies/companyData.json';
import itemStore from './itemStore/itemStore.json';

export default class DataTools {
    static getUser(userID) {
        return userData[userID];
    }

    static getCompany(company) {
        return companyData[company];
    }

    static getCompanyName(company) {
        return this.getCompany(company).displayName;
    }

    static getSensors(company) {
        return this.getCompany(company).sensors;
    }

    static getDatahubs(company) {
        return this.getCompany(company).datahubs;
    }

    static getLocations(company) {
        return this.getCompany(company).locations;
    }

    static getZones(company, location) {
        return this.getLocations(company)[location].zones;
    }

    static getMachines(company, location, zone) {
        return this.getLocations(company)[location].zones[zone];
    }

    static addNewItem(item, company) {
        try {
            return this._addItemToCompanyInventory(item, company);
        } 
        catch (exception) {
            throw exception;
        }
    }

    static _addItemToCompanyInventory(item, company) {
        if (this._isItemValid(item)){
            // TODO: add item to co.
            if (item.isDatahub) {
                companyData[company].datahubs[UUID()] = {
                    serialNumber: item.getSerial,
                    mac: item.getMAC,
                    location: null,
                    machine: null
                }
            } else {
                companyData[company].sensors[UUID()] = {
                    serialNumber: item.getSerial,
                    mac: item.getMAC,
                    location: null,
                    machine: null
                }
            }
        } else {
            this._resolveInvalidEntry(item);
        }
    }

    static _resolveInvalidEntry(item) {
        if (item.getSerial() === "" || item.getMAC() === "") throw "blank";
        if (!itemStore[item.getSerial()]) throw "serial";
        if (itemStore[item.getSerial()].mac !== item.getMAC()) throw "mac";
    }

    static _isItemValid(item) {
        if (itemStore[item.getSerial] && itemStore[item.getSerial].mac === item.getMAC) return true;
        return false;
    }
}