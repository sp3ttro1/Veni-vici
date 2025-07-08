import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentDog, setCurrentDog] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  const getRandomDog = async () => {
    let dog = null;
    let attempts = 0;

    while (!dog && attempts < 20) {
      const res = await fetch(
        "https://api.thedogapi.com/v1/images/search?has_breeds=1",
        {
          headers: {
            "x-api-key":
              "live_O2I9PFHQNlMPokEmRa8i6Upnyd6uFdmJTkMmVk6SrGjemtOis4qb3YmQiymxIwMO",
          },
        }
      );

      const data = await res.json();
      const imageData = data[0];
      const breed = imageData?.breeds?.[0];

      if (breed && imageData.url) {
        const group = breed.breed_group || "Unknown Group";
        const weight = breed.weight?.metric || "Unknown Weight";
        const life = breed.life_span || "Unknown Lifespan";

        const isBanned =
          banList.includes(group) ||
          banList.includes(weight) ||
          banList.includes(life);

        if (!isBanned) {
          dog = {
            name: breed.name,
            group,
            weight,
            life,
            image: imageData.url,
          };
        }
      }

      attempts++;
    }

    if (dog) {
      setCurrentDog(dog);
      setHistory((prev) => [dog, ...prev]);
    }
  };

  useEffect(() => {
    getRandomDog();
  }, []);

  const handleBan = (value) => {
    if (!banList.includes(value)) {
      setBanList([...banList, value]);
    }
  };

  const removeBan = (value) => {
    setBanList(banList.filter((v) => v !== value));
  };

  return (
    <div className="app">
      <div className="history">
        <h3>History</h3>
        {history.length === 0 && <p>No history yet</p>}
        <div className="history-list">
          {history.map((dog, index) => (
            <div key={index} className="history-card">
              <img src={dog.image} alt={dog.name} />
              <p><strong>{dog.name}</strong></p>
              <p>{dog.group}</p>
              <p>{dog.weight} lbs</p>
              <p>{dog.life}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="main-card">
        <h1>Veni Vici!</h1>
        <p>Discover dogs from your wildest dreams 🐶</p>

        {currentDog ? (
          <>
            <h2>{currentDog.name}</h2>
            <div className="tags">
              <button onClick={() => handleBan(currentDog.group)}>
                {currentDog.group}
              </button>
              <button onClick={() => handleBan(currentDog.weight)}>
                {currentDog.weight} lbs
              </button>
              <button onClick={() => handleBan(currentDog.life)}>
                {currentDog.life}
              </button>
            </div>
            <img
              src={currentDog.image}
              alt={currentDog.name}
              className="dog-image"
            />
          </>
        ) : (
          <p>No dogs match your current filters. Try clearing your ban list.</p>
        )}

        <button className="discover-btn" onClick={getRandomDog}>
          🐾 Discover!
        </button>
      </div>

      <div className="ban-list">
        <h3>Ban List</h3>
        {banList.length === 0 && <p>No banned values yet</p>}
        <div className="ban-tags">
          {banList.map((item) => (
            <button
              key={item}
              onClick={() => removeBan(item)}
              className="banned"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;