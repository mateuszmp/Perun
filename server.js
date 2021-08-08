//  print recognized arguments on startup
console.log("ARGUMENTS:")
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
})
console.log("");

// isolate useful CLI arguments
const args = require('minimist')(process.argv.slice(2))

// helper to inform of missing arguments
function report_missing_argument(argument, acceptable_arguments){
    console.log("")
    console.log("ERROR: MISSING REQUIRED ARGUMENT!")
    console.log(`Specify --${argument} argument.`)
    console.log(`Try again with --${argument} set to one of the following:`)
    acceptable_arguments.forEach((param)=>{
        console.log(`\t${param}`)
    })
    console.log("")
    console.log("Example on how to start Perun with the missing argument:")
    console.log(`npm start -- --${argument}=${acceptable_arguments[0]}`)
    console.log("Please note you may be required to append additional required arguments.")
    console.log("")
    process.exit(1)
}

// check if required arguments are set and assign them to the global variable
// if missing print the appropriate information
if(Object.keys(args).includes("network")){
    global.network = args['network']
}
else{
    report_missing_argument("network", ["testnet", "mainnet"])
}
console.log("network: " + global.network);

if(Object.keys(args).includes("lnd_path")){
    global.lnd_path = args['lnd_path']
}
else{
    report_missing_argument("lnd_path", ["/home/USER_NAME/.lnd", "<some other valid path>"])
}
console.log("lnd_path: " + global.lnd_path);
console.log("");

// initialize the express web framework
const express = require('express'),
    app = express(),
    port = 3000;

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