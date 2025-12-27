import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LookUpCity from './utils/nominatim';
import GetRoads from './utils/overpass';
import fromLatLongToXY from './utils/projection';
function App() {
  const [count, setCount] = useState(0);
  const [projectedRoads, setProjectedRoads] = useState(null);

  async function call() {
    await LookUpCity("Edmonton");
  }

  async function getcities() {
    const bbox = await LookUpCity("Edmonton");
    const roads = await GetRoads(bbox);
    console.log("roads:", roads);
  }

  async function projectCanvas() {
    const bbox = await LookUpCity("Edmonton");
    const roads = await GetRoads(bbox);
    const projected = fromLatLongToXY(roads, 800, 600);
    console.log("Projected roads:", projected);
    setProjectedRoads(projected);
    projected.forEach(proj => {
      proj.canvasGeometry
    });
    return projected;
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={call}>Call the api</button>
        <button onClick={getcities}>Get the cities</button>
        <button onClick={projectCanvas}>Render the city</button>
      </div>
      <div className="card-body">
        {projectedRoads &&
          <p> Loaded {projectedRoads.length} roads</p>}
      </div>
    </>
  )
}

export default App
