# winstantpay-api.js [![npm](https://img.shields.io/npm/v/llnode.svg?style=flat-square)](https://npmjs.org/package/llnode)
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

After you have all you credentials please follow the following steps (explained in section **Examples"" below

1. Get your user-id from the server by calling the UserSettingsGetSingle endpoint of the webservice. 
2. Call the endpoints as shown in the section **Endpoints**

## Examples

### Getting your UserId
### Check Balances
### Check Balances
### Get a Foreign Echange(FX) Quote
### Make am Instant Payment


## Endpoints

### CurrencyListGetPaymentCurrencies


### CustomerAccountBalancesGet
### CustomerAccountBalancesGet
### CustomerAccountStatementGetSingle
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

####Call

| Parameter       | Type   | Description    |
| --------------- | ------ | -------------- |
| LoginId         | String | Your User ID   |
| Password        | String | Your Password  |
| ServiceCallerId | String | Your callerI d |

#### Response Object

| Parameter                               | Type     | Description            |
| ---------                               | ----     | ---------------------- |
|AccessRights                             | Array    |                        |
|BankID                                   | String   |                        |
|BaseCountryCode                          | String   |                        |
|BaseCurrencyCode                         | String   |                        |
|BaseCurrencyID                           | String   |                        |
|BelongsToWhiteLabelBranch                | String   |                        |
|BranchID                                 | String   |                        |
|CultureCode                              | String   |                        |
|CultureID                                | String   |                        |
|EmailAddress                             | String   |                        |
|Fax/                                     | String   |                        |
|FirstName                                | String   |                        |
|IsACHBatchFeatureEnabled                 | String   |                        |
|IsBankAutoCoverFeatureEnabled            | String   |                        |
|IsBankIncomingPaymentEnabled             | String   |                        |
|IsBankInstantPaymentFeatureEnabled       | String   |                        |
|IsCurrencyCalculatorEnabled              | String   |                        |
|IsEnabled                                | String   |                        |
|IsFileAttachmentFeatureEnabled           | String   |                        |
|IsLockedOut                              | String   |                        |
|IsManageCustomOFACListsFeatureEnabled    | String   |                        |
|IsPaymentValueTypeEnabled                | String   |                        |
|IsSWIFTMessageFeatureEnabled             | String   |                        |
|IsTradeFinanceFeatureEnabled             | String   |                        |
|IsTwoFactorAuthenticationFeatureEnabled  | String   |                        |
|IsTwoFactorAuthenticationRequired        | String   |                        |
|LastName                                 | String   |                        |
|LinkedAccessRightTemplateID              | String   |                        |
|LinkedAccessRightTemplateName            | String   |                        |
|OrganizationID                           | String   |                        |
|OrganizationName                         | String   |                        |
|OrganizationTypeID                       | String   |                        |
|PageTitle/                               | String   |                        |
|Phone/                                   | String   |                        |
|Theme                                    | String   |                        |
|UserId                                   | String   |                        |
|UserName                                 | String   |                        |
|WhiteLabelProfileID                      | String   |                        |

>Note:
> The import field to use from the response is the UserId field has this is used in suquent calls of the webservice


## Wallet Demo

https://demoewallet.winstantpay.com/

## Support

Support for the WinstantPay API is available through the WinstantPay API team. We will share the details about how to interact with our teams at the end of the KYC process.  Should you have any issues before that you can send a twitter message to us to <api@winstantpay.com>

## License

WinstantPay API example scripts are released under the MIT license.










