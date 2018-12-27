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
 * @typedef { function } apiCallback - A function that will be called when a given API call is complete
 *   @param { ApiResult | false } Response - If the API call was successful, Response will be the parsed Bungie.net API response. If the API call failed, Response will be boolean false
 *   @param { Error | false } err - If the API call was successful, err will be boolean false. If the API call failed, Err will be an instance of the standard Error object
 */