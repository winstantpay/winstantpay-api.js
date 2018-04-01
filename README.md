# winstantpay-api.js ![npm](https://img.shields.io/npm/v/npm.svg) ![node](https://img.shields.io/node/v/@stdlib/stdlib/latest.svg)


![The WinstantPay Logo](http://www.winstantpay.com/assets/img/logo-winstantpay-L-notag-trans.png "The WinstantPay Logo")

These are the JavaScript examples for using the WinstantPay webservice API


## Introduction

WinstantPay allows anyone to trade or pay globally with any currency, including cryptos and other tokens anytime and from anywhere. Originating from a foreign currency exchange and trade finance background the WinstantPay core is utilized by WinstantPay to provide a solid means for ecosystem partners to develop mobile and electronic wallets on this platform. 

### Install: ###

Clone this repository then
```
npm install
```
### Requirements: ###

node version >=6

### Quick start

```bash
npm install
npm start
```
>Please note that you need a pre-shared key to use the API. 
>We call this key a caller-id.
>
>To get the caller id, you need to complete your KYC (Know Your Client), which will result in >you have a user ID and password with WinstantPay. 
>To complete the basic KYC, you need a working email and telephone number.

>Once done, send us an email to <api@winstantpay.com> from the registered email and we ?will get in touch prompty (usually via SMS to your phone 24hours).
>
>Upon verification of that number we will provide your with the caller ID

After you have all you credentials please follow the following steps (explained in section **Examples** below

## Basic Flow of the API

### Security
Even though security credentials are provided through the WSsecurityCall
```javascript
var wsSecurity = new soap.WSSecurity(userLogin, userPassword, options);
```
our API foresees that every request has to be authorised and the ServiceCallerIdentity object has to be provided as part of the args object iin very API method call.

```javascript
ServiceCallerIdentity: {
    LoginId: userLogin,
    Password: userPassword,
    ServiceCallerId: callerId 
},
```
### Flow

WinstantPay follows in the core the dual controll principle where one user prepares a transaction and a second user (usually a supervisor) approves or books the transaction.
e.g.  
1. InstantPaymentCreate -- returns a PaymentId 
2. InstantPaymentPost -- books the payment

or.

1. UserSettingsGetSingle -- returns the UserId
2. FXDealQouteCreate -- Uses UserId as CustomerId and returns a QuoteId
3. FXDealQuoteBookAndInstantDeposit -- Uses QuoteId and Books the Deal and Depositis it in the users wallet


## Example

We are sure you'll find your way around the source and keep the explanations here rather brief and explain one example in full.
### GetAccountBalances

Let's look into an example to get your account balances:

```javascript
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
                console.log('\nResult: \n');
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
        console.log("Initialized user. Id is: " + userId);
        return wpyGetAccountBalances(client,userId);
    }, errHandler)
    .then(function(result) {
        console.log(result);
    }, errHandler);

});

```
As often in nodejs It all starts at the end of the scipt. 
All program logic is executed in the createClient (from strong-soap) callback.
In the GetAccountBalances case we call on two webservices
1. UserSettingsGetSingle  -- to retrieve the UserId and;
2. CustomerAccountBalancesGet - to get the customers account balances

> the customer in this case is the same as the user.

In most scripts the wpyInitialize function is called. This function connects to the WinstantPay core, and retrieves your User Id, which will be used in many funcations of the webservice.

```javascript

/**
 * wpyInitialize - the functions calls the UserSettingsGetSingle endPoint of the GPWeb Webservice API
 *      
 * @param  {soapClient} client - The soapClient 
 * @return {String} userId - Since this functionm returns really a promise - userId is resolved if success else an error message is returned the reject method of the promise
 */
function wpyInitialize(client) {```
```

For the actual Soap stuff we are using the [strong-soap](https://github.com/strongloop/strong-soap) module, which provides a Node.js SOAP client for invoking web services.

To call the webservice a client needs to be created and a the proper SOAP paramters need to be configures, like so:

```javascript
var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['UserSettingsGetSingle']; 
```
The first two segments, GPWebService and BasicHttpsBinding_IGPWebService1 stay afix. The last segment, in this case UserSettingsGetSingle defines the actual service of API we are calling.

#### API Call and Parameters 
This method is then called with parameters to consume the endpoint. 

```javascript
 method(args, function(err, result, envelope, soapHeader) {
```
The args JSON object define the input paramters of the webservice. 

```javascript
    let args = {
        request: {
            ServiceCallerIdentity: {
                LoginId: userLogin,
                Password: userPassword,
                ServiceCallerId: callerId 
            },
        }
    };
```
#### Response processing

upon return the **result** variable is set and can be accessed in the closure, like so:
```javascript

        var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['UserSettingsGetSingle'];

        method(args, function(err, result, envelope, soapHeader) {
            if (err) {
                reject(err);
            } else {
                console.log('\nResult: \n');
                var gpWebResult = result;
                var userId = gpWebResult.UserSettingsGetSingleResult.UserSettings.UserId;
                console.log("User Id is ", userId);
                resolve(userId);
            }
        });

```
the section **Endpoints** provide an overview over the  inputs (the args JSON object and the response fobject.

>Now that you understand how the general flow works, we hope that  and when in doubt you can browse the WSDL file by using one of the many SOAP toolsets.. 
>We recommend the free community version of [SoapUi](https://www.soapui.org/)  to browse and test our soap API's



## Endpoints

- [CurrencyListGetPaymentCurrencies](#currencylistgetpaymentcurrencies)
- [CustomerAccountBalancesGet](#customeraccountbalancesget)
- [CustomerAccountStatementGetSingle](#customeraccountstatementgetsingle)
- [CustomerUserSearch](#customerusersearch)
- [FXDealQuoteBook](#fxdealquotebook)
- [FXDealQuoteBookAndInstantDeposit](#fxdealquotebookandinstantdeposit)
- [FXDealQuoteCreate](#fxdealquotecreate)
- [GetCustomerAccountAliasList](#getcustomeraccountaliaslist)
- [GetCustomerAccountBalances](#getcustomeraccountbalances)
- [GetLibraryVersion](#getlibraryversion)
- [InstantPaymentCreate](#instantpaymentcreate)
- [InstantPaymentGetSingle](#instantpaymentgetsingle)
- [InstantPaymentPost](#instantpaymentpost)
- [InstantPaymentSearch](#instantpaymentsearch)
- [UserPasswordChange](#userpasswordchange)
- [UserPasswordReset](#userpasswordreset)
- [UserSettingsGetSingle](#usersettingsgetsingle)

### CurrencyListGetPaymentCurrencies
#### Call
```javascript
let args = {
    request: {
        ServiceCallerIdentity: {
            LoginId: userLogin,
            Password: userPassword,
            ServiceCallerId: callerId 
        },
    }
};
```
Method: 
```javascript
var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['CurrencyListGetPaymentCurrencies'];
```
#### Response
The Path:
```javascript
var currencies = gpWebResult.CurrencyListGetPaymentCurrenciesResult.Currencies;
```
The Object:
```javascript
{ CurrencyData: 
   [ { CurrencyId: 76,
       CurrencyCode: 'KHR',
       CurrencyName: 'Cambodian Riels',
       CurrencyAmountScale: 2,
       CurrencyRateScale: 5,
       Symbol: '៛',
       PaymentCutoffTime: '16:00',
       SettlementDaysToAdd: 0 },
     { CurrencyId: 83,
       CurrencyCode: 'LAK',
       CurrencyName: 'Lao Kips',
       CurrencyAmountScale: 2,
       CurrencyRateScale: 5,
       Symbol: '₭',
       PaymentCutoffTime: '16:00',
       SettlementDaysToAdd: 0 },
     { CurrencyId: 95,
       CurrencyCode: 'MMK',
       CurrencyName: 'Myanmar (Burma) Kyats',
       CurrencyAmountScale: 2,
       CurrencyRateScale: 4,
       Symbol: 'MMK',
       PaymentCutoffTime: '16:00',
       SettlementDaysToAdd: 0 },
     { CurrencyId: 141,
       CurrencyCode: 'THB',
       CurrencyName: 'Thai Baht',
       CurrencyAmountScale: 2,
       CurrencyRateScale: 3,
       Symbol: '฿',
       PaymentCutoffTime: '16:00',
       SettlementDaysToAdd: 0 },
     { CurrencyId: 153,
       CurrencyCode: 'USD',
       CurrencyName: 'US Dollars',
       CurrencyAmountScale: 2,
       CurrencyRateScale: 4,
       Symbol: '$',
       PaymentCutoffTime: '23:00',
       SettlementDaysToAdd: 2 } ] }

```
### CustomerAccountBalancesGet
#### Call
```javascript
let args = {
    request: {
        ServiceCallerIdentity: {
            LoginId: userLogin,
            Password: userPassword,
            ServiceCallerId: callerId 
        },
        CustomerId: customerId // this is the userId from the priory called UserSettingsGetSingle
    }
};
```
Method: 
```javascript
var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['CustomerAccountBalancesGet'];
```
#### Response
The Path:
```javascript
var balances = gpWebResult.CustomerAccountBalancesGetResult.Balances;

```
The Object:
```javascript
{ CustomerBalanceData: 
   [ { AccountId: 'the ID of the account ',
       AccountNumber: '1022369',
       CCY: 'KHR',
       Balance: 0,
       ActiveHoldsTotal: 0,
       BalanceAvailable: 0,
       BaseCCY: 'THB',
       BalanceAvailableBase: 0 },
     { AccountId: 'the ID of the account ',
       AccountNumber: '1022372',
       CCY: 'LAK',
       Balance: 260646,
       ActiveHoldsTotal: 0,
       BalanceAvailable: 260646,
       BaseCCY: 'THB',
       BalanceAvailableBase: 979.19 },
     { AccountId: 'the ID of the account ',
       AccountNumber: '1022376',
       CCY: 'MMK',
       Balance: 42059,
       ActiveHoldsTotal: 0,
       BalanceAvailable: 42059,
       BaseCCY: 'THB',
       BalanceAvailableBase: 979.07 },
     { AccountId: 'the ID of the account ',
       AccountNumber: '1022381',
       CCY: 'THB',
       Balance: 495700,
       ActiveHoldsTotal: 0,
       BalanceAvailable: 495700,
       BaseCCY: 'THB',
       BalanceAvailableBase: 495700 },
     { AccountId: 'the ID of the account ',
       AccountNumber: '1022991',
       CCY: 'TND',
       Balance: 0,
       ActiveHoldsTotal: 0,
       BalanceAvailable: 0,
       BaseCCY: 'THB',
       BalanceAvailableBase: 0 },
     { AccountId: 'the ID of the account ',
       AccountNumber: '1022385',
       CCY: 'USD',
       Balance: 4950,
       ActiveHoldsTotal: 0,
       BalanceAvailable: 4950,
       BaseCCY: 'THB',
       BalanceAvailableBase: 154291.5 } ] }
```
### CustomerAccountStatementGetSingle
#### Call
```javascript
let args = {
    request: {
        ServiceCallerIdentity: {
            LoginId: userLogin,
            Password: userPassword,
            ServiceCallerId: callerId 
        },
        AccountId: accountId, // If you do not know them, you can find them in the response to CustomerAccountBalancesGet
        StartDate: "2018-01-01", // Date format is YYYY-MM-DD
        EndDate: "2018-12-01" // Date format is YYYY-MM-DD        
    }
};
```
Method: 
```javascript
var method = client['GPWebService']['BasicHttpsBinding_IGPWebService1']['CustomerAccountStatementGetSingle'];
```
#### Response
The Path:
```javascript
                var transactions = gpWebResult.CustomerAccountStatementGetSingleResult.Entries;
```
> This is the main response object, even though there is more...
The Object:
```javascript
 [   { EntryTypeName: 'Payment',
       ItemTypeId: 10,
       ItemTypeName: 'Deposit',
       ItemId: 'an ID',
       ItemReference: 'DEPO1001055',
       AmountCredit: 500000,
       AmountDebit: 0,
       ValueDate: 2018-03-15T00:00:00.000Z,
       BankMemo: 'TEST Examples' },
     { EntryTypeName: 'Settlement',
       ItemTypeId: 10,
       ItemTypeName: 'Deposit',
       ItemId: 'an ID',
       ItemReference: 'DEPO1001084 / SPOT1009654',
       AmountCredit: 0,
       AmountDebit: 1000,
       ValueDate: 2018-03-26T00:00:00.000Z,
       BankMemo: 'ACCOUNT INSTANT TRANSFER' } 
]
```

### CustomerUserSearch
### FXDealQuoteBook
### FXDealQuoteBookAndInstantDeposit
### FXDealQuoteCreate
### GetCustomerAccountAliasList
### GetCustomerAccountBalances
### GetLibraryVersion
### InstantPaymentCreate
### InstantPaymentGetSingle
### InstantPaymentPost
### InstantPaymentSearch
### UserPasswordChange
### UserPasswordReset
### UserSettingsGetSingle

This service returns all the settings, The user id will be required in other services.

#### Call
let args = {
    request: {
        ServiceCallerIdentity: {
            LoginId: userLogin,
            Password: userPassword,
            ServiceCallerId: callerId // iou_caller_id / bank id
        }
    }
};
#### Response Object
```javascript
{ UserSettingsGetSingleResult: 
   { ServiceResponse: 
      { HasErrors: false,
        HasWarnings: false,
        Responses: 
         { ServiceResponseData: 
            { ResponseCode: 0,
              ResponseType: 'Information',
              Message: 'Success',
              MessageDetails: 'Command completed successfully',
              FieldName: undefined,
              FieldValue: undefined } } },
     UserSettings: 
      { AccessRights: 
         { AccessRightData: 
            [ 
                { 
                    AccessRightCategoryName: 'Customers',
                    AccessRightDescription: 'Manage all the users from the same customer.',
                    AccessRightId: 6,
                    AccessRightName: 'Manage Customer Users',
                    CanOverrideDualControl: false,
                    LimitAmount: 0,
                    UsesDualControl: false,
                    UsesLimitAmount: false 
                }
            ]

        },
        BankID: 'the bank ID code - 00000000-0000-0000-0000-000000000000',
        BaseCountryCode: 'US',
        BaseCurrencyCode: 'THB',
        BaseCurrencyID: 141,
        BelongsToWhiteLabelBranch: false,
        BranchID: 'The branch Id if any - 00000000-0000-0000-0000-000000000000',
        CultureCode: 'en-US',
        CultureID: 1,
        EmailAddress: 'yourKYCEmail address',
        Fax: "String or undefined",
        FirstName: 'String',
        IsACHBatchFeatureEnabled: true,
        IsBankAutoCoverFeatureEnabled: true,
        IsBankIncomingPaymentEnabled: true,
        IsBankInstantPaymentFeatureEnabled: true,
        IsCurrencyCalculatorEnabled: true,
        IsEnabled: true,
        IsFileAttachmentFeatureEnabled: true,
        IsLockedOut: false,
        IsManageCustomOFACListsFeatureEnabled: true,
        IsPaymentValueTypeEnabled: true,
        IsSWIFTMessageFeatureEnabled: true,
        IsTradeFinanceFeatureEnabled: true,
        IsTwoFactorAuthenticationFeatureEnabled: false,
        IsTwoFactorAuthenticationRequired: false,
        LastName: 'Hundertmark',
        LinkedAccessRightTemplateID: 'an ID 00000000-0000-0000-0000-000000000000',
        LinkedAccessRightTemplateName: 'AllCustomerAccessRight',
        OrganizationID: 'an ID - 00000000-0000-0000-0000-000000000000',
        OrganizationName: 'a String from your KYC',
        OrganizationTypeID: 2,
        PageTitle: undefined,
        Phone: undefined,
        Theme: 'TSG',
        UserId: '00000000-0000-0000-0000-000000000000 - That is the ID you want',
        UserName: 'Ralf4IOU',
        WhiteLabelProfileID: '00000000-0000-0000-0000-000000000000' } } }

```
>Note:
> The import field to use from the response is the UserId field has this is used in suquent calls of the webservice


## Wallet Demo

https://demoewallet.winstantpay.com/

## Support

Support for the WinstantPay API is available through the WinstantPay API team. We will share the details about how to interact with our teams at the end of the KYC process.  Should you have pUiany issues before that you can send a twitter message to us to <api@winstantpay.com>

## License

WinstantPay API example scripts are released under the MIT license.










