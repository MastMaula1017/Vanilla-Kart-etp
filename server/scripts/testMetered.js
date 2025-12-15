require('dotenv').config();
const axios = require('axios');

async function testConnection() {
    console.log('\n--- METERED.CA POST TEST ---');
    
    // 1. Setup
    const key = process.env.METERED_API_KEY ? process.env.METERED_API_KEY.trim() : '';
    const domain = process.env.METERED_DOMAIN ? process.env.METERED_DOMAIN.trim() : '';
    
    if (!key || !domain) { console.error('❌ Missing env vars'); return; }

    const cleanDomain = domain.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '');
    console.log(`Domain: ${cleanDomain}`);

    // 2. Test POST /api/v1/turn/credential (singular)
    // Docs say: POST https://<appname>.metered.live/api/v1/turn/credential?secretKey=...
    const url = `https://${cleanDomain}/api/v1/turn/credential?secretKey=${key}`;
    
    console.log(`\nAttempting POST to:`);
    console.log(url.replace(key, 'HIDDEN_KEY'));

    try {
        const response = await axios.post(url, {
            label: "test-script"
        });
        console.log(`\n✅ SUCCESS!`);
        console.log(`   - Status: ${response.status}`);
        
        const data = response.data;
        if (Array.isArray(data)) {
            console.log(`   - Result: Array of ${data.length} ICE servers.`);
            console.log(`   - First Item:`, JSON.stringify(data[0]));
        } else {
            console.log(`   - Result: Object (Credentials?)`);
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.log(`❌ FAILED: ${e.message}`);
        if(e.response) {
            console.log(`   - Status: ${e.response.status}`);
            console.log(`   - Data:`, e.response.data);
        }
    }
    console.log('\n----------------------------------\n');
}

testConnection();
