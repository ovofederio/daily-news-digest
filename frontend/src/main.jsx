import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const categories = ["politics", "sports", "pop culture", "technology"];
const emojiMap = {
  "politics": "🗳️",
  "sports": "🏀",
  "pop culture": "🎬",
  "technology": "🤖"
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function App() {
  const [news, setNews] = useState({});
  const [favorites, setFavorites] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    categories.forEach(topic => {
      fetch(`${BACKEND_URL}/api/news?topic=${topic}`)
        .then(res => res.json())
        .then(data => {
          setNews(prev => ({ ...prev, [topic]: data.headlines }));
        });
    });
  }, []);

  const toggleFavorite = (topic, title) => {
    setFavorites(prev => {
      const updated = { ...prev };
      updated[title] = !prev[title];
      return updated;
    });
  };

  return (
    <div style={{
      backgroundColor: darkMode ? "#111" : "#fff",
      color: darkMode ? "#fff" : "#000",
      padding: "1rem",
      fontFamily: "sans-serif"
    }}>
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle {darkMode ? "Light" : "Dark"} Mode 🌓
      </button>
      {categories.map(topic => (
        <div key={topic}>
          <h2>{emojiMap[topic]} {topic.toUpperCase()}</h2>
          {news[topic]?.map((item, i) => (
            <div key={i} style={{ borderBottom: "1px solid #ccc", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
              <strong>{item.title}</strong>
              <p>{item.summary}</p>
              <div>
                <a href={`https://www.tiktok.com/search?q=${encodeURIComponent(item.title)}`} target="_blank">TikTok</a> |{" "}
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.title)}`} target="_blank">YouTube</a> |{" "}
                <a href={`https://www.instagram.com/explore/tags/${encodeURIComponent(item.title.split(" ")[0])}`} target="_blank">Instagram</a> |{" "}
                <a href={item.url} target="_blank">Source</a>
              </div>
              <button onClick={() => toggleFavorite(topic, item.title)}>
                {favorites[item.title] ? "⭐ Unfavorite" : "☆ Favorite"}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
