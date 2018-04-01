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
var accountId = "00000000-0000-0000-0000-000000000000"; // this be retrieved pargamatically

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
 * CustomerAccountStatementGetSingle - the functions calls the CustomerAccountStatementGetSingle endPoint of the GPWeb Webservice API
 *      
 * @param  {soapClient} client - The soapClient 
 * @return {JSON} CustomerAccountStatementGetSingleResponse
 */
function CustomerAccountStatementGetSingle(client) {
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
            AccountId: accountId,
            StartDate: "2018-01-01",
            EndDate: "2018-12-01"
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
        
        var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['CustomerAccountStatementGetSingle'];

        method(args, function(err, result, envelope, soapHeader) {
            if (err) {
                reject(err);
            } else {
                var gpWebResult = result;
                var transactions = gpWebResult.CustomerAccountStatementGetSingleResult.Entries;
                resolve(transactions);
            }
        });

    })

} // end of CustomerAccountStatementGetSingle


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

    var initializePromise = CustomerAccountStatementGetSingle(client);
    initializePromise.then(function(result) {
        console.log(util.inspect(result, {
            showHidden: false,
            depth: null
        }))
    }, errHandler);

});