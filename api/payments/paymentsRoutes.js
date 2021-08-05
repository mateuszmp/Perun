'use strict';
module.exports = (app) => {
    const payments = require('./controllers/paymentsController');
    // payments routes
    app.route('/payments')
        .get(payments.get)
        .delete(payments.purge);
    app.route('/payments/csv')
        .get(payments.get_csv)
};