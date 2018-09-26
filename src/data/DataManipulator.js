import UUID from 'uuid/v1';

const fs = require('fs');

export default class DataManipulator {
    constructor(source){
        this.source = source;
    }
    appendToCompany = (company, item) => {
        let companyData = this.readFile()[company];
        if (item.isDatahub) {
            companyData.datahubs[UUID()] = {
                serialNumber: item.getSerial,
                mac: item.getMAC,
                location: null,
                machine: null
            }
        } else {
            companyData.sensors[UUID()] = {
                serialNumber: item.getSerial,
                mac: item.getMAC,
                location: null,
                machine: null
            }
        }
        this.writeFile(companyData);
    }

    readFile = () => {
        fs.readFile(this.source, 'utf8', (err, file) => {
            if (err) console.log(err);
            else {
                return JSON.parse(file);
            }
        });
    }
    
    writeFile = (data) => {
        json = JSON.stringify(data);
        fs.writeFile(this.source, json, 'utf8', callback);
    }
}