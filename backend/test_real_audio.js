const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
    const fd = new FormData();
    fd.append('file', fs.createReadStream('uploads/1b302fb8296849c06ed4acee1aa573f3'));
    const start = Date.now();
    try {
        console.log('Sending real audio...');
        const res = await axios.post('http://localhost:8000/predict', fd, {
            headers: fd.getHeaders(),
            timeout: 50000
        });
        console.log('Success!', res.data, `Time: ${Date.now() - start}ms`);
    } catch (e) {
        console.log('Error:', e.message, `Time: ${Date.now() - start}ms`);
        if (e.response) {
             console.log('Response DATA:', e.response.data);
        }
    }
}
test();
