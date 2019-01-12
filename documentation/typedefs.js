/**
 * @typedef { Object } ApiCreds - An object containing your api credentials
 *   @property { string } ApiCreds.key - The api key you created at https://www.bungie.net/en/Application
 *   @property { (number|string) } ApiCreds.clientId - The oAuth client ID of your application. can be found at https://www.bungie.net/en/Application
 *   @property { string } ApiCreds.userAgent - The user-agent you want to send with your api calls. The suggested format is “AppName/Version AppId/appIdNum (+webUrl;contactEmail)”
 *   @property { string= } oAuthSecret - Required if your project uses oAuth API calls
 * @see {@link https://www.bungie.net/en/Application} for further information
 * @global
 */
 
/**
 * @typedef { Object } MicroLibDefinition - An object containing all of the information about a given micro-library. microLibs.json contains an array of these object that point to each micro-library installed
 *   @property { string } name - The name of the micro-library
 *   @property { string } wrapperKey - The key that the new instance of the micro-library will be assigned to
 *   @property { string } main - The name of the main file for the micro-library
 *   @property { string } path - The path to the root of the micro-library
 */ 
 
/**
 * @typedef { Object } oAuth - An object containing your oAuth access secrets. see {@link module:OAuth~OAuth OAuth.requestAccessToken} for more information
 *   @property { string } access_token - Used to make oAuth protected requests
 *   @porperty { string } token_type - 
 *   @property { int } expires_in - Number of seconds until the access_token expires_in
 *   @property { string } refresh_token - Used to request a new access_token without user interaction
 *   @property { int } refresh_expires_in - Number of minutes until the refresh_token expires and the user has to actively authenticate the application again
 *   @property { number-like } membership_id - The membership ID of the user that authorized the application
 */