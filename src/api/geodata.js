import * as topojson from 'topojson-client';
import { csv, json } from 'd3-request';

export const getCountriesCodes = () => new Promise((resolve, reject) => {
  csv(`${process.env.PUBLIC_URL}/iso2codes.csv`)
    .get((err, response) => {
      if (err) reject(new Error('Could not load iso codes'));
      resolve(response);
    });
});

export const GetCountriesPowerUsage = () => new Promise((resolve, reject) => {
  csv(`${process.env.PUBLIC_URL}/power_cons.csv`)
    .get((err, response) => {
      if (err) reject(new Error('Could not load GDP data'));
      resolve(response);
    });
});

export const getGeom = () => new Promise((resolve, reject) => {
  json(`${process.env.PUBLIC_URL}/world.topo.json`)
    .get((err, response) => {
      if (err) reject(new Error('Could not countries geometry'));
      resolve(response);
    });
});

export const getCountriesGeom = () => (new Promise((resolve, reject) => {
  Promise.all([
    getCountriesCodes(),
    GetCountriesPowerUsage(),
    getGeom(),
  ])
    .then(([isoCodes, power, geojson]) => {
      const powerData = power
        .map(({ name, value }) => {
          const powerUsage = value ? +value : null;
          const { code } = isoCodes.find(({ name: codeName }) => name.indexOf(codeName) > -1) || {};
          return { name, powerUsage, code };
        })
        .filter(({ code, powerUsage }) => code && powerUsage !== null);

      const topoJSON = topojson.feature(geojson, geojson.objects.world);

      resolve({
        ...topoJSON,
        features: topoJSON.features
          .map((feature) => {
            const countryData = powerData.find(({ code }) => code === feature.id);
            return { ...feature, properties: { ...countryData } };
          }),
      });
    })
    .catch(reject);
}));

