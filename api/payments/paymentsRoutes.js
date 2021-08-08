'use strict';
module.exports = (app) => {
    const payments = require('./controllers/paymentsController');

    //  Depending on whether the project expands to offer more custom functionality or better coverage of all LND API
    //  calls it will probably be better to switch to either a more RESTful approach in the first case and a more native
    //  one in the latter.

    //  routes named after native LND API calls
    app.route('/ListPayments')
        .post(payments.get)
    app.route('/DeleteAllPayments')
        .post(payments.delete)

    //  RESTful routes
    app.route('/payments')
        .get(payments.get)
        .delete(payments.delete);
    app.route('/payments/csv')
        //  get_csv only available as a RESTful call because it isn't natively supported by the LND API
        .get(payments.get_csv)
};