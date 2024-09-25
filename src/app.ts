import { createApp } from "./index";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  encoding: "utf-8",
  verbose: true,
  format: "json",
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "cimet API tets",
      version: "1.0.0",
    },
  },
  definition: {},
  apis: ["./src/rest/*"],
};
const app = createApp();
const swaggerSpec = swaggerJsDoc(options);
app.use("/rest-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
