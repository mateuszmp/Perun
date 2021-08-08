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

        // check for network argument
        // todo arguments and acceptable_options should be stored in some database or config file
        this.check_for_argument("network", ["testnet", "mainnet"])
        this.check_for_argument("lnd_path", ["/home/USER_NAME/.lnd", "<lnd directory>"])
        this.check_for_argument("port", [3000, "<other valid port>"], 3000)
        console.log("");

    }

    check_for_argument(argument, acceptable_options, default_value){

        // check if required arguments are set and assign them to the global variable
        // if missing print the appropriate information
        if(Object.keys(this.args).includes(argument)){
            global[argument] = this.args[argument]
        }
        else if(default_value == null){
            this.report_missing_required(argument, acceptable_options)
        }
        else{
            global[argument] = default_value
        }
        console.log(argument + ": " + global[argument]);
    }


    report_missing_required(argument, acceptable_options){
        console.log("")
        console.log("ERROR: MISSING REQUIRED ARGUMENT!")
        console.log(`Specify --${argument} argument.`)
        console.log(`Try again with --${argument} set to one of the following:`)
        acceptable_options.forEach((param)=>{
            console.log(`\t${param}`)
        })
        console.log("")
        console.log("Example on how to start Perun with the missing argument:")
        console.log(`npm start -- --${argument}=${acceptable_options[0]}`)
        console.log("Please note you may be required to append additional required arguments.")
        console.log("")
        process.exit(1)
    }

}
exports.ARGUMENTS = ARGUMENTS