// const fetch = require("node-fetch");

// const getNDVI = async () => {
//   try {
//     const res = await fetch(
//       `http://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${process.env.POLYGON_ID}&appid=${process.env.AGRO_API_KEY}`
//     );

//     const data = await res.json();

//     console.log("NDVI API RESPONSE:", data);

//     if (!data || data.length === 0) return null;

//     const latest = data[data.length - 1];

//     return {
//       ndvi: latest.value,
//       timestamp: new Date(latest.dt * 1000)
//     };

//   } catch (err) {
//     console.error("NDVI fetch error:", err);
//     return null;
//   }
// };

// module.exports = { getNDVI };


// const fetch = require("node-fetch");

// const getNDVI = async () => {
//   try {
//     // ✅ ADD TIME RANGE
//     const now = Math.floor(Date.now() / 1000);
//     const tenDaysAgo = now - (10 * 24 * 60 * 60);

//     const res = await fetch(
//       `http://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${process.env.POLYGON_ID}&start=${tenDaysAgo}&end=${now}&appid=${process.env.AGRO_API_KEY}`
//     );

//     const data = await res.json();

//     console.log("NDVI API RESPONSE:", data);

//     // ✅ FIX validation
//     if (!Array.isArray(data) || data.length === 0) {
//       console.log("⚠️ No NDVI data available");
//       return null;
//     }

//     const latest = data[data.length - 1];

//     return {
//       ndvi: latest.value,
//       timestamp: new Date(latest.dt * 1000)
//     };

//   } catch (err) {
//     console.error("NDVI fetch error:", err);
//     return null;
//   }
// };

// module.exports = { getNDVI };



// const fetch = require("node-fetch");

// const getNDVI = async () => {
//   try {
//     const now = Math.floor(Date.now() / 1000) - 1000; // ✅ FIX
//     const tenDaysAgo = now - (10 * 24 * 60 * 60);

//     const res = await fetch(
//       `http://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${process.env.POLYGON_ID}&start=${tenDaysAgo}&end=${now}&appid=${process.env.AGRO_API_KEY}`
//     );

//     const data = await res.json();

//     console.log("NDVI API RESPONSE:", data);

//     if (!Array.isArray(data) || data.length === 0) {
//       console.log("⚠️ No NDVI data available");
//       return null;
//     }

//     const latest = data[data.length - 1];

//     return {
//       ndvi: latest.value,
//       timestamp: new Date(latest.dt * 1000)
//     };

//   } catch (err) {
//     console.error("NDVI fetch error:", err);
//     return null;
//   }
// };

// module.exports = { getNDVI };

const fetch = require("node-fetch");

const getNDVI = async () => {
  try {
    const now = Math.floor(Date.now() / 1000) - 1000;
    const tenDaysAgo = now - (10 * 24 * 60 * 60);

    const res = await fetch(
      `http://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${process.env.POLYGON_ID}&start=${tenDaysAgo}&end=${now}&appid=${process.env.AGRO_API_KEY}`
    );

    const data = await res.json();

    console.log("NDVI API RESPONSE:", data);

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const latest = data[data.length - 1];

    return {
      ndvi: latest.data.mean,   //
      timestamp: new Date(latest.dt * 1000)
    };

  } catch (err) {
    console.error("NDVI fetch error:", err);
    return null;
  }
};

module.exports = { getNDVI };