import React, { useEffect } from "react";
import generateMap from "./noise_generator/exportNoise";
function App() {
  const canvasRef = React.useRef(null);

  const [seed, setSeed] = React.useState(Math.round(Math.random() * 100000));
  const [size, setSize] = React.useState([380, 200]);
  const [octaves, setOctaves] = React.useState(8);
  const [persistence, setPersistence] = React.useState(0.5);
  const [lacunarity, setLacunarity] = React.useState(2);
  const [amplitude, setAmplitude] = React.useState(1);
  const [frequency, setFrequency] = React.useState(0.01);
  const [smoothFactor, setSmoothFactor] = React.useState(0);
  const [type, setType] = React.useState("simplex");
  const [worldName, setWorldName] = React.useState(null);

  const [map, setMap] = React.useState(null);

  // This app will be a noise generator that will generate a noise map
  // The user can
  // 1) Input the size of the file (width and height in pixels)
  // 2) Input the number of octaves
  // 3) Input the persistence
  // 4) Input the lacunarity
  // 5) Input the amplitude
  // 6) Input the frequency
  // 7) Input the seed
  // 8) Input the type of noise (simplex, perlin.)

  // The app will then generate a noise map and display it to the user as a canvas which they can save as an image

  useEffect(() => {
    console.log("Map changed");
    function initCanvas() {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const starterMap = generateMap(
        seed,
        size,
        octaves,
        persistence,
        lacunarity,
        amplitude,
        frequency,
        smoothFactor,
        type
      );
      setMap(starterMap);
      for (let x = 0; x < size[0]; x++) {
        for (let y = 0; y < size[1]; y++) {
          const value = starterMap[x][y];
          if (value >= 0 && value <= 0.31) {
            ctx.fillStyle = "#FFFFFF";
          }
          if (value > 0.31 && value <= 0.4) {
            ctx.fillStyle = "#CCCCCC";
          }
          if (value > 0.4 && value <= 0.75) {
            ctx.fillStyle = "#000000";
          }
          if (value > 0.75 && value <= 0.8) {
            ctx.fillStyle = "#333333";
          }
          if (value > 0.8 && value <= 1) {
            ctx.fillStyle = "#999999";
          }
          ctx.fillRect(x, y, 1, 1);
        }
      }
      const width = canvas.width;
      const height = canvas.height;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    }
    initCanvas();
  }, [
    seed,
    size,
    octaves,
    persistence,
    lacunarity,
    amplitude,
    frequency,
    smoothFactor,
    type,
  ]);

  function saveAsFile() {
    const canvas = canvasRef.current;
    const image = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    if (!worldName) {
      link.download = `noise_map_${seed}_${size[0]}x${size[1]}.png`;
    } else {
      link.download = `${worldName}.png`;
    }
    link.href = image;
    link.click();
  }

  return (
    // Center the canvas
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <br />
      <div>
        <canvas
          // Min width and height of 200.
          width={size[0] > 200 ? size[0] : 200}
          height={size[1] > 200 ? size[1] : 200}
          ref={canvasRef}
          style={{ border: "1px solid black" }}
        />
        <br />
        <input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="600"
          value={size[0]}
          onChange={(e) => setSize([e.target.value, size[1]])}
        />
        <input
          type="number"
          min="1"
          max="600"
          value={size[1]}
          onChange={(e) => setSize([size[0], e.target.value])}
        />
        <br />
        {/* Slider for Octaves, 1-16 */}
        <label for="octaves">Octaves: {octaves}</label>
        <input
          type="range"
          min={1}
          max={16}
          step={1}
          value={octaves}
          class="slider"
          id="octaves"
          onChange={(e) => setOctaves(e.target.value)}
        />
        {/* Slider for Persistence, 0-1 */}
        <label for="persistence">Persistence: {persistence}</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={persistence}
          class="slider"
          id="persistence"
          onChange={(e) => setPersistence(e.target.value)}
        />
        <br />
        {/* Slider for Lacunarity, 1-4 */}
        <label for="lacunarity">Lacunarity: {lacunarity}</label>
        <input
          type="range"
          min={1}
          max={4}
          step={0.01}
          value={lacunarity}
          class="slider"
          id="lacunarity"
          onChange={(e) => setLacunarity(e.target.value)}
        />
        {/* Slider for Amplitude, 0-1 */}
        <label for="amplitude">Smoothness: {smoothFactor}</label>
        <input
          type="range"
          min={0}
          max={3}
          step={0.01}
          value={smoothFactor}
          class="slider"
          id="amplitude"
          onChange={(e) => setSmoothFactor(e.target.value)}
        />
        <br />
        {/* Slider for Frequency, 0-1 */}
        <label for="frequency">Frequency: {frequency}</label>
        <input
          type="range"
          min={0}
          max={0.05}
          step={0.001}
          value={frequency}
          class="slider"
          id="frequency"
          onChange={(e) => setFrequency(e.target.value)}
        />
        <br />
        {/* Select Type (as well as brief description) */}
        <label for="type">Type: </label>
        <select
          className="form-select"
          name="type"
          id="type"
          defaultValue={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="simplex">Simplex</option>
          <option value="perlin">Perlin</option>
        </select>
        <br />
        <br />
        <br />
        {/* World Name */}
        <label for="worldName">World Name: </label>
        <input
          type="text"
          value={worldName}
          onChange={(e) => setWorldName(e.target.value)}
        />
        <br />
        <button onClick={saveAsFile}>Save as File</button>
      </div>
    </div>
  );
}

export default App;
