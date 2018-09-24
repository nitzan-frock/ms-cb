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

    static addItem(company, item){
        if (!itemStore[item.getSerial]) return "invalid-serial";
        if (itemStore[item.getSerial].mac !== item.getMac) return "invalid-mac";

        //todo add item to company
    }
}