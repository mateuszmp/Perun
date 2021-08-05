'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//schema from:
//  https://api.lightning.community/?shell#listpayments
const PaymentsSchema = new Schema({
    //schema from:
    //  https://api.lightning.community/?shell#lnrpc-payment
    payments: {
        type: [{
            payment_hash:{
                type: String
            },
            value:{
                //int64
                //deprecated
                type: Number
            },
            creation_date:{
                //int64
                //deprecated
                type: Number
            },
            fee:{
                //int64
                //deprecated
                type: Number
            },
            payment_preimage:{
                type: String
            },
            value_sat:{
                //int64
                type: Number
            },
            value_msat:{
                //int64
                type: Number
            },
            payment_request:{
                type: String
            },
            status:{
                //lnd docs don't have schema?
                any: {}
            },
            fee_sat:{
                //int64
                type: Number
            },
            fee_msat:{
                //int64
                type: Number
            },
            creation_time_ns:{
                //int64
                type: Number
            },
            htlcs:{
                //array of schemas from:
                //  https://api.lightning.community/?shell#lnrpc-htlcattempt
                any: {}
            },
            payment_index:{
                //uint64
                type: Number
            },
            failure_reason:{
                any: {}
            }
        }],
        default: []
    },
    first_index_offset: {
        //lnd docs claim type uint64, in reality string is returned???
        type: Number,
        default: 0
    },
    last_index_offset: {
        //lnd docs claim type uint64, in reality string is returned???
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('Payments', PaymentsSchema);