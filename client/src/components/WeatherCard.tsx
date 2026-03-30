// import React, { useEffect, useState } from "react";

// const WeatherCard: React.FC<{ crop: string }> = ({ crop }) => {
//   const [weather, setWeather] = useState<any>(null);

//   const getLocation = (crop: string) => {
//     switch (crop.toLowerCase()) {
//       case "rice":
//         return "Punjab";
//       case "wheat":
//         return "Haryana";
//       default:
//         return "Kovilpatti";
//     }
//   };

//  useEffect(() => {
//   const location = getLocation(crop);
//   console.log("LOCATION:", location);

//   setWeather(null); // 🔥 forces refresh

//   fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=77d0d6a7658922bd58eaf2a51d5f73c3&units=metric`)
//     .then(res => res.json())
//     .then(data => {
//       console.log("WEATHER:", data);
//       setWeather(data);
//     })
//     .catch(err => console.error(err));

// }, [crop]); // 🔥 VERY IMPORTANT, [crop]);

//   if (!weather) return <p style={{ color: "white" }}>Loading weather...</p>;

//   if (weather.cod && weather.cod !== 200) {
//     return <p style={{ color: "white" }}>Weather unavailable ❌</p>;
//   }

//   if (!weather.main || !weather.weather) {
//     return <p style={{ color: "white" }}>Weather data missing ⚠️</p>;
//   }
//   console.log("WEATHER CARD CROP:", crop);
//   const location = getLocation(crop);
// console.log("LOCATION:", location);
//   return (
//     <div style={{
//       padding: "15px",
//       borderRadius: "12px",
//       background: "#1e293b",
//       color: "white",
//       width: "280px",
//       textAlign: "center"
//     }}>
//       <h3>🌤 Weather</h3>
//       <p>{weather.name}</p>
//       <p>{weather.main.temp}°C</p>
//       <p>{weather.weather[0].description}</p>
//       <p>Humidity: {weather.main.humidity}%</p>
//     </div>
//   );
// };

// export default WeatherCard;



import React, { useEffect, useState } from "react";

interface Props {
  crop: string;
}

const WeatherCard: React.FC<Props> = ({ crop }) => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        //  1. Get regions from backend
        const res = await fetch("http://localhost:5000/api/regions");
        const regions = await res.json();

        // 2. Find region based on crop
        const region = regions.find((r: any) =>
          r.cropType?.toLowerCase() === crop?.toLowerCase()
        );

        if (!region || !region.coordinates) {
          console.log("❌ No region found for crop:", crop);
          return;
        }

        // FIXED (your schema uses lat/lng)
        const lat = region.coordinates.lat;
        const lon = region.coordinates.lng;

        console.log("📍 LOCATION:", region.name);
        console.log("LAT:", lat, "LON:", lon);

        //  3. Fetch weather using coordinates
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=68f4118907ed0202d1a37608bcdf4055&units=metric`
        );

        const data = await weatherRes.json();

        console.log("🌤 WEATHER DATA:", data);

        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    setWeather(null); 
    fetchWeather();

  }, [crop]);

  // Loading state
  if (!weather) {
    return <p style={{ color: "white", textAlign: "center" }}>Loading weather...</p>;
  }

  //  Error fallback
  if (!weather.main || !weather.weather) {
    return <p style={{ color: "white", textAlign: "center" }}>Weather unavailable</p>;
  }

  //  UI
  return (
    <div style={{
      padding: "15px",
      borderRadius: "12px",
      background: "#1e293b",
      color: "white",
      width: "280px",
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
    }}>
      <h3>🌤 Weather</h3>
      <p><b>{weather.name}</b></p>
      <p style={{ fontSize: "22px", fontWeight: "bold" }}>
        {weather.main.temp}°C
      </p>
      <p>{weather.weather[0].description}</p>
      <p>Humidity: {weather.main.humidity}%</p>
    </div>
  );
};

export default WeatherCard;