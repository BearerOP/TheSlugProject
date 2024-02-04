// const swaggerJsdoc = require('swagger-jsdoc');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Your API Description',
    
  },
  host: 'localhost:10000',
};

const outputFile = './swagger_output.json';
const routes = [
    './src/routes/url_routes.js',
    './src/routes/user_validation_routes.js',
    './src/routes/insta_routes.js',
];

swaggerAutogen(outputFile, routes, doc);

