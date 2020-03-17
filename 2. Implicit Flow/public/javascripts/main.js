document.getElementById('login').addEventListener("click", redirectToLogin, false);

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

//
// OIDC Client Configuration
//
const ONELOGIN_CLIENT_ID = 'my-oidc-app-client-id';
const ONELOGIN_SUBDOMAIN = 'my-sub-domain';

var settings = {
    authority: 'https://' + ONELOGIN_SUBDOMAIN + '.onelogin.com/oidc/2',    
    client_id: ONELOGIN_CLIENT_ID,
    redirect_uri: window.location.origin,
    response_type: 'id_token token',
    scope: 'openid profile',

    filterProtocolClaims: true,
    loadUserInfo: true
};
var mgr = new Oidc.UserManager(settings);

//
// Redirect to OneLogin to authenticate the user
//
function redirectToLogin(e) {
  e.preventDefault();

  mgr.signinRedirect({state:'some data'}).then(function() {
      console.log("signinRedirect done");
  }).catch(function(err) {
      console.log(err);
  });
}

//
// Handle the authentication response returned
// by OneLogin after the user has attempted to authenticate
//
function processLoginResponse() {
  mgr.signinRedirectCallback().then(function(user) {
      console.log("signed in", user);

      document.getElementById("loginResult").innerHTML = '<h3>Success</h3><pre><code>' + JSON.stringify(user, null, 2) + '</code></pre>'

  }).catch(function(err) {
      console.log(err);
  });
}

//
// Look out for a authentication response
// then log it and handle it
//
if (window.location.href.indexOf("#") >= 0) {
  processLoginResponse();
}
