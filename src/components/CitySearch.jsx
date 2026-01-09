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
        lineWidth: 0.5
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

            {/* City name on top */}
            {cityName && projectedRoads && (
                <div style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    color: '#704e4e',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {cityName}
                </div>
            )}

            {/* UI in front - Input and control panel toggle */}
            <main style={{ position: 'fixed', top: '3rem', left: 0, right: 0, zIndex: 10, padding: '1rem', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                    {projectedRoads ? (
                        <>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    padding: '0',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'saddlebrown'
                                }}
                            >
                                Search New
                            </button>
                            <ControlPanel
                                settings={settings}
                                setSettings={setSettings}
                                onExportSVG={exportSVG}
                                onExportPNG={exportPNG}
                                isOpen={isOpen}
                                onToggle={togglePanel}
                            />
                        </>
                    ) : (
                        <div className="heading">
                            <a
                                href="https://cityroads.space"
                                style={{
                                    color: '#704e4e',
                                    fontFamily: 'Cursive',
                                    fontSize: '2rem'
                                }}
                            >City Roads</a>
                            <div className="flex-wrapper">
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    placeholder="Enter a city name"
                                    style={{
                                        flex: 1,
                                        maxWidth: '300px',
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
                        </div>
                    )}
                </div>
            </main>



            {/* Footer - credits and attribution */}
            <footer style={{
                position: 'fixed',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem 1.5rem',
                color: 'saddlebrown',
                fontSize: '1rem',
                zIndex: 10
            }}>
                <span>Inspired by <a href="https://anvaka.github.io/city-roads/">Anvaka</a></span>
                <span>|</span>
                <a href="https://github.com/abhinavsingh1311/city-maps">Source Code</a>

            </footer>

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