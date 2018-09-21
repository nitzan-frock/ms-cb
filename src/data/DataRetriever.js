import userData from './users/userData.json';
import companyData from './companies/companyData.json';


class DataRetriever {
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
}

export default DataRetriever;