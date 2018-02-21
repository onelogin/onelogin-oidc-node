# OneLogin OpenId Connect Node Samples

This repo contains Node.js sample apps that demonstrate the various OpenId Connect flows

## What can I use these for
OpenId Connect is a great way to add user authentication to your application
where you are depending on another party to manage the user identities.

In this case OneLogin can manage the identity of your users making it
faster to get up and running.

## Single Sign On (SSO)
By implementing OpenId Connect via OneLogin you are creating a OneLogin
session which can be used to single sign on from your custom app
into other apps that your users may have access to via the OneLogin portal

## MFA
If MFA is enabled for a user in OneLogin then they will be prompted to
enter a token during the authentication. OneLogin takes care of all of this
for you, making strong authentication much easier to implement in your app.

## Requirements
In order to run any of the sample you will need to create an OpenId Connect
app in your OneLogin Admin portal.

If you don't have a OneLogin developer account [you can sign up here](https://www.onelogin.com/developer-signup).

### Local testing
By default these samples will run on `http://localhost:3000` but since localhost
is not supported by the OIDC spec you will need to use a tool like [Ngrok](https://ngrok.com/)
for local testing.

Install ngrok using `npm install -g ngrok` then run `ngrok http 3000` and Ngrok will
give you a public HTTPS url that you can browse to and see your local app.

You will need to set this Ngrok url as the **redirect_uri** in your OneLogin OIDC app
via the Admin portal.