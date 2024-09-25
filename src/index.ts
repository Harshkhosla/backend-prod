import express from "express";

import rest from "./rest";
const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/rest", rest);

// app.use("/graphql", graphql);
app.get("/", function (_req, res) {
  res.json({ data: "Read the README.md!" });
});
// todo - add more routes

export const createApp = (port = 3000) => {
  app.listen(port, function () {
    console.log("Example app listening on port !");
  });
  return app;
};
