//  a class of static methods to easily set undefined variables to their desired default value
class ARGUMENTS{

    constructor() {

        //  print recognized arguments on startup
        console.log("ARGUMENTS:")
        process.argv.forEach((val, index) => {
            console.log(`${index}: ${val}`)
        })
        console.log("");

        // isolate useful CLI arguments
        this.args = require('minimist')(process.argv.slice(2))

        // check if required arguments are set and assign them to the global variable
        // if missing print the appropriate information

        // check for network argument
        if(Object.keys(this.args).includes("network")){
            global.network = this.args['network']
        }
        else{
            this.report_missing_required("network", ["testnet", "mainnet"])
        }
        console.log("network: " + global.network);

        // check of lnd_path argument
        if(Object.keys(this.args).includes("lnd_path")){
            global.lnd_path = this.args['lnd_path']
        }
        else{
            this.report_missing_required("lnd_path", ["/home/USER_NAME/.lnd", "<some other valid path>"])
        }
        console.log("lnd_path: " + global.lnd_path);
        console.log("");
    }


    report_missing_required(argument, acceptable_arguments){
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



}
exports.ARGUMENTS = ARGUMENTS