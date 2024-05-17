async function fetchData() {
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('il y a une erreur', error);
        return null;
    }
}

function processData(geoData) {
    return geoData.features.map(feature => ({
        coordinates: feature.geometry.coordinates,
        magnitude: feature.properties.mag,
        time: feature.properties.time
    }));
}

function plotEarthquakeMap(earthquakeData) {
    const trace = {
        type: 'scattergeo',
        mode: 'markers',
        lon: earthquakeData.map(d => d.coordinates[0]),
        lat: earthquakeData.map(d => d.coordinates[1]),
        text: earthquakeData.map(d => `Magnitude: ${d.magnitude}<br>Time: ${new Date(d.time)}`),
        marker: {
            size: earthquakeData.map(d => d.magnitude * 5),
            color: earthquakeData.map(d => d.magnitude),
            colorscale: 'brown',
            colorbar: {
                title: 'Magnitude'
            }
        }
    };
    const layout = {
        title: 'Global Earthquakes Visualization',
        geo: {
            scope: 'world',
            projection: {
                type: 'natural earth'
            },
            showland: true,
            landcolor: 'rgb(243, 243, 243)',
            countrycolor: 'rgb(204, 204, 204)',
        }
    };
    Plotly.newPlot('earthquakePlot', [trace], layout);
}

function plotMagnitudeHistogram(earthquakeData) {
    const magnitudes = earthquakeData.map(d => d.magnitude);
    const trace = {
        x: magnitudes,
        type: 'histogram',
        marker: {
            color: 'red'
        }
    };
    const layout = {
        title: 'Histogram of Earthquake Magnitudes',
        xaxis: { title: 'Magnitude' },
        yaxis: { title: 'Frequency' }
    };
    Plotly.newPlot('magnitudeHistogram', [trace], layout);
}

function plotTimeSeries(earthquakeData) {
    const dates = earthquakeData.map(d => new Date(d.time));
    const trace = {
        x: dates,
        type: 'scatter',
        mode: 'lines',
        line: {
            color: 'green'
        }
    };
    const layout = {
        title: 'Daily Earthquakes Frequency',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Number of Earthquakes' }
    };
    Plotly.newPlot('timeSeries', [trace], layout);
}

function plotMagnitudeDepthScatter(earthquakeData) {
    const magnitudes = earthquakeData.map(d => d.magnitude);
    const depths = earthquakeData.map(d => d.coordinates[2]);
    const trace = {
        x: magnitudes,
        y: depths,
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: 'purple'
        }
    };
    const layout = {
        title: 'Magnitude vs Depth analysis',
        xaxis: { title: 'Magnitude' },
        yaxis: { title: 'Depth (km)' }
    };
    Plotly.newPlot('magnitudeDepthScatter', [trace], layout);
}

fetchData()
    .then(rawData => processData(rawData))
    .then(processedData => {
        plotEarthquakeMap(processedData);
        plotMagnitudeHistogram(processedData);
        plotTimeSeries(processedData);
        plotMagnitudeDepthScatter(processedData);
    })
    .catch(error => console.error(error));
