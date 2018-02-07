import * as topojson from "topojson-client";
import { csv, json } from "d3-request";

export const getCountriesCodes = () => {
    return new Promise((resolve, reject) => {
        csv("/iso2codes.csv")
            .get((err, response) => {
                if (err) reject(new Error("Could not load iso codes"));
                resolve(response);
            });
    });
}

export const GetCountriesPowerUsage = () => {
    return new Promise((resolve, reject) => {
        csv("/power_cons.csv")
            .get((err, response) => {
                if (err) reject(new Error("Could not load GDP data"));
                resolve(response);
            });
    });
}

export const getGeom = () => {
    return new Promise((resolve, reject) => {
        json("/world.topo.json")
            .get((err, response) => {
                if (err) reject(new Error("Could not countries geometry"));
                resolve(response);
            });
    });
}

export const getCountriesGeom = () => (new Promise((resolve, reject) => {
    Promise.all([
        getCountriesCodes(),
        GetCountriesPowerUsage(),
        getGeom()
    ])
        .then(([isoCodes, power, json]) => {
            const powerData = power
            .map(({ name, value }) => {
                const powerUsage = value ? +value : null;
                const { code } = isoCodes.find(({ name: codeName, code }) => name.indexOf(codeName) > -1) || {};
                return { name, powerUsage, code };
            })
            .filter(({ code, powerUsage }) => code && powerUsage !== null);

        const topoJSON = topojson.feature(json, json.objects["world"]);

        resolve({
            ...topoJSON,
            features: topoJSON.features
                .map((feature) => {
                    const countryData = powerData.find(({ code }) => code === feature.id);
                    return { ...feature, properties: { ...countryData } };
                })
        });
        })
        .catch(reject);
}));

