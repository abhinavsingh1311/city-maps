import mercator from "mercator-projection";

function fromLatLongToXY(roadsData, canvasWidth, canvasHeight) {
    if (!roadsData) {
        throw new Error("No road data to project");

    }

    const projectedRoads = roadsData.elements.map(ele => {
        const projectedGeometry = ele.geometry.map(points => {
            return mercator.fromLatLngToPoint({
                lat: points.lat,
                lng: points.lon
            });
        });
        return {
            ...ele,
            projectedGeometry
        };
    });

    //find bounds for geometry

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    projectedRoads.forEach(road => {
        road.projectedGeometry.forEach(point => {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        });
    });

    // to canvas dimensions

    const scaleX = canvasWidth / (maxX - minX);
    const scaleY = canvasHeight / (maxX - minY);

    return projectedRoads.map(road => ({
        ...road,
        canvasGeometry: road.projectedGeometry.map(point => ({
            x: (point.x - minX) * scaleX,
            y: (point.y - minY) * scaleY
        }))
    }));
}

export default fromLatLongToXY;