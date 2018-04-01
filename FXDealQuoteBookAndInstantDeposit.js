"use strict";

var soap = require('strong-soap').soap;
const util = require('util');

/**
 * [userLogin your wallet login]
 * @type {String}
 */
var userLogin = "myUserAsInKyc";
/**
 * [userPassword 
 * @type {String}
 */
var userPassword = "myPasswordAsInKyc";

/**
 * callerId  is a preshared key that identifies the API consumer as a valid and known entity
 * @type {String}
 */
var callerId = "00000000-0000-0000-0000-000000000000";

/**
 * [url the path tothe WSDL file of the API]
 * @type {String}
 * @Remark  For local wsdl you can use, url = './wsdls/wpyWDSL.xml' - or any other filesystem location
 */
var url = './WSDL/WinstantPayWebService.xml';
/**
 * [options this object can be used to further configure the soap client]
 *          see https://github.com/strongloop/strong-soap for details on the options
 * @type {Object}
 */
var options = {};

/**
 * [wsSecurity Implements WS-Security. UsernameToken and PasswordText/PasswordDigest is supported.]
 * @type {soap}
 */
var wsSecurity = new soap.WSSecurity(userLogin, userPassword, options);

/**
 * errHandlke - Simply prints the error message to the console
 * @param  {String} 
 * @return {void}
 */
var errHandler = function(err) {
    console.log(err);
}

/**
 * wpyInitialize - the functions calls the UserSettingsGetSingle endPoint of the GPWeb Webservice API
 *      
 * @param  {soapClient} client - The soapClient 
 * @return {String} userId - Since this functionm returns really a promise - userId is resolved if success else an error message is returned
 */
function wpyInitialize(client) {
    /**
     * [args Contain the arguments for the soap module call]
     * @type {Object}
     */
    let args = {
        request: {
            ServiceCallerIdentity: {
                LoginId: userLogin,
                Password: userPassword,
                ServiceCallerId: callerId 
            },
        }
    };
    /**
     * @param  {Function} - resolve is call when the function succeeds 
     * @param  {Function} - reject is called when the method called technically fails - 
     *                      sementical errors will be returned on the result buffer, which is a parsd JSON object,
     *                      and are not handled here
     * @return {void}
     */
    return new Promise(function(resolve, reject) {
        
        var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['UserSettingsGetSingle'];

        method(args, function(err, result, envelope, soapHeader) {
            if (err) {
                reject(err);
            } else {
                var gpWebResult = result;
                var userId = gpWebResult.UserSettingsGetSingleResult.UserSettings.UserId;
                resolve(userId);
            }
        });
    });

} // end of initialize

/**
 * [wpyGetFxQuote - get a FC Quote ]
 * @param  {soapClient}
 * @param  {String} - String represnetation of the UID from the API
 * @return {Promise}
 */
function FXDealQuoteCreate(client, customerId) {
    let args = {
        request: {
            ServiceCallerIdentity: {
                LoginId: userLogin,
                Password: userPassword,
                ServiceCallerId: callerId 
            },
            CustomerId: customerId,
            BuyCCY: "MMK",
            SellCCY: "THB",
            Amount: "1000.00",
            AmountCCY: "THB",
            DealType: "Spot",
            IsForCurrencyCalculator: false

        }
    };

    return new Promise(function(resolve, reject) {
        // Do async job
        var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['FXDealQuoteCreate'];

        method(args, function(err, result, envelope, soapHeader) {
            if (err) {
                reject(err);
            } else {
                var gpWebResult = result.FXDealQuoteCreateResult.Quote;
                resolve(gpWebResult);
            }
        });
    });

} // end of FXDealQuoteCreate

/**
 * wpyBookFxQuote - Book the quote we earlier requested
 * @param  {soapClient} 
 * @param  {String}
 * @return {Promise}
 */
function FXDealQuoteBookAndInstantDeposit(client, quoteId) {
let args = {
    request: {
        ServiceCallerIdentity: {
            LoginId: userLogin,
            Password: userPassword,
            ServiceCallerId: callerId 
        },
        QuoteId: quoteId
    }
};
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['FXDealQuoteBookAndInstantDeposit'];

        method(args, function(err, result, envelope, soapHeader) {
            if (err) {
                reject(err);
            } else {
                var gpWebResult = result.FXDealQuoteBookAndInstantDepositResult.FXDepositData;
                resolve(gpWebResult);
            }
        });

    })

} // end of FXDealQuoteBookAndInstantDeposit


/**
 * @param  {String}
 * @param  {Object}
 * @param  {Functiom} - a closure to handle the client stuff
 * @param  {String} - The error String filled if the client creation fails
 * @return {soapClient} - The soap client which will be an object if the creatClient call succeeds 
 */
soap.createClient(url, options, function(err, client) {
    var userId = null;
    var quoteId = null;

    if (err) {
        console.log(err);
        process.exit(-1);
    }

    client.setSecurity(wsSecurity);

    var initializePromise = wpyInitialize(client);
    initializePromise.then(function(gpWebResult) {
            userId = gpWebResult;
            console.log("Initialized user Id");
            // Use user details from here
            console.log(userId);
            return FXDealQuoteCreate(client, userId);
        }, errHandler)
        .then(function(gpWebResult) {
            console.log('\nResult: \n');
            console.log(util.inspect(gpWebResult, {
                showHidden: false,
                depth: null
            }));
            quoteId = gpWebResult.QuoteId;            
            console.log("----------------------------------------------------")
            console.log("Your qoute Id is: ", quoteId);
            console.log("Your rate is: ", gpWebResult.Rate);
            console.log("Rate Format: ", gpWebResult.RateFormat);
            console.log("You will get: ", gpWebResult.BuyAmount);
            console.log("this Qoue is vaid tilll: ", gpWebResult.ExpirationTime);
            console.log("----------------------------------------------------")
            return FXDealQuoteBookAndInstantDeposit(client, quoteId);
        }, errHandler)
        .then(function(gpWebResult) {
            console.log(util.inspect(gpWebResult, {
                showHidden: false,
                depth: null
            }));
            
        }, errHandler);
});