async function fetchData() {
    try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
    }
}

function processData(data) {
    return data.features.map(earthquake => ({
        latitude: earthquake.geometry.coordinates[1],
        longitude: earthquake.geometry.coordinates[0],
        magnitude: earthquake.properties.mag,
        time: new Date(earthquake.properties.time),
        depth: earthquake.geometry.coordinates[2]
    }));
}

async function visualizeData() {
    const data = await fetchData();
    const processedData = processData(data);

    const mapLayout = {
        title: 'Localisation des séismes',
        geo: {
            projection: {
                type: 'natural earth'
            }
        }
    };
    const mapData = [{
        type: 'scattergeo',
        mode: 'markers',
        locations: processedData.map(earthquake => [earthquake.longitude, earthquake.latitude]),
        marker: {
            size: processedData.map(earthquake => earthquake.magnitude * 5),
            color: processedData.map(earthquake => earthquake.magnitude),
            colorscale: 'Viridis',
            colorbar: {
                title: 'Magnitude'
            }
        }
    }];
    Plotly.newPlot('earthquakePlot', mapData, mapLayout);

    const magnitudeHistogramData = [{
        x: processedData.map(earthquake => earthquake.magnitude),
        type: 'histogram'
    }];
    const magnitudeHistogramLayout = {
        title: 'Distribution des magnitudes des séismes',
        xaxis: {
            title: 'Magnitude'
        },
        yaxis: {
            title: 'Nombre de séismes'
        }
    };
    Plotly.newPlot('magnitudeHistogram', magnitudeHistogramData, magnitudeHistogramLayout);

    const timeSeriesData = [{
        x: processedData.map(earthquake => earthquake.time),
        type: 'histogram',
        histfunc: 'count',
        marker: {
            color: 'blue'
        }
    }];
    const timeSeriesLayout = {
        title: 'Nombre de séismes par jour',
        xaxis: {
            title: 'Date'
        },
        yaxis: {
            title: 'Nombre de séismes'
        }
    };
    Plotly.newPlot('timeSeries', timeSeriesData, timeSeriesLayout);

    const magnitudeDepthScatterData = [{
        x: processedData.map(earthquake => earthquake.magnitude),
        y: processedData.map(earthquake => earthquake.depth),
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: 'red'
        }
    }];
    const magnitudeDepthScatterLayout = {
        title: 'Magnitude vs Profondeur',
        xaxis: {
            title: 'Magnitude'
        },
        yaxis: {
            title: 'Profondeur (km)'
        }
    };
    Plotly.newPlot('magnitudeDepthScatter', magnitudeDepthScatterData, magnitudeDepthScatterLayout);
}

visualizeData();
