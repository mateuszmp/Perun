'use strict';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require("fs");

/*
    gRPC communication with LND
 */

// based on exampled from LND GitHub:
//  https://github.com/lightningnetwork/lnd/blob/master/docs/grpc/javascript.md


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

// Load definitions of calls provided by lnd API
const packageDefinition = protoLoader.loadSync(__dirname + '/../proto/lightning.proto', loaderOptions);

//  Lnd cert is (should be) at ~/.lnd/tls.cert on Linux and
//  ~/Library/Application Support/Lnd/tls.cert on Mac
let lndCert = fs.readFileSync(global.lnd_path + "/tls.cert");

//in some lnd examples "credentials" are called "sslCreds"
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
// assuming LND is running on localhost
let lightning = new lnrpc.Lightning('localhost:10009', creds);
exports.LND = lightning