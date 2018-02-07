import { scaleOrdinal } from "d3-scale";
import { extent } from "d3-array";

const percentage = [0, 25, 50, 75, 90];

export const getPowerUsageScale = (features) => {
    return scaleOrdinal()
        .domain(percentage)
        .range(["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"])

};

export const sortCountriesByPercentage = (features) => {
    const maxValue = extent(features.map(c => c.properties.powerUsage || 0))[1];
    return features.reduce((sorted, country) => {
        const value = country.properties.powerUsage || 0;
        const percent = (value / maxValue) * 100;
        let percentageKey = percentage.find(v => percent <= v);
        // If key wasn't found, the value is in the top 10% power usage
        (percentageKey === undefined) && (percentageKey = 90);
        sorted[percentageKey].push(country);
        return sorted;
    }, {
            0: [],
            25: [],
            50: [],
            75: [],
            90: []
        });
};