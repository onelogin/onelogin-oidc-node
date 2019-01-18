# OneLogin OpenId Connect Authorization Code Flow Sample

The sample is an [Express.js](https://expressjs.com/) app that uses
[Passport.js](http://www.passportjs.org/) and the [Passport-OpenIdConnect](https://github.com/jaredhanson/passport-openidconnect)
module for managing user authentication.

The sample tries to keep everything as simple as possible so only
implements
* Login - redirecting users to OneLogin for authentication
* Logout - destroying the local session and revoking the token at OneLogin
* User Info - fetching profile information from OneLogin

## Setup
In order to run this sample you need to setup an OpenId Connect
app in your OneLogin Admin portal.

If you don't have a OneLogin developer account [you can sign up here](https://www.onelogin.com/developer-signup).

Note: This sample uses the `POST` method for retrieving an `access_token`. Make sure you set the **Token Endpoint Authentication Method** in your OneLogin OIDC Application to **POST**.

1. Clone this repo
2. Rename `.env.sample` to `.env` and update the **client_id** and
**client_secret** you obtained from OneLogin as well as the Redirect Uri of your local site.

*You need to make sure that the Redirect URI matches what you specified as the
Redirect Uri when you setup your OIDC app connector in the OneLogin portal.*

## Run
This sample uses an express app running on nodejs.

From the command line run
```
> npm install
> npm start
```

### Local testing
By default these samples will run on `http://localhost:3000`.

You will need to add your callback url to the list of approved **Redirect URIs** for your OneLogin OIDC app via the Admin portal. e.g. `http://localhost:3000/oauth/callback`