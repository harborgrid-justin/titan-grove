/**
 * OpenAPI/Swagger Documentation Generator - Enterprise Grade
 * Implements Fix 40: API documentation (OpenAPI/Swagger)
 */

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { getLogger } from '../../utils/enterprise-logger';
import { getVersionManager } from '../api/version-manager';

interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  contact?: {
    name: string;
    email: string;
    url: string;
  };
  license?: {
    name: string;
    url: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  tags: Array<{
    name: string;
    description: string;
  }>;
  components?: {
    securitySchemes?: any;
    schemas?: any;
    responses?: any;
  };
}

interface APIEndpoint {
  path: string;
  method: string;
  summary: string;
  description?: string;
  tags: string[];
  parameters?: any[];
  requestBody?: any;
  responses: any;
  security?: any[];
  deprecated?: boolean;
  operationId?: string;
}

export class SwaggerDocumentationGenerator {
  private logger = getLogger('SwaggerDocumentationGenerator');
  private config: SwaggerConfig;
  private endpoints = new Map<string, APIEndpoint>();
  private swaggerSpec: any;

  constructor(config: SwaggerConfig) {
    this.config = config;
    this.generateSwaggerSpec();

    this.logger.logBusinessOperation(
      'SWAGGER_DOCUMENTATION_INITIALIZED',
      'SwaggerDocumentationGenerator',
      '',
      'SUCCESS',
      {
        title: config.title,
        version: config.version,
        serversCount: config.servers.length
      }
    );
  }

  private generateSwaggerSpec(): void {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: this.config.title,
          version: this.config.version,
          description: this.config.description,
          contact: this.config.contact,
          license: this.config.license
        },
        servers: this.config.servers,
        tags: this.config.tags,
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            },
            apiKeyAuth: {
              type: 'apiKey',
              in: 'header',
              name: 'X-API-Key'
            },
            sessionAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'titan-session'
            }
          },
          schemas: this.generateCommonSchemas(),
          responses: this.generateCommonResponses(),
          ...this.config.components
        },
        paths: {}
      },
      apis: [] // We'll programmatically add paths
    };

    this.swaggerSpec = swaggerJSDoc(swaggerOptions);
    this.addCommonPaths();
  }

  private generateCommonSchemas(): any {
    return {
      // Error responses
      Error: {
        type: 'object',
        required: ['success', 'error'],
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'string',
            example: 'An error occurred'
          },
          details: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      },

      // Success responses
      SuccessResponse: {
        type: 'object',
        required: ['success'],
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object'
          },
          message: {
            type: 'string'
          }
        }
      },

      // Pagination
      PaginationMeta: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            example: 1
          },
          limit: {
            type: 'integer',
            example: 10
          },
          total: {
            type: 'integer',
            example: 100
          },
          totalPages: {
            type: 'integer',
            example: 10
          }
        }
      },

      PaginatedResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'array',
            items: {}
          },
          meta: {
            $ref: '#/components/schemas/PaginationMeta'
          }
        }
      },

      // User models
      User: {
        type: 'object',
        required: ['id', 'username', 'email'],
        properties: {
          id: {
            type: 'string',
            example: 'user_123'
          },
          username: {
            type: 'string',
            example: 'john_doe'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com'
          },
          roles: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['user', 'admin']
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },

      // Authentication models
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'john_doe'
          },
          password: {
            type: 'string',
            format: 'password'
          },
          rememberMe: {
            type: 'boolean',
            example: false
          }
        }
      },

      LoginResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              },
              refreshToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              },
              expiresIn: {
                type: 'integer',
                example: 3600
              },
              user: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        }
      },

      // Business models
      BusinessEntity: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            type: 'string',
            example: 'entity_123'
          },
          name: {
            type: 'string',
            example: 'Sample Entity'
          },
          description: {
            type: 'string'
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'pending'],
            example: 'active'
          },
          metadata: {
            type: 'object',
            additionalProperties: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      }
    };
  }

  private generateCommonResponses(): any {
    return {
      BadRequest: {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      Unauthorized: {
        description: 'Unauthorized access',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      Forbidden: {
        description: 'Access forbidden',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      Success: {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SuccessResponse'
            }
          }
        }
      }
    };
  }

  private addCommonPaths(): void {
    // Authentication endpoints
    this.addEndpoint({
      path: '/auth/login',
      method: 'post',
      summary: 'User login',
      description: 'Authenticate user and return JWT tokens',
      tags: ['Authentication'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/BadRequest'
        },
        '401': {
          $ref: '#/components/responses/Unauthorized'
        }
      }
    });

    this.addEndpoint({
      path: '/auth/logout',
      method: 'post',
      summary: 'User logout',
      description: 'Invalidate user session and tokens',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          $ref: '#/components/responses/Success'
        },
        '401': {
          $ref: '#/components/responses/Unauthorized'
        }
      }
    });

    this.addEndpoint({
      path: '/auth/refresh',
      method: 'post',
      summary: 'Refresh access token',
      description: 'Get new access token using refresh token',
      tags: ['Authentication'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refreshToken'],
              properties: {
                refreshToken: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Token refreshed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  data: {
                    type: 'object',
                    properties: {
                      accessToken: {
                        type: 'string'
                      },
                      expiresIn: {
                        type: 'integer'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/BadRequest'
        },
        '401': {
          $ref: '#/components/responses/Unauthorized'
        }
      }
    });

    // Health check endpoint
    this.addEndpoint({
      path: '/health',
      method: 'get',
      summary: 'System health check',
      description: 'Check system health and status',
      tags: ['System'],
      responses: {
        '200': {
          description: 'System is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  data: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'healthy'
                      },
                      timestamp: {
                        type: 'string',
                        format: 'date-time'
                      },
                      services: {
                        type: 'object',
                        additionalProperties: {
                          type: 'object',
                          properties: {
                            status: {
                              type: 'string',
                              enum: ['healthy', 'unhealthy', 'degraded']
                            },
                            responseTime: {
                              type: 'number'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Version info endpoint
    this.addEndpoint({
      path: '/version',
      method: 'get',
      summary: 'API version information',
      description: 'Get API version and build information',
      tags: ['System'],
      responses: {
        '200': {
          description: 'Version information',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  data: {
                    type: 'object',
                    properties: {
                      apiVersion: {
                        type: 'string',
                        example: 'v2'
                      },
                      buildVersion: {
                        type: 'string',
                        example: '1.0.0'
                      },
                      buildDate: {
                        type: 'string',
                        format: 'date-time'
                      },
                      supportedVersions: {
                        type: 'array',
                        items: {
                          type: 'string'
                        },
                        example: ['v1', 'v2']
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  public addEndpoint(endpoint: APIEndpoint): void {
    const key = `${endpoint.method.toUpperCase()}:${endpoint.path}`;
    this.endpoints.set(key, endpoint);

    // Add to swagger spec
    if (!this.swaggerSpec.paths[endpoint.path]) {
      this.swaggerSpec.paths[endpoint.path] = {};
    }

    this.swaggerSpec.paths[endpoint.path][endpoint.method.toLowerCase()] = {
      summary: endpoint.summary,
      description: endpoint.description,
      tags: endpoint.tags,
      parameters: endpoint.parameters,
      requestBody: endpoint.requestBody,
      responses: endpoint.responses,
      security: endpoint.security,
      deprecated: endpoint.deprecated,
      operationId: endpoint.operationId || `${endpoint.method.toLowerCase()}${endpoint.path.replace(/[^a-zA-Z0-9]/g, '')}`
    };

    this.logger.logBusinessOperation(
      'SWAGGER_ENDPOINT_ADDED',
      'SwaggerDocumentationGenerator',
      key,
      'SUCCESS',
      {
        path: endpoint.path,
        method: endpoint.method,
        tags: endpoint.tags
      }
    );
  }

  public removeEndpoint(path: string, method: string): void {
    const key = `${method.toUpperCase()}:${path}`;
    this.endpoints.delete(key);

    if (this.swaggerSpec.paths[path] && this.swaggerSpec.paths[path][method.toLowerCase()]) {
      delete this.swaggerSpec.paths[path][method.toLowerCase()];

      // Remove path if no methods left
      if (Object.keys(this.swaggerSpec.paths[path]).length === 0) {
        delete this.swaggerSpec.paths[path];
      }
    }
  }

  public addTag(tag: { name: string; description: string }): void {
    if (!this.swaggerSpec.tags) {
      this.swaggerSpec.tags = [];
    }

    const existingTag = this.swaggerSpec.tags.find((t: any) => t.name === tag.name);
    if (!existingTag) {
      this.swaggerSpec.tags.push(tag);
    }
  }

  public addSchema(name: string, schema: any): void {
    if (!this.swaggerSpec.components) {
      this.swaggerSpec.components = {};
    }
    if (!this.swaggerSpec.components.schemas) {
      this.swaggerSpec.components.schemas = {};
    }

    this.swaggerSpec.components.schemas[name] = schema;
  }

  public getSwaggerSpec(): any {
    return { ...this.swaggerSpec };
  }

  public setupSwaggerUI(app: Express, path: string = '/docs'): void {
    // Swagger UI options
    const swaggerUiOptions = {
      explorer: true,
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        tryItOutEnabled: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        persistAuthorization: true
      },
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #2c5282 }
        .swagger-ui .scheme-container { background: #f8f9fa; padding: 10px; border-radius: 4px; }
      `,
      customSiteTitle: this.config.title + ' API Documentation'
    };

    // Serve Swagger UI
    app.use(path, swaggerUi.serve);
    app.get(path, swaggerUi.setup(this.swaggerSpec, swaggerUiOptions));

    // Serve raw swagger.json
    app.get(`${path}/swagger.json`, (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(this.swaggerSpec);
    });

    // Serve redoc alternative
    app.get(`${path}/redoc`, (req, res) => {
      const redocHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${this.config.title} API Documentation</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
            <style>
              body { margin: 0; padding: 0; }
            </style>
          </head>
          <body>
            <redoc spec-url="${path}/swagger.json"></redoc>
            <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"></script>
          </body>
        </html>
      `;
      res.send(redocHTML);
    });

    this.logger.logBusinessOperation(
      'SWAGGER_UI_SETUP',
      'SwaggerDocumentationGenerator',
      path,
      'SUCCESS',
      {
        docsUrl: path,
        jsonUrl: `${path}/swagger.json`,
        redocUrl: `${path}/redoc`
      }
    );
  }

  public generatePostmanCollection(): any {
    const collection = {
      info: {
        name: this.config.title,
        description: this.config.description,
        version: this.config.version,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      auth: {
        type: 'bearer',
        bearer: [
          {
            key: 'token',
            value: '{{accessToken}}',
            type: 'string'
          }
        ]
      },
      variable: [
        {
          key: 'baseUrl',
          value: this.config.servers[0]?.url || 'http://localhost:3000',
          type: 'string'
        },
        {
          key: 'accessToken',
          value: '',
          type: 'string'
        }
      ],
      item: []
    };

    // Group endpoints by tags
    const groupedEndpoints = new Map<string, APIEndpoint[]>();
    
    for (const endpoint of this.endpoints.values()) {
      for (const tag of endpoint.tags) {
        if (!groupedEndpoints.has(tag)) {
          groupedEndpoints.set(tag, []);
        }
        groupedEndpoints.get(tag)!.push(endpoint);
      }
    }

    // Convert to Postman format
    for (const [tag, endpoints] of groupedEndpoints.entries()) {
      const folder = {
        name: tag,
        item: endpoints.map(endpoint => ({
          name: endpoint.summary,
          request: {
            method: endpoint.method.toUpperCase(),
            header: [
              {
                key: 'Content-Type',
                value: 'application/json'
              }
            ],
            url: {
              raw: `{{baseUrl}}${endpoint.path}`,
              host: ['{{baseUrl}}'],
              path: endpoint.path.split('/').filter(p => p)
            },
            description: endpoint.description
          }
        }))
      };

      collection.item.push(folder);
    }

    return collection;
  }

  public exportDocumentation(): {
    openapi: any;
    postman: any;
    markdown: string;
  } {
    return {
      openapi: this.getSwaggerSpec(),
      postman: this.generatePostmanCollection(),
      markdown: this.generateMarkdownDocs()
    };
  }

  private generateMarkdownDocs(): string {
    let markdown = `# ${this.config.title} API Documentation\n\n`;
    markdown += `${this.config.description}\n\n`;
    markdown += `**Version:** ${this.config.version}\n\n`;

    if (this.config.contact) {
      markdown += `**Contact:** [${this.config.contact.name}](mailto:${this.config.contact.email})\n\n`;
    }

    // Group endpoints by tags
    const groupedEndpoints = new Map<string, APIEndpoint[]>();
    
    for (const endpoint of this.endpoints.values()) {
      for (const tag of endpoint.tags) {
        if (!groupedEndpoints.has(tag)) {
          groupedEndpoints.set(tag, []);
        }
        groupedEndpoints.get(tag)!.push(endpoint);
      }
    }

    // Generate markdown for each group
    for (const [tag, endpoints] of groupedEndpoints.entries()) {
      markdown += `## ${tag}\n\n`;

      for (const endpoint of endpoints) {
        markdown += `### ${endpoint.method.toUpperCase()} ${endpoint.path}\n\n`;
        markdown += `${endpoint.summary}\n\n`;
        
        if (endpoint.description) {
          markdown += `${endpoint.description}\n\n`;
        }

        if (endpoint.deprecated) {
          markdown += `> ⚠️ **Deprecated** - This endpoint is deprecated and may be removed in future versions.\n\n`;
        }

        // Parameters
        if (endpoint.parameters && endpoint.parameters.length > 0) {
          markdown += `**Parameters:**\n\n`;
          markdown += `| Name | Type | Required | Description |\n`;
          markdown += `|------|------|----------|-------------|\n`;
          
          for (const param of endpoint.parameters) {
            markdown += `| ${param.name} | ${param.schema?.type || param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description || ''} |\n`;
          }
          markdown += '\n';
        }

        // Security
        if (endpoint.security && endpoint.security.length > 0) {
          markdown += `**Authentication:** Required\n\n`;
        }

        markdown += '---\n\n';
      }
    }

    return markdown;
  }
}

// Singleton instance
let documentationGenerator: SwaggerDocumentationGenerator | null = null;

export function initializeDocumentation(config: SwaggerConfig): SwaggerDocumentationGenerator {
  if (documentationGenerator) {
    throw new Error('Documentation generator already initialized');
  }
  
  documentationGenerator = new SwaggerDocumentationGenerator(config);
  return documentationGenerator;
}

export function getDocumentationGenerator(): SwaggerDocumentationGenerator {
  if (!documentationGenerator) {
    throw new Error('Documentation generator not initialized. Call initializeDocumentation first.');
  }
  return documentationGenerator;
}

export { SwaggerConfig, APIEndpoint };