/*
Firstly, we have a well-documented API so a developer will not have any problem for the endpoint.
    We need an API key for authentication, it can be taken from the website after registration.
    We need to web service task cause of the API key encapsulation. But on this research task,
    I will share the example Javascript codes to explain the API work logic.

Restrictions and Important Points 
    - Default rate limits per APIkey are 1000 API requests per day and 50 API requests per minute for all users. 
        * We can not make request for each user. We need to cache the results periodically for spesific locations.
        * If camp will segment the user for the location, we still need to lattitude and langitude info for our API Request. 
        * It can be predetermined by the partner or we need find another way. Ex: For user from Poland -> lat=50, lng=19  
        * If Partner gives the location coordinates as Lattitude and Longitude, it will be easier for developer.   
    - Check the status code : Developer must handle the different response code and decides to visibility of the camp with these info.  
        429 -> Too Many Request -API rate limit was exceeded-
        404 -> Not Found 
        306 -> Not Acceptable        

    - We can get the response text as Polish or English 
    - Coordinate Range : latitude (lat) values can range from -90.0 to +90.0, and longitude (lng) values can range from -180.0 to +180.0.
    - Time : We can filter the results with time or you can take directly current result.  

*/

sQuery.ajax({
    headers: {
        apikey: 'psdQZVrn0XJTDATr0WJDPvsT6tB4sPFn'
    },
    type: 'GET',
    url: 'https://airapi.airly.eu/v2/installations/nearest?lat=50.06&lng=19.9',
    success: function (response) {
        spApi.conLog('OPT-9126', ' In Success', response);
    }
});

sQuery.ajax({
    headers: {
        apikey: 'psdQZVrn0XJTDATr0WJDPvsT6tB4sPFn'
    },
    type: 'GET',
    url: 'https://airapi.airly.eu/v2/measurements/installation?installationId=6883',
    success: function (response) {
        spApi.conLog('OPT-9126', ' In Success', response);
    }
});