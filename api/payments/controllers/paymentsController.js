'use strict';
const mongoose = require('mongoose');
const PaymentsModel = require('../models/paymentsModel');
let Payments = mongoose.model('Payments');

const {DEFAULTS, LND} = require("../../gRPC")

//  calls LND.ListPayments
//  called by:
//  - exports.get
//  - exports.get_csv
Payments.get = async function (req, res) {

    let request = {
        include_incomplete: DEFAULTS.true(req.body.include_incomplete),
        index_offset:       DEFAULTS.zero(req.body.index_offset),
        max_payments:       DEFAULTS.zero(req.body.max_payments),
        reversed:           DEFAULTS.false(req.body.reversed),
    };

    return await new Promise((resolve, reject) => LND.ListPayments(request, function(err, response) {

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

//  returns JSON with outgoing payments
//  calls Payments.get
//  returns from its response as is
exports.get = (req, res) => {

    console.log("Calling export.get()");

    Payments.get(req,res).then((result)=>{
        res.status(200).send(result);
    })

};

//  returns CSV with outgoing payments
//  calls Payments.get
//  loops through response to omit some fields and format the rest as CSV
exports.get_csv = (req, res) => {

    console.log("Calling export.get_csv()");

    Payments.get(req,res).then((result)=>{

        let flat_list = []
        //  CSV header
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
        //  copy the fields we care about to the array for later processing into CSV
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

        // process the flat_list array into a CSV
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


// Removes history of outgoing payments
// calls LND.DeleteAllPayments
// returns its response but there ought to be none as per LND API docs
exports.delete = (req, res) => {

    console.log("Calling export.delete()");
    let request = {
        failed_payments_only:   DEFAULTS.true(req.body.failed_payments_only),
        failed_htlcs_only:      DEFAULTS.true(req.body.failed_htlcs_only),
    };

    LND.DeleteAllPayments(request, function(err, response) {

        if(err){
            console.log('Error: ' + err);
        }

        res.status(200).send(response);

    })


};
