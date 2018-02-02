import * as topojson from "topojson-client";

export const getCountriesGeom = () => (new Promise((resolve, reject) => {
    fetch('/world-110m.json')
        .then((response) => {
            if (response.status !== 200) {
                reject(new Error("Could not load data"));
            }
            response.json().then((data) => {
                const topoJSON = topojson.feature(data, data.objects["countries"]);
                resolve(topoJSON);
            });
        })
        .catch(reject);
}));