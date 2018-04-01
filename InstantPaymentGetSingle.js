"use strict";
/**
 * iouInstantPayment 
 * API sequence
 *      1 - Initial;ize - to get the userID 
 *      2 - CreatePayment - to get the paymentId
 *      3 - PostPayment - to complete the instabnt payment
 */
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
 * gFromWallet  is the alias of the sending acount. Looks a the demowallet site for more info on wallet aliases
 * This wallet has to be owned by the user calling the service
 * @type {String}
 */
var gFromWallet = "ALIAS";

/**
 * gToWallet  is the alias of the receiving acount. Looks a the demowallet site for more info on wallet aliases
 * @type {String}
 */
var gToWallet = "ALIAS";


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
 * [wpyInitialize - the functions calls the UserSettingsGetSingle endPoint of the GPWeb Webservice API]
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
            }
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
    })
} // end of initialize

/**
 * InstantPaymentCreate - creates a Payment in the bnackend and resolves the paymenmtId
 * @param  {soapClient}
 * @param  {String} fromWallet - any of your aliases has to match the Wallets belonging to the LoginId
 * @param  {String} toWallet - a valid alias - Note that this is not a UID string, but a alias used 
 * @param  {String} currecy - any of the valid currency codes for the wallet e.g. THB, LAK, eytc.
 * @param  {String} amound - a float value e.g. 1230.00
 * @return {Promise} - on success a paymentID is resolved - onError the  promise is rejected with the error set in the String 
 */
function InstantPaymentCreate(client, fromWallet, toWallet, currency, amount) {
    let args = {
        request: {
            ServiceCallerIdentity: {
                LoginId: userLogin,
                Password: userPassword,
                ServiceCallerId: callerId // iou_caller_id / bank id
            },
            FromCustomer: fromWallet,
            ToCustomer: toWallet,
            Amount: amount,
            CurrencyCode: currency,
            ValueDate: "",
            ReasonForPayment:"",
            ExternalReference: "",
            Memo:""
        }
    };

    return new Promise(function(resolve, reject) {
        // Do async job
        var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['InstantPaymentCreate'];

        method(args, function(err, result, envelope, soapHeader) {
            if (err) {
                reject(err);
            } else {
                var gpWebResult = result.InstantPaymentCreateResult.PaymentInformation;
                resolve(gpWebResult);
            }
        });
    })

} // end of InstantPaymentCreate

/**
 * InstantPaymentPost - This completes the instant payment transaction
 * @param  {soapClient}
 * @param  {String} paymentId  
 * @return {Promise}
 */
function InstantPaymentPost(client, paymentId) {
   let args = {
       request: {
           ServiceCallerIdentity: {
               LoginId: userLogin,
               Password: userPassword,
               ServiceCallerId: callerId // iou_caller_id / bank id
           },
           InstantPaymentId: paymentId
       }
   };

   return new Promise(function(resolve, reject) {
       // Do async job
       var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['InstantPaymentPost'];

       method(args, function(err, result, envelope, soapHeader) {
           if (err) {
               reject(err);
           } else {
               var gpWebResult = result.InstantPaymentPostResult;
               resolve(gpWebResult);
           }
       });
   })
} // end of InstantPaymentPost

/**
 * InstantPaymentGetSingle - This retrieves a payment
 * @param  {soapClient}
 * @param  {String} paymentId 
 * @return {Promise}
 */
function InstantPaymentGetSingle(client, paymentId) {
let args = {
    request: {
        ServiceCallerIdentity: {
            LoginId: userLogin,
            Password: userPassword,
            ServiceCallerId: callerId // iou_caller_id / bank id
        },
        InstantPaymentId: paymentId
    }
};

    return new Promise(function(resolve, reject) {
        // Do async job
        var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['InstantPaymentGetSingle'];

        method(args, function(err, result, envelope, soapHeader) {
            if (err) {
                reject(err);
            } else {
                var gpWebResult = result.InstantPaymentGetSingleResult.Payment;
                resolve(gpWebResult);
            }
        });

    })

} // end of InstantPaymentGetSingle

/**
 * @param  {String}
 * @param  {Object}
 * @param  {Functiom} - a closure to handle the client stuff
 * @param  {String} - The error String filled if the client creation fails
 * @return {soapClient} - The soap client which will be an object if the creatClient call succeeds 
 */
soap.createClient(url, options, function(err, client) {
    var userId = null;
    var paymentId = null;

    if (err) {
        console.log(err);
        process.exit(-1);
    }

    client.setSecurity(wsSecurity);

    var initializePromise = InstantPaymentCreate(client,gFromWallet,gToWallet,"THB","20.00");
    initializePromise.then(function(gpWebResult) {
        paymentId = gpWebResult.PaymentId;
        console.log("----------------------------------------------------");
        console.log("Your payment Id is: ", gpWebResult.PaymentId);
        console.log("Your reference is : ", gpWebResult.PaymentReference);
        console.log("----------------------------------------------------");
        return InstantPaymentPost(client, paymentId);
    }, errHandler)
    .then(function(gpWebResult) {
        return InstantPaymentGetSingle(client, paymentId);
    }, errHandler)
    .then(function(gpWebResult) {
        console.log(util.inspect(gpWebResult, {
            showHidden: false,
            depth: null
        }));
    }, errHandler);
    

});