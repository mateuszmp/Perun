console.log("OPTIONS:")
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
})
console.log("");

const args = require('minimist')(process.argv.slice(2))

function report_missing_parameter(parameter, acceptable_parameters){
    console.log("")
    console.log("ERROR: MISSING REQUIRED PARAMETER!")
    console.log(`Specify --${parameter} parameter.`)
    console.log(`Try again with --${parameter} set to one of the following:`)
    acceptable_parameters.forEach((param)=>{
        console.log(`\t${param}`)
    })
    console.log("")
    process.exit(1)
}

if(Object.keys(args).includes("network")){
    global.network = args['network']
}
else{
    report_missing_parameter("network", ["mainnet", "testnet"])
}
console.log("network: " + global.network);

if(Object.keys(args).includes("lnd_path")){
    global.lnd_path = args['lnd_path']
}
else{
    report_missing_parameter("lnd_path", ["/home/USER_NAME/.lnd", "<some other valid path>"])
}
console.log("lnd_path: " + global.lnd_path);
console.log("");

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }))
app.use(express.json());

const routes = require('./api/payments/paymentsRoutes');
routes(app);
app.get('*', (req, res)=>{
    res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port);
console.log('Perun RESTful API server started on: ' + port);