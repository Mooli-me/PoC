const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static(__dirname + '/public'));
app.listen( PORT , ()=>{
    console.log(`Running and lisening in http://localhost:${PORT}.`);
});