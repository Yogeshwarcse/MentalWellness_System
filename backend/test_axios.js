const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function test() {
    fs.writeFileSync('test_audio.txt', 'dummy audio content');
    const formData = new FormData();
    formData.append('file', fs.createReadStream('test_audio.txt'));

    try {
        console.log('Sending without Content-Length...');
        const res = await axios.post('http://localhost:8000/predict', formData, {
            headers: formData.getHeaders(),
            timeout: 5000
        });
        console.log('Success without Content-Length:', res.data);
    } catch (e) {
        console.log('Error without Content-Length:', e.message);
    }

    try {
        console.log('Sending WITH Content-Length...');
        const length = await new Promise((resolve, reject) => {
            formData.getLength((err, len) => err ? reject(err) : resolve(len));
        });
        const res2 = await axios.post('http://localhost:8000/predict', formData, {
            headers: { ...formData.getHeaders(), 'Content-Length': length },
            timeout: 5000
        });
        console.log('Success WITH Content-Length:', res2.data);
    } catch (e) {
        console.log('Error WITH Content-Length:', e.message);
    }
}
test();
