import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LookUpCity from './utils/nominatim';
import GetRoads from './utils/overpass';

function App() {
  const [count, setCount] = useState(0);

  async function call() {
    await LookUpCity("Edmonton");
  }

  async function getcities() {
    const bbox = await LookUpCity("Edmonton");
    const roads = await GetRoads(bbox);
    console.log("roads:", roads);
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
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
