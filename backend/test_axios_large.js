const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
    // create a larger 1MB dummy file
    fs.writeFileSync('test_audio_large.txt', 'A'.repeat(1024 * 1024));
    
    // Test 1: Without explicit Content-Length
    const fd1 = new FormData();
    fd1.append('file', fs.createReadStream('test_audio_large.txt'));
    try {
        console.log('Test 1: Sending without Content-Length...');
        const res = await axios.post('http://localhost:8000/predict', fd1, {
            headers: fd1.getHeaders(),
            timeout: 5000
        });
        console.log('Test 1 Success:', res.data.mode);
    } catch (e) {
        console.log('Test 1 Error:', e.message);
    }

    // Test 2: WITH explicit Content-Length
    const fd2 = new FormData();
    fd2.append('file', fs.createReadStream('test_audio_large.txt'));
    try {
        console.log('\nTest 2: Sending WITH Content-Length...');
        const length = await new Promise((resolve, reject) => {
            fd2.getLength((err, len) => err ? reject(err) : resolve(len));
        });
        const res2 = await axios.post('http://localhost:8000/predict', fd2, {
            headers: { ...fd2.getHeaders(), 'Content-Length': length },
            timeout: 5000
        });
        console.log('Test 2 Success:', res2.data.mode);
    } catch (e) {
        console.log('Test 2 Error:', e.message);
    }
}
test();
