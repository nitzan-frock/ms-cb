export default class DataTools {
    static async _getData(url) {
        return await (await fetch(url)).json();
    }

    static async getUser(user_id) {
        const url = `http://localhost:8080/users/${user_id}`;
        return await this._getData(url);
    }

    static async getCompany(company_id) {
        const url = `http://localhost:8080/companies/${company_id}`;
        return await this._getData(url); 
    }

    static async getCompanyName(company_id) {
        return (await this.getCompany(company_id)).displayName;
    }

    static async getSensors({company_id}) {
        const url = `http://localhost:8080/companies/${company_id}/sensors`;
        const sensors = await this._getData(url);

        for (let i = 0; i < sensors.length; i++) {
            const sensor = sensors[i];
            const location_id = sensor.locationId;
            const machine_id = sensor.machineId;
            sensor.location = location_id ? (await this.getLocations({location_id}))[0].displayName : null;

            if (machine_id) {
                sensor.machines = await this.getMachines({machine_id});
            }
        }
        return sensors;
    }

    static async getDatahubs({company_id, location_id}) {
        let url = `http://localhost:8080/companies/${company_id}/datahubs`;
        
        if (location_id) {
            url = `http://localhost:8080/datahubs?locationId=${location_id}`;
        }

        const datahubs = await this._getData(url);
        
        for (let i = 0; i < datahubs.length; i++) {
            let datahub = datahubs[i];
            let location_id = datahub.locationId;
            datahub.location = location_id ? (await this.getLocations({location_id}))[0].displayName : null;

            if (datahub.machines) {
                for (let j = 0; j < datahub.machines.length; j++) {
                    const machine = datahub.machines[j];
                    datahub.machines[j].displayName = (
                        await this.getMachines({
                            machine_id: machine.machineId
                        })
                    )[0].displayName;
                }
            }
        }
        return datahubs;
    }

    static async getLocations({company_id, location_id}) {
        let url = `http://localhost:8080/companies/${company_id}/locations`;
        if (location_id) {
            url = `http://localhost:8080/locations?id=${location_id}`
        }
        return await this._getData(url);
    }

    static async getZones({location_id}) {
        const url = `http://localhost:8080/zones?&locationId=${location_id}`;
        return await this._getData(url);
    }

    static async getMachines({location_id, zone_id, datahub_serial, machine_id}) {
        let url = `http://localhost:8080/machines?locationId=${location_id}`;

        if (zone_id) {
            url = `http://localhost:8080/machines?&zoneId=${zone_id}`;
        } else if (datahub_serial) {
            url = `http://localhost:8080/machines?datahubSerial=${datahub_serial}`;
        } else if (machine_id) {
            url = `http://localhost:8080/machines?id=${machine_id}`;
        }
        return await this._getData(url);
    }

    static async getAvailableInventory() {
        const url = `http://localhost:8080/itemInventory`;
        return await this._getData(url);
    }

    static async _postData(url, data) {
        return await (await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })).json();
    }

    static async _putData(url, data){
        return await (await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })).json();
    }

    static async _patchData(url, data){
        return await (await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })).json();
    }

    /******************************************************************
     *
     * Functions to register items to Database
     *  
     ******************************************************************/

    static async registerItemToCompany({serial, mac}, company_id) {
        const inventory = await this.getAvailableInventory();
        const isValid = this._isItemValid({serial, mac}, inventory);
        if (isValid){
            const isDatahub = serial.match(/dhb/i);
            if (isDatahub) {
                const datahub = {
                    serial: serial,
                    mac: mac,
                    companyId: company_id,
                    locationId: null,
                    machines: []
                }
                await DataTools._registerDatahub(datahub, company_id, inventory);
            } else {
                const sensor = {
                    serial: serial,
                    mac: mac,
                    companyId: company_id,
                    locationId: null,
                    zoneId: null,
                    machineId: null
                }
                await DataTools._registerSensor(sensor, company_id, inventory);
            }
            return {ok: true, body: "success"};
        } else {
            const invalidFields = this._resolveInvalidFields({serial, mac}, inventory);
            return {ok: false, body: invalidFields};
        }
    }

    static async _registerSensor(sensor, company_id, inventory) {
        const postUrl = `http://localhost:8080/sensors`;
        await this._postData(postUrl, sensor);
        await DataTools._updateInventory(inventory, sensor, company_id);
    }

    static async _registerDatahub(datahub, company_id, inventory) {
        const postUrl = `http://localhost:8080/datahubs`;
        await this._postData(postUrl, datahub);
        await this._updateInventory(inventory, datahub, company_id);
    }

    static async _updateInventory(inventory, item, company_id) {
        const url = `http://localhost:8080/itemInventory/`;
        const putItem = inventory.filter(unit => {
            if (unit.serial === item.serial && unit.mac === item.mac) {
                unit.companyId = company_id;
                return unit;
            }
        })[0];
        await this._putData((url + putItem.id), putItem);
    }

    static _isItemValid({serial, mac}, inventory) {
        return inventory.some(item => {
            return item.companyId === null && 
                item.serial === serial && 
                item.mac === mac;
        });
    }

    static _resolveInvalidFields(fields, inventory) {
        const emptyFields = this._checkEmptyFields(fields);
        if (emptyFields) {return emptyFields};

        if (this._isItemAssignedToCompany(inventory, fields)) { 
            return {
                invalidFields: Object.keys(fields), 
                message: "This item is already assigned to a company."
            }
        }

        return this._getInvalidFields(inventory, fields);
    }

    static _checkEmptyFields(fields) {
        const emptyFields = [];
        Object.keys(fields).forEach(field => {
            if (fields[field] === "") emptyFields.push(field);
        });
        return emptyFields.length 
            ? {invalidFields: emptyFields, message: "Cannot have empty fields."}
            : null;
    } 

    static _isItemAssignedToCompany(inventory, fields) {
        let isAssigned = false;
        Object.keys(fields).forEach(field => {
            if (isAssigned) return;
            inventory.forEach(item => {
                if (item.companyId && item[field] === fields[field]) {
                    isAssigned = true;
                    return;
                }
            });
        });
        return isAssigned;
    }

    static _getInvalidFields(inventory, fields) {
        const invalidFields = [];        
        Object.keys(fields).forEach(field => {
            inventory.forEach(item => {
                if (item[field] !== fields[field]) {
                    invalidFields.push(field);
                }
            });
        });
        return {invalidFields, message: "The marked fields do not match our records."};
    }

    /******************************************************************
     *
     * Add new locations, zones, machines
     *  
     ******************************************************************/

    static async addLocation(name, description, company_id) {
        let url = `http://localhost:8080/locations`;
        const location = {
            displayName: name,
            description,
            companyId: company_id,
            dataType: "location",
            datahubCount: 0,
            zoneCount: 0
        }
        await this._postData(url, location);
        return {ok: true};
    }

    static async addZone(name, description, location) {
        const url = `http://localhost:8080/zones`;
        const zone = {
            displayName: name,
            description,
            locationId: location.id,
            dataType: "zone",
            machineCount: 0
        }
        const response = await this._postData(url, zone);

        if (Object.keys(response).length) {
            await this.updateLocation(location, 'add', {zone: true})
            return {ok: true, body: "success"};
        }
        return {ok: false, body: "Failed to add zone."}
    }

    /******************************************************************
     *
     * Update database records.
     *  
     ******************************************************************/

    static async updateLocation(location, option, {datahub, zone}) {
        const url = `http://localhost:8080/locations/`;

        switch (option) {
            case 'add':
                if (datahub) {
                    location.datahubCount = location.datahubCount+1;
                }
                if (zone) {
                    location.zoneCount = location.zoneCount+1;
                }
                break;
            case 'remove':
                if (datahub) {
                    location.datahubCount = location.datahubCount-1;
                }
                if (zone) {
                    location.zoneCount = location.zoneCount-1;
                }
                break;
            default:
                throw 'Must provide an option: "add" or "remove"';
                
        }
        let response = await this._putData((url+location.id), location);

        if (Object.keys(response).length) {
            return {ok: true, body: "success"};
        }
        return {ok: false, body: "Failed to update location."}
    }

    static async updateDatahub(datahub, option, {location, machine, displayName}) {
        const url = `http://localhost:8080/datahubs/`;

        switch (option) {
            case 'add':
                if (location) {
                    datahub.locationId = location.id;
                    datahub.location = location.displayName;
                }
                if (machine) {
                    datahub.machines.push(machine);
                }
                if (displayName) {
                    datahub.displayName = displayName;
                }
                break;
            case 'remove':
                if (location) {
                    datahub.locationId = null;
                    datahub.location = null;
                }
                if (machine) {
                    datahub.machines = datahub.machines.filter(machine => {
                        if (machine.machineId !== machine.id) return machine;
                    });
                }
                break;
            default:
                throw 'Must provide an option: "add" or "remove"';
        }
        const response = await this._putData((url+datahub.id), datahub);

        if (Object.keys(response).length) {
            this.updateLocation(
                location, 
                'add', 
                {datahub: true}
            );
            return {ok: true, body: "success"};
        }
        return {ok: false, body: "Failed to add datahub to location."}
    }   
}