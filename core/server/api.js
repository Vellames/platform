/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Restivus } from 'meteor/nimble:restivus';

const ApiV1 = new Restivus({
  apiPath: 'apinf-rest',
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  useDefaultAuth: true,
  prettyJson: true,
  enableCors: true,
});

// Add Restivus Swagger configuration - meta, tags, params, definitions
ApiV1.swagger = {
  meta: {
    swagger: '2.0',
    info: {
      version: '1.0.0',
      title: 'Admin API',
    },
    securityDefinitions: {
      userSecurityToken: {
        in: 'header',
        name: 'X-Auth-Token',
        type: 'apiKey',
      },
      userId: {
        in: 'header',
        name: 'X-User-Id',
        type: 'apiKey',
      },
    },
  },
  tags: {
    api: 'APIs',
  },
  params: {
    apiId: {
      name: 'id',
      in: 'path',
      description: 'Pass ID of the API',
      required: true,
      type: 'string',
    },
    optionalSearch: {
      name: 'q',
      in: 'query',
      description: 'Pass an optional search string for looking up inventory.',
      required: false,
      type: 'string',
    },
    organization: {
      name: 'organization',
      in: 'query',
      description: 'Pass an optional organization id. ' +
      'Parameter will limit results to the given organization.',
      required: false,
      type: 'string',
    },
    skip: {
      name: 'skip',
      in: 'query',
      description: 'Number of records to skip for pagination.',
      required: false,
      type: 'integer',
      format: 'int32',
      minimum: 0,
    },
    limit: {
      name: 'limit',
      in: 'query',
      description: 'Maximum number of records to return in query.',
      required: false,
      type: 'integer',
      format: 'int32',
      minimum: 0,
      maximum: 50,
    },
    lifecycle: {
      name: 'lifecycle',
      in: 'query',
      description: 'Limit the listing based on lifecycle status of APIs.',
      required: false,
      type: 'string',
      enum: ['design', 'development', 'testing', 'production', 'deprecated'],
    },
    api: {
      name: 'api',
      in: 'body',
      description: 'Data for adding or editing API',
      schema: {
        $ref: '#/definitions/api',
      },
    },
  },
  definitions: {
    // The schema defining the type used for the body parameter.
    api: {
      required: ['name', 'url'],
      properties: {
        name: {
          type: 'string',
          example: 'My REST API',
        },
        description: {
          type: 'string',
          example: 'My REST API description',
        },
        url: {
          type: 'string',
          format: 'url',
          example: 'https://my.rest.api.com/v1',
        },
        lifecycleStatus: {
          type: 'string',
          enum: ['design', 'development', 'testing', 'production', 'deprecated'],
        },
      },
    },
  },
};

// Enable user endpoints if authentication is enabled
if (ApiV1._config.useDefaultAuth) {
  // Meteor.users collection
  ApiV1.addCollection(Meteor.users, {
    excludedEndpoints: ['getAll', 'put', 'patch'],
    routeOptions: {
      authRequired: true,
    },
    endpoints: {
      // GET /apinf-rest/v1/users/:id
      get: {
        swagger: {
          description: 'Returns user with given ID.',
          responses: {
            200: {
              description: 'One user.',
            },
          },
        },
      },
      // POST /apinf-rest/v1/users/
      post: {
        authRequired: false,
        swagger: {
          description: 'Add user.',
          responses: {
            200: {
              description: 'Return user that was added.',
            },
          },
        },
      },
      // DELETE /apinf-rest/v1/users/:id
      delete: {
        roleRequired: 'admin',
        swagger: {
          description: 'Delete user.',
          responses: {
            200: {
              description: 'Successful delete.',
            },
          },
        },
      },
    },
  });
}

// Generate Swagger to route /apinf-rest/v1/swagger.json
ApiV1.addSwagger('swagger.json');

export default ApiV1;
