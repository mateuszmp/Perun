/*
    Using gRPC for communication with lnd

    Working from example on lnd GitHub
    https://github.com/lightningnetwork/lnd/blob/master/docs/grpc/javascript.md
 */

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const fs = require("fs");

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
const packageDefinition = protoLoader.loadSync('rpc.proto', loaderOptions);

//  Lnd cert is (should be) at ~/.lnd/tls.cert on Linux and
//  ~/Library/Application Support/Lnd/tls.cert on Mac
let lndCert = fs.readFileSync("~/.lnd/tls.cert");
let credentials = grpc.credentials.createSsl(lndCert);
let lnrpcDescriptor = grpc.loadPackageDefinition(packageDefinition);
let lnrpc = lnrpcDescriptor.lnrpc;
const macaroon = fs.readFileSync("LND_DIR/data/chain/bitcoin/simnet/admin.macaroon").toString('hex');

//Caution! Default gRPC proxy port in lnd 12.1 is 8080!
//Default RPC port in lnd 12.1 is 10009
let lightning = new lnrpc.Lightning('localhost:10009', credentials);

lightning.getInfo({}, function(err, response) {
    if (err) {
        console.log('Error: ' + err);
    }
    console.log('GetInfo:', response);
});

exports.test = () =>{
    console.log("test")
};

