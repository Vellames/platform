import { ApiBackends } from '/apis/collection/backend';
import _ from 'lodash';

Meteor.methods({
  "syncApiBackends":function () {

    // Check if apiUmbrellaWeb object exists
    if ( typeof apiUmbrellaWeb !== 'undefined' ) {
      // Get API Backends from API Umbrella instance
      var response = apiUmbrellaWeb.adminApi.v1.apiBackends.getApiBackends();
      var apisRemote = response.data.data;
      const apisLocal = ApiBackends.find().fetch();

      _.forEach(apisRemote, function (apiRemote) {

        // Get existing API Backend
        var existingApiBackend = ApiBackends.findOne({'id': apiRemote.id});

        // If API Backend doesn't exist in collection, insert into collection
        if (existingApiBackend === undefined) {
          try {
            ApiBackends.insert(apiRemote);
          } catch (error) {
            console.error("Error inserting apiBackend(" + apiRemote.id + ") : " + error);
          }
        };
      });

      _.forEach(apisLocal, (apiLocal) => {

        const existingApiBackend = _.find(apisRemote, (apiRemote) => {
          return apiRemote.id === apiLocal.id;
        });

        if (!existingApiBackend) {
          ApiBackends.remove({'id': apiLocal.id});
          console.log('removed');
        } else {
          console.log('fine');
        }
      });
    }
  },
  createApiBackendOnApiUmbrella: function (apiBackendForm) {
    // Construct an API Backend object for API Umbrella with one 'api' key
    var constructedBackend = {
      "api": apiBackendForm
    };

    // Response object to be send back to client layer.
    var apiUmbrellaWebResponse = {
      result: {},
      http_status: 200,
      errors: {}
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.apiBackends.createApiBackend(constructedBackend);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  publishApiBackendOnApiUmbrella: function (apiBackendId) {
    // Response object to be send back to client layer.
    var apiUmbrellaWebResponse = {
      result: {},
      http_status: 201,
      errors: {}
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.config.publishSingleApiBackend(apiBackendId);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  updateApiBackendOnApiUmbrella: function (apiUmbrellaBackendId, apiBackend) {
    // Construct an API Backend object for API Umbrella with one 'api' key
    var constructedBackend = {
      "api": apiBackend
    };

    // Response object to be send back to client layer.
    var apiUmbrellaWebResponse = {
      result: {},
      http_status: 204,
      errors: {}
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.apiBackends.updateApiBackend(apiUmbrellaBackendId, constructedBackend);
    } catch (apiUmbrellaError) {

      //set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },

  deleteApiBackendOnApiUmbrella: function (apiUmbrellaApiId) {

    // Response object to be send back to client layer.
    var apiUmbrellaWebResponse = {
      result: {},
      http_status: 204,
      errors: {}
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for deletion in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.apiBackends.deleteApiBackend(apiUmbrellaApiId);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  }
});
