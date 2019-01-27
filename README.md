# Node.js Bungie.net API Library
This library aims to be the fastest, lightest-weight JavaScript implementation of the Bungie.net API. This project has 3 sacred goals
1. Zero Dependency
1. Fully Asynchronous 
1. Well Documented

# Setup
1. First create a project at `https://www.bungie.net/en/Application`
2. Make sure that your OAuth client type is "Confidential" if you need to make oAuth calls
3. Install this library `npm install bungie-lib`
4. Finally, create an API object as show below
```javascript
  const ApiCredentials = {
    key : "you_secret_key",
    clientId : "your_client_id",
    clientSecret: "your_client_secret"
  }
  
  const BungieLib = require( 'bungie-lib' );
  
  // This will load ALL micro-libraries
  const Api = new BungieLib( ApiCredentials );
```
5. If you only need to load certain endpoints, you can do so by passing an array of micro-libraries that you will need to the BungieLib constructor
```javascript
  const ApiCredentials = {
    key : "you_secret_key",
    clientId : "your_client_id",
    clientSecret: "your_client_secret"
  }
  
  const BungieLib = require( 'bungie-lib' );
  
  // This will only load the Destiny2, Forum, and User Micro-Libraries
  const Api = new BungieLib( ApiCredentials, [ 'destiny2', 'forum', 'user' ] );
```
6. The first thing that you should do now is redirect your end user to the authentication endpoint and have them give your app permission
to interact with their account
```javascript
  // Redirect the end user to the auth uri somehow
  WebSocket.send( Api.authUri );
```
7. Once the user has approved your application, they will be redirected to the uri that you specified at `https://www.bungie.net/en/Application/Detail/`
and your accessCode will be a querystring parameter. Grab it associate it with this client somehow (I use a session store). You'll need this
code if you want to make privileged API requests

# Fully Asynchronous
The library makes extensive use of native ES6 promises. Any non-trivial work load is exectued asynchonously making the library extrememly
scalable. All API call return an [ES6 Promise](http://es6-features.org/#PromiseUsage) that resolves with the parsed Bungie.net API response.
```javascript
  Api.User.getAvailableThemes().then( resp => {
    console.log( resp ); // Do something with the response
  } );
```
This means that you can make as many API calls as you want simultaneously.
```javascript
  // All of these API calls will me made simultaneously.
  let calls = [
    Api.User.searchUsers( 'JackSparrow' ),
    Api.User.getAvailableThemes(),
    Api.Destiny2.searchPlayer( "JackSparrow", "TIGERPSN" ),
    Api.Trending.getTrendingCategory
  ];
  
  // Once all of those API calls have finished, do work
  Promise.all( calls ).then( data => {
    // data[0] is the result of Api.User.searchUsers( 'JackSparrow' ), etc
  } );
```

# Api Call Chaining
The Flexibility of promises allows us to take multiple API calls and chain them one after the other. FOr instance, lets request an oAuth
access token and then immediately refresh that token. (You would never do this in real life, but it's a good example of an instance when
we need one promise to wait on another promise)
```javascript
  Api.OAuth.requestAccessToken( ApiCreds ).then( accessToken => {
    Api.OAuth.refreshAccessToken( accessToken ).then( newAccessToken => {
      // The token will not be renewed until the request has successfully completed
    } )
  } );
```

# Requesting an oAuth token
```javascript
  Api.OAuth.requestAccessToken( ApiCreds.authCode ).then( oAuth => {
    // Save your oAuth tokens. A session store is recommended
  } );
```

# Refreshing an oAuth token
```javascript
  Api.OAuth.refrshAccessToken( oAuth ).then( oAUth => {
    // Save your oAuth tokens. A session store is recommended
  } );
```
