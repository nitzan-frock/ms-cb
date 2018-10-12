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

    static async getSensors(company_id) {
        const url = `http://localhost:8080/companies/${company_id}/sensors`;
        const sensors = await this._getData(url);

        for (let i = 0; i < sensors.length; i++) {
            const sensor = sensors[i];
            const location_id = sensor.locationId;
            const machine_id = sensor.machineId;
            sensor.location = (await this.getLocations(company_id,location_id))[0].displayName

            if (machine_id) {
                sensor.machines = (
                    await this.getMachines(
                        company_id, 
                        location_id, 
                        sensor.zoneId, 
                        machine_id
                    )
                );
            }
        }
        return sensors;
    }

    static async getDatahubs(company_id) {
        const url = `http://localhost:8080/companies/${company_id}/datahubs`;
        const datahubs = await this._getData(url);
        
        for (let i = 0; i < datahubs.length; i++) {
            let datahub = datahubs[i];
            let location_id = datahub.locationId;
            datahub.location = (await this.getLocations(company_id,location_id))[0].displayName

            if (datahub.machines) {
                for (let j = 0; j < datahub.machines.length; j++) {
                    const machine = datahub.machines[j];
                    datahub.machines[j].displayName = (
                        await this.getMachines(
                            company_id, 
                            location_id, 
                            machine.zoneId, 
                            machine.machineId
                        )
                    )[0].displayName;
                }
            }
        }
        return datahubs;
    }

    static async getLocations(company_id, location_id) {
        let url = `http://localhost:8080/companies/${company_id}/locations`;
        if (location_id) {
            url = `http://localhost:8080/companies/${company_id}/locations?id=${location_id}`
        }
        return await this._getData(url);
    }

    static async getZones(company_id, location_id) {
        const url = `http://localhost:8080/company${company_id}/location${location_id}/zones`;
        return await this._getData(url);
    }

    static async getMachines(company_id, location_id, zone_id, machine_id) {
        let url = `http://localhost:8080/machines?companyId=${company_id}&locationId=${location_id}&zoneId=${zone_id}`;
        if (machine_id) {
            url = `http://localhost:8080/machines?companyId=${company_id}&locationId=${location_id}&zoneId=${zone_id}&id=${machine_id}`;
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
                "Content-type": "application/json; charset=UTF-8"
            }
        })).json();
    }

    static async _putData(url, data){
        return await (await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })).json();
    }

    static async addItemToCompanyInventory(item, company_id) {
        const inventory = await this.getAvailableInventory();
        const isValid = this._isItemValid(item, inventory);
        if (isValid){
            if (item.isDatahub()) await DataTools._addDatahub(item, company_id, inventory);
            else await DataTools._addSensor(item, company_id, inventory);
            return {ok: true, msg: "success"};
        } else {
            const err = this._resolveInvalidEntry(item, inventory);
            return {ok: false, msg: err};
        }
    }

    static async _addSensor(item, company_id, inventory) {
        const postUrl = `http://localhost:8080/sensors`;
        const postItem = {
            serial: item.getSerial(),
            mac: item.getMAC(),
            companyId: company_id,
            locationId: null,
            zoneId: null,
            machineId: null
        };
        await this._postData(postUrl, postItem);
        await DataTools._updateInventory(inventory, item, company_id);
    }

    static async _addDatahub(item, company_id, inventory) {
        const postUrl = `http://localhost:8080/datahubs`;
        const postItem = {
            serial: item.getSerial(),
            mac: item.getMAC(),
            companyId: company_id,
            locationId: null,
            machines: null
        };
        await this._postData(postUrl, postItem);
        await DataTools._updateInventory(inventory, item, company_id);
    }

    static async _updateInventory(inventory, item, company_id) {
        const putUrl = `http://localhost:8080/itemInventory/`;
        const putItem = inventory.filter(unit => {
            if (unit.serial === item.getSerial() && unit.mac === item.getMAC()) {
                unit.companyId = company_id;
                return unit;
            }
        })[0];
        await this._putData((putUrl + putItem.id), putItem);
    }

    static _isItemValid(target, inventory) {
        return inventory.some(item => {
            return item.companyId === null && 
                item.serial === target.getSerial() && 
                item.mac === target.getMAC();
        });
    }

    static _resolveInvalidEntry(target, inventory) {
        if (target.getSerial() === "" || target.getMAC() === "") return "invalid";

        const validSerial = inventory.some(item => {
            if (item.serial !== target.getSerial()) return false;
            return true;
        });

        const validMAC = inventory.some(item => {
            if (validSerial && item.mac !== target.getMAC()) return false;
            return true;
        });

        const unavailable = inventory.some(item => {
            if (validSerial && validMAC && !item.companyId) return false;
            return true;
        });
        
        if (!validSerial) return "serial";
        if (!validMAC) return "mac";
        if (unavailable) return "invalid";
    }   
}