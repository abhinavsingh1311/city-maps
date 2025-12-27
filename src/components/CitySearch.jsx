import React, { useRef, useState } from "react";
import LookUpCity from "../utils/nominatim";
import GetRoads from "../utils/overpass";
import useThreeScene from "../hooks/useThreeScene";

const CitySearch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [projectedRoads, setProjectedRoads] = useState(null);
    const canvasRef = useRef(null);

    useThreeScene(canvasRef, projectedRoads);

    async function searchCity() {
        try {
            setIsLoading(true);
            setProjectedRoads(null);
            let city = document.getElementById("city").value;
            var bboxquery = await LookUpCity(city);
            var roadData = await GetRoads(bboxquery);
            setProjectedRoads(roadData);
        } catch (e) {
            alert("Error loading the map:", e.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <p style={{ color: 'white', fontSize: '1.2rem' }}>Loading map data...</p>
                </div>
            )}

            <h1 style={{ marginBottom: '1.5rem', textAlign: "center" }}>City Roads</h1>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="Enter a city name"
                    style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        outline: 'none'
                    }}
                />
                <button
                    type="submit"
                    onClick={searchCity}
                    disabled={isLoading}
                    style={{ padding: '0.75rem 1.5rem' }}
                >
                    {isLoading ? 'Loading' : 'Search'}
                </button>
            </div>

            <div
                ref={canvasRef}
                style={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    margin: '0 auto'
                }}
            />

            {!projectedRoads && !isLoading && (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '1rem' }}>
                    Search for a city to see its roads
                </p>
            )}
        </main>
    );
};

export default CitySearch;