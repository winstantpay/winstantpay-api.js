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
 * in the demno platform that is now not really checked, yet it has to exist
 * @type {String}
 */
var callerId = "00000000-0000-0000-0000-000000000000";


/**
 * [url the path tothe WSDL file of the API]
 * @type {String}
 * @Remark  For local wsdl you can use, url = './wsdls/wpyWDSL.xml' - or any other filesystem location
 */
var url = './WDSL/WinstantPayWebService.xml';

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
var wsSecurity = new soap.WSSecurity("Ralf4IOU", "Letmein123", options);

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
                console.log('\nResult: \n');
                // console.log(util.inspect(result, {
                //     showHidden: false,
                //     depth: null
                // }))

                // var gpWebResult = JSON.parse(result);
                var gpWebResult = result;
                var userId = gpWebResult.UserSettingsGetSingleResult.UserSettings.UserId;
                console.log("User Id is ", userId);
                resolve(userId);
            }
        });

    })

} // end of initialize

/**
 * wpyGetAccountBalances - get the current standings...
 * @param  {soapClient}
 * @param  {String}
 * @return {Promise}
 */
function wpyGetAccountBalances(client,customerId) {
    // Setting WebService Paramter attributes 
    let args = {
        request: {
            ServiceCallerIdentity: {
                LoginId: userLogin,
                Password: userPassword,
                ServiceCallerId: callerId 
            },
            CustomerId: customerId
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['CustomerAccountBalancesGet'];

        method(args, function(err, result, envelope, soapHeader) {
            if (err) {
                reject(err);
            } else {
                console.log('\nResult: \n');
                console.log(util.inspect(result, {
                    showHidden: false,
                    depth: null
                }))

                // var gpWebResult = JSON.parse(result);
                var gpWebResult = result;
                resolve(gpWebResult);
            }
        });

    })

} // end of initialize

/**
 * @param  {String}
 * @param  {Object}
 * @param  {Functiom} - a closure to handle the client stuff
 * @param  {String} - The error String filled if the client creation fails
 * @return {soapClient} - The soap client which will be an object if the creatClient call succeeds 
 */
soap.createClient(url, options, function(err, client) {
    var userId = null;

    if (err) {
        console.log(err);
        process.exit(-1);
    }

    client.setSecurity(wsSecurity);

    var initializePromise = wpyInitialize(client);
    initializePromise.then(function(result) {
        userId = result;
        console.log("Initialized user Id");
        // Use user details from here
        console.log(userId)
        return wpyGetAccountBalances(client,userId);
    }, errHandler)
    .then(function(result) {
        console.log(result);
    }, errHandler);

});