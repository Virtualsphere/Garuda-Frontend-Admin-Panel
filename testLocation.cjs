const axios = require('axios');

async function testApi() {
  try {
    const res = await axios.get('http://127.0.0.1:5000/api/location');
    console.log("Status:", res.status);
    console.log("Data keys:", Object.keys(res.data));
    if (res.data.success) {
      console.log("Number of locations (states):", res.data.data.length);
      console.log("First state:", res.data.data[0]?.name);
      console.log("First state fields:", Object.keys(res.data.data[0]));
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testApi();
