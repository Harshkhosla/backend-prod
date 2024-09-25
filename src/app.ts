import { createApp } from "./index";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  failOnErrors: true,
  encoding: "utf-8",
  verbose: true,
  format: "json",
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "cimet API test",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ["./src/rest/*"],
};

const app = createApp();
const swaggerSpec = swaggerJsDoc(options);

app.use(
  "/rest-doc",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      authAction: {
        ApiKeyAuth: {
          name: "x-api-key",
        },
      },
    },
  })
);
