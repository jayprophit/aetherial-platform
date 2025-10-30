import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';
import { swaggerSpec } from './swagger';
import { Config } from '../config';

// Generate OpenAPI specification
export const generateOpenAPISpec = () => {
  try {
    // Ensure docs directory exists
    const docsDir = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Write OpenAPI spec to file
    const outputFile = path.join(docsDir, 'openapi.json');
    fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2));
    
    console.log(`OpenAPI specification generated at: ${outputFile}`);
    return swaggerSpec;
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
    return swaggerSpec;
  }
};

// Swagger UI options
const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: 'Aetherial Platform API Documentation',
  customCss: `
    .topbar { display: none }
    .swagger-ui .info { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 4px; }
    .swagger-ui .info .title { color: #3b4151; }
    .swagger-ui .opblock-tag { font-size: 16px; padding: 10px 0; }
    .swagger-ui .opblock { margin-bottom: 20px; border-radius: 4px; }
    .swagger-ui .opblock .opblock-summary-description { font-size: 13px; }
    .swagger-ui .opblock .opblock-summary { padding: 8px 15px; }
    .swagger-ui .opblock .opblock-section-header { padding: 8px 20px; }
    .swagger-ui .opblock .opblock-section-header h4 { font-size: 14px; }
    .swagger-ui .opblock .opblock-section-header label { font-size: 13px; }
    .swagger-ui .opblock .opblock-section-header .tab-header { margin: 0; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item { padding: 0 10px; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item:first-child { padding-left: 0; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item.active { font-weight: 600; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item:not(.active) { opacity: 0.7; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item:not(.active):hover { opacity: 1; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item:not(:last-child) { margin-right: 10px; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item:not(:last-child):after {
      content: '|';
      margin-left: 10px;
      color: #ccc;
    }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item:last-child { margin-right: 0; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item:last-child:after { display: none; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item .tab-link { color: #3b4151; text-decoration: none; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item.active .tab-link { color: #49cc90; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item:not(.active) .tab-link:hover { color: #1a1a1a; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item .tab-link:focus { outline: none; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item .tab-link:active { color: #49cc90; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item .tab-link:visited { color: #3b4151; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item .tab-link:visited:hover { color: #1a1a1a; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item .tab-link:visited:active { color: #49cc90; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item .tab-link:visited:focus { outline: none; }
    .swagger-ui .opblock .opblock-section-header .tab-header .tab-item .tab-link:visited:visited { color: #3b4151; }
  `,
  customfavIcon: '/favicon.ico',
  customSiteTitle: 'Aetherial Platform API',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true,
    defaultModelExpandDepth: 3,
    defaultModelsExpandDepth: 3,
    defaultModelRendering: 'example',
    displayRequestDuration: true,
    displayOperationId: false,
    persistAuthorization: true,
    tagsSorter: 'alpha',
    operationsSorter: 'method',
    validatorUrl: null,
  },
};

// Initialize Swagger UI
export const setupSwaggerUI = (app: Express) => {
  // Generate OpenAPI spec
  const spec = generateOpenAPISpec();
  
  // Serve Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(spec, swaggerUiOptions, {
      explorer: true,
      customSiteTitle: 'Aetherial Platform API Documentation',
    })
  );
  
  // Serve OpenAPI spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(spec);
  });
  
  console.log(`API documentation available at: ${Config.appUrl}/api-docs`);
};

export default setupSwaggerUI;
