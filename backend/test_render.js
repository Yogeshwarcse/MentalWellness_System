const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
    const fd = new FormData();
    if (!fs.existsSync('uploads/1b302fb8296849c06ed4acee1aa573f3')) {
        fs.writeFileSync('uploads/dummy.txt', 'hello');
        fd.append('file', fs.createReadStream('uploads/dummy.txt'));
    } else {
        fd.append('file', fs.createReadStream('uploads/1b302fb8296849c06ed4acee1aa573f3'));
    }

    try {
        console.log('Sending to Render...');
        const res = await axios.post('https://ai-service-1-djf9.onrender.com/predict', fd, {
            headers: fd.getHeaders(),
            timeout: 60000
        });
        console.log('Success!', res.data);
    } catch (e) {
        console.log('Error:', e.message);
        if (e.response) {
            console.log('Response Status:', e.response.status);
            console.log('Response DATA:', e.response.data);
        }
    }
}
test();
