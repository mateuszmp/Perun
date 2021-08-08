const {ARGUMENTS} = require("./classes/ARGUMENTS.js")
let args = new ARGUMENTS()

// initialize the express web framework
const express = require('express'),
    app = express(),
    port = global.port;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// import defined routes
const routes = require('./api/payments/paymentsRoutes');
routes(app);

// return 404 if called endpoint is not found
app.get('*', (req, res)=>{
    res.status(404).send({url: req.originalUrl + ' not found'})
})

// listen for incoming traffic on selected port
app.listen(port);
console.log('Perun REST API server started on: ' + port);