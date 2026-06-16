const axios = require('axios');

async function testPost() {
  try {
    const res = await axios.post('http://127.0.0.1:5000/api/land', {
      state: "TestState",
      nearest_town_1: JSON.stringify({ state: "Test", district: "Test", town: "Test" }),
      landDetails: {
        total_acres: 5
      }
    }, {
      headers: {
        // Need a valid token or bypass. 
        // Actually, without a token it will fail.
      }
    });
    console.log(res.data);
  } catch (e) {
    console.error(e.response?.data || e.message);
  }
}

testPost();
