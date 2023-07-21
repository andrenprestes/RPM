const fs = require('firebase-admin');
const serviceAccount = require('./nice-hydra-385916-350a30ed6ead.json');
module.exports = fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});


