import { OpenAPIV3 } from 'openapi-types';
import { version } from '../../../package.json';

// Security scheme definitions
const securitySchemes: Record<string, OpenAPIV3.SecuritySchemeObject> = {
  BearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Enter JWT token in the format: Bearer <token>'
  },
  ApiKeyAuth: {
    type: 'apiKey',
    in: 'header',
    name: 'X-API-Key',
    description: 'API key for external services'
  }
};

// Common response schemas
const commonResponses: Record<string, OpenAPIV3.ResponseObject> = {
  UnauthorizedError: {
    description: 'Authentication information is missing or invalid',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse'
        }
      }
    }
  },
  ForbiddenError: {
    description: 'Insufficient permissions',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse'
        }
      }
    }
  },
  NotFoundError: {
    description: 'The requested resource was not found',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse'
        }
      }
    }
  },
  ValidationError: {
    description: 'Invalid request data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ValidationError'
        }
      }
    }
  }
};

// Main OpenAPI specification
export const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Aetherial Platform API',
    version,
    description: 'RESTful API documentation for the Aetherial Platform',
    contact: {
      name: 'API Support',
      email: 'api-support@aetherial.com'
    },
    license: {
      name: 'Proprietary',
      url: 'https://aetherial.com/terms'
    }
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1'
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization'
    },
    {
      name: 'Users',
      description: 'User management endpoints'
    },
    {
      name: 'Posts',
      description: 'Blog posts and content management'
    },
    {
      name: 'Comments',
      description: 'Post comments and interactions'
    },
    {
      name: 'Admin',
      description: 'Administrative operations'
    }
  ],
  paths: {
    // Authentication endpoints
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description: 'Creates a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterUser'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/ValidationError'
          },
          '409': {
            description: 'User already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Authenticate user',
        description: 'Authenticates a user and returns access and refresh tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginUser'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Authentication successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/ValidationError'
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError'
          }
        }
      }
    }
  },
  components: {
    securitySchemes,
    responses: commonResponses,
    schemas: {
      // Common schemas
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'string',
            example: 'Error message'
          },
          message: {
            type: 'string',
            example: 'Detailed error description'
          },
          code: {
            type: 'string',
            example: 'ERROR_CODE'
          },
          details: {
            type: 'array',
            items: {
              type: 'object'
            }
          }
        }
      },
      ValidationError: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'string',
            example: 'Validation Error'
          },
          message: {
            type: 'string',
            example: 'Invalid request data'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  example: 'email'
                },
                message: {
                  type: 'string',
                  example: 'must be a valid email address'
                }
              }
            }
          }
        }
      },
      
      // Authentication schemas
      RegisterUser: {
        type: 'object',
        required: ['email', 'password', 'username'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          password: {
            type: 'string',
            format: 'password',
            minLength: 8,
            example: 'SecurePassword123!'
          },
          username: {
            type: 'string',
            minLength: 3,
            maxLength: 30,
            example: 'johndoe'
          },
          displayName: {
            type: 'string',
            example: 'John Doe'
          },
          acceptTerms: {
            type: 'boolean',
            example: true
          }
        }
      },
      LoginUser: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'SecurePassword123!'
          },
          rememberMe: {
            type: 'boolean',
            default: false
          }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              user: {
                $ref: '#/components/schemas/User'
              },
              tokens: {
                $ref: '#/components/schemas/AuthTokens'
              }
            }
          }
        }
      },
      AuthTokens: {
        type: 'object',
        properties: {
          access: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              },
              expires: {
                type: 'string',
                format: 'date-time',
                example: '2023-12-31T23:59:59.999Z'
              }
            }
          },
          refresh: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              },
              expires: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-31T23:59:59.999Z'
              }
            }
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          username: {
            type: 'string',
            example: 'johndoe'
          },
          displayName: {
            type: 'string',
            example: 'John Doe'
          },
          avatar: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://example.com/avatars/johndoe.jpg'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin', 'moderator'],
            default: 'user'
          },
          isVerified: {
            type: 'boolean',
            default: false
          },
          isActive: {
            type: 'boolean',
            default: true
          },
          lastLogin: {
            type: 'string',
            format: 'date-time',
            nullable: true
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
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ]
};

export default swaggerSpec;
