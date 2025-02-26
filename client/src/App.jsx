import React, { useEffect, useState } from 'react';
import Customizer from './pages/Customizer';
import Home from './pages/Home';
import Canvas from './canvas';

function App() {
  const [isFirstPageLoaded, setFirstPageLoaded] = useState(false);

  useEffect(() => {
    // Simulating an asynchronous operation (e.g., fetching data)
    const fetchData = async () => {
      // Your logic for fetching data goes here

      // Once data is fetched or any other conditions are met
      setFirstPageLoaded(true);
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <main className="app transition-all ease-in">
      {isFirstPageLoaded && <Home />}
      <Canvas />
      {isFirstPageLoaded && <Customizer />}
    </main>
  );
}

export default App;
