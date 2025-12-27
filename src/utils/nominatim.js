const EndPoint = "https://nominatim.openstreetmap.org/search";

async function LookUpCity(q) {
    try {
        const response = await fetch(`${EndPoint}?q=${q}&format=json&addressdetails=1&limit=1`);
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