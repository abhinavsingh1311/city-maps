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
    // const padding = 0.9;
    // const scaleX = (canvasWidth * padding) / (maxX - minX);
    // const scaleY = (canvasHeight * padding) / (maxY - minY);
    // In projection.js, use uniform scale:
    const scale = Math.min(
        canvasWidth / (maxX - minX),
        canvasHeight / (maxY - minY)
    );

    // Center the map
    const offsetX = (canvasWidth - (maxX - minX) * scale) / 2;
    const offsetY = (canvasHeight - (maxY - minY) * scale) / 2;

    return projectedRoads.map(road => ({
        ...road,
        canvasGeometry: road.projectedGeometry.map(point => ({
            x: (point.x - minX) * scale + offsetX,
            y: (point.y - minY) * scale + offsetY
        }))
    }));
}

export default fromLatLongToXY;