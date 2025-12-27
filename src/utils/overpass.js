const endpoint = "https://overpass-api.de/api/interpreter";


async function GetRoads(bboxQuery) {
    try {
        //south north west east
        const SNWE = `${bboxQuery[0]},${bboxQuery[2]},${bboxQuery[1]},${bboxQuery[3]}`;
        var query = `
[out:json][timeout:1000];
(
way["highway"](${SNWE});
);
out geom;`;
        console.log("Query being sent:", query);
        console.log("SNWE:", SNWE);

        var result = await fetch(`${endpoint}`, {
            method: "POST",
            body: query,
        }
        )

        if (!result.ok) {
            throw new Error(`Result returned with response code of ${result.status}`);
        }

        const data = await result.json();

        if (data == null) {
            throw new Error("Data is empty");

        }

        console.log(JSON.stringify(data, null, 2));
        return data;
    }
    catch (ex) {
        throw new Error(`Error getting the response from  overpass Api: ${ex.message}`);
    }
};

export default GetRoads;