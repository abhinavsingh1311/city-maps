import React, { useRef, useState } from "react";
import LookUpCity from "../utils/nominatim";
import GetRoads from "../utils/overpass";
import useThreeScene from "../hooks/useThreeScene";
import ControlPanel from "./ControlPanel";

const CitySearch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [projectedRoads, setProjectedRoads] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const canvasRef = useRef(null);
    const [cityName, setCityName] = useState('');
    const [settings, setSettings] = useState({
        streetColor: '#1a1a1a',
        bgColor: "transparent",
        lineWidth: 2
    });

    const { exportPNG, exportSVG } = useThreeScene(canvasRef, projectedRoads, settings, cityName);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    }

    async function searchCity() {
        try {
            setIsLoading(true);
            setProjectedRoads(null);
            const city = document.getElementById("city").value;
            setCityName(city);
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
        <>
            {/* Canvas behind everything */}
            <div
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 0
                }}
            />

            {/* UI in front */}
            <main style={{ position: 'relative', zIndex: 10, padding: '2rem', pointerEvents: 'none' }}>
                <h1 style={{ marginBottom: '1.5rem', pointerEvents: 'auto', color: '#704e4e' }}>City Roads</h1>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', pointerEvents: 'auto', justifyContent: 'center' }}>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        placeholder="Enter a city name"
                        style={{
                            flex: 1,
                            maxWidth: '400px',
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
            </main>
            {projectedRoads && (
                <ControlPanel
                    settings={settings}
                    setSettings={setSettings}
                    onExportSVG={exportSVG}
                    onExportPNG={exportPNG}
                    isOpen={isOpen}
                    onToggle={togglePanel}
                />
            )}
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
        </>
    );
};

export default CitySearch;