const EndPoint = "https://nominatim.openstreetmap.org/search";

async function LookUpCity(q) {
    try {
        const response = await fetch(
            `${EndPoint}?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=1`,
            {
                headers: {
                    'User-Agent': 'CityRoadsApp/1.0 (singhabhinav1311@gmail.com)'
                }
            }
        );
        if (!response.ok) {
            throw new Error(`Response was not ok ${response.status}`);
        }
        const data = await response.json();
        if (data[0] == null) {
            throw new Error("No data returned for the search");

        }
        const extract = data[0].boundingbox;
        console.log("The response is:", data);
        console.log(`The bounding box info:${extract}`);
        return extract;
    }
    catch (ex) {
        throw new Error(`Error fetching city details from Api : ${ex.message}`);
    }
}

export default LookUpCity;

// const EndPoint = "https://photon.komoot.io/api";

// async function LookUpCity(q) {
//     const response = await fetch(`${EndPoint}?q=${encodeURIComponent(q)}&limit=1`);
//     const data = await response.json();

//     if (!data.features?.[0]) {
//         throw new Error("No data returned for the search");
//     }

//     const feature = data.features[0];

//     if (feature.properties.extent) {
//         const bbox = feature.properties.extent;
//         console.log("Photon extent:", bbox);
//     }

//     // Fallback: create bbox from point with ~5km radius
//     const [lon, lat] = feature.geometry.coordinates;
//     const offset = 0.05;
//     return [lat - offset, lat + offset, lon - offset, lon + offset];
// }
// export default LookUpCity