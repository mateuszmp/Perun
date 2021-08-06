'use strict';
const mongoose = require('mongoose');
const PaymentsModel = require('../models/paymentsModel');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require("fs");

let Payments = mongoose.model('Payments');

/*
Using gRPC for communication with lnd

Working from modified example on lnd GitHub
https://github.com/lightningnetwork/lnd/blob/master/docs/grpc/javascript.md
*/

// Due to updated ECDSA generated tls.cert we need to let gRPC know that
// we need to use that cipher suite otherwise there will be a handshake
// error when we communicate with the lnd rpc server.
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

// We need to give the proto loader some extra options, otherwise the code won't
// fully work with lnd.
const loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
};

const packageDefinition = protoLoader.loadSync(__dirname + '/../../proto/lightning.proto', loaderOptions);

//  Lnd cert is (should be) at ~/.lnd/tls.cert on Linux and
//  ~/Library/Application Support/Lnd/tls.cert on Mac
let lndCert = fs.readFileSync(global.lnd_path + "/tls.cert");

//in some examples called sslCreds
let credentials = grpc.credentials.createSsl(lndCert);
let lnrpcDescriptor = grpc.loadPackageDefinition(packageDefinition);
let lnrpc = lnrpcDescriptor.lnrpc;
const macaroon = fs.readFileSync(`${global.lnd_path}/data/chain/bitcoin/${global.network}/admin.macaroon`).toString('hex');
const macaroonCreds = grpc.credentials.createFromMetadataGenerator(function(args, callback) {
    let metadata = new grpc.Metadata();
    metadata.add('macaroon', macaroon);
    callback(null, metadata);
});
let creds = grpc.credentials.combineChannelCredentials(credentials, macaroonCreds);
//Caution! Default gRPC proxy port in lnd 12.1 is 8080!
//Default RPC port in lnd 12.1 is 10009
let lightning = new lnrpc.Lightning('localhost:10009', creds);

function default_val(default_val, property){
    return (property == null) ? default_val : property
}

function default_false(property){
    return default_val(false, property)
}
function default_true(property){
    return default_val(true, property)
}

function default_zero(property){
    return (property == null) ? 0 : property
}

Payments.get = async function (req, res) {

    let request = {
        include_incomplete: default_true(req.body.include_incomplete),
        index_offset: default_zero(req.body.index_offset),
        max_payments: default_zero(req.body.max_payments),
        reversed: default_false(req.body.reversed),
    };

    return await new Promise((resolve, reject) => lightning.ListPayments(request, function(err, response) {

        if(err){
            console.log('Error: ' + err);
        }

        return resolve(response);

    }))

    //sample return for debugging down the line
    /*return { payments: [
            {
                payment_hash: "abc",
                value: 123,
                creation_date: 123,
                fee: 123,
                payment_preimage: "abc",
                value_sat: 123,
                value_msat: 123,
                payment_request: "abc",
                status: 123,
                fee_sat: 123,
                fee_msat: 123,
                creation_time_ns: 123,
                htlcs: 123,
                payment_index: 123,
                failure_reason: 123,
            },
            {
                payment_hash: "abc",
                value: 123,
                creation_date: 123,
                fee: 123,
                payment_preimage: "abc",
                value_sat: 123,
                value_msat: 123,
                payment_request: "abc",
                status: 123,
                fee_sat: 123,
                fee_msat: 123,
                creation_time_ns: 123,
                htlcs: 123,
                payment_index: 123,
                failure_reason: 123,
            },

        ], first_index_offset: 0, last_index_offset: 0 }
    */

}

exports.get = (req, res) => {

    console.log("Calling export.get()");

    Payments.get(req,res).then((result)=>{
        res.status(200).send(result);
    })

};

exports.get_csv = (req, res) => {

    console.log("Calling export.get_csv()");

    Payments.get(req,res).then((result)=>{

        let flat_list = []
        flat_list[0] = [
            "payment_hash",
            "payment_preimage",
            "value_sat",
            "value_msat",
            "payment_request",
            "fee_sat",
            "fee_msat",
            "creation_time_ns",
            "payment_index",
        ];

        let payments = result.payments;

        for(let i = 0; i < payments.length; i++){
            flat_list.push([[
                payments[i].payment_hash,
                payments[i].payment_preimage,
                payments[i].value_sat,
                payments[i].value_msat,
                payments[i].payment_request,
                payments[i].fee_sat,
                payments[i].fee_msat,
                payments[i].creation_time_ns,
                payments[i].payment_index,
            ]])
        }

        let csvContent;
        let lineArray = [];
        flat_list.forEach(function (row, index) {
            let line = row.join(",");
            //lineArray.push(index === 0 ? "data:text/csv;charset=utf-8," + line : line);
            lineArray.push(line);
        });
        csvContent = lineArray.join("\n");


        res.status(200).send(csvContent);
    })

};

exports.purge = (req, res) => {

    console.log("Calling export.purge()");
    let request = {
        failed_payments_only: default_true(req.body.failed_payments_only),
        failed_htlcs_only: default_true(req.body.failed_htlcs_only),
    };

    lightning.DeleteAllPayments(request, function(err, response) {

        if(err){
            console.log('Error: ' + err);
        }

        res.status(200).send(response);

    })


};
