# Task Overview

## Objective
The objective is to develop a RESTful API in Express.js with SQLite as the database. To show your API, coding and DB skills. You should use the best practises.

## Project Description
The project involves creating CRUD operations for the model user. (the book model is only needed for the bonus task, you can focus on the user model) Task breakdown and expectations are detailed below.

### Task 1: Design RESTful API for "User" Resource

Design the API endpoints for the "user" resource, following CRUD operations, and document them using JSDoc Swagger as comment. see demo in /src/rest/index.ts.

Design the API of "user" resource by creating CRUD operations in JSdoc swagger. code in /src/rest/index.ts

![#c5f015](https://via.placeholder.com/15/c5f015/c5f015.png) Expectations:
* use the best practices: name conventions, methods, return http code etc.
* the swagger doc should show in the `rest-doc/` endpoint
* apply filter and paginations when read user list
* ⭐ Bonus Point: Demonstrated capability to control the returned payload fields, akin to the schema offered by GraphQL.

 
### Task 2: Coding

Implement the code according to the design to fetch data from the db.

![#c5f015](https://via.placeholder.com/15/c5f015/c5f015.png) Expectations:
* swagger params should match with the code and the swagger execution should work.
* error handling, write code in the best fit places(middleware, handler, util function or services etc). 
* validation for the inputs.


### Task 3: API Key

Add API key restrictions, Use middleware to verify api keys.

![#c5f015](https://via.placeholder.com/15/c5f015/c5f015.png) Expectations: 
* handle errors when api key is missing or incorrect.


### Task 4: Changes

Business decides to use "givenName" and "familyName" instead of "firstName" and "lastName", you need to make a API change according to it.

![#c5f015](https://via.placeholder.com/15/c5f015/c5f015.png) Expectations:
the change should be backward compatible and minimum impact.

### Task 5: Logs

Add API logs (show on the terminal is fine) to log api access(path, request), errors, time and status(failed or succeed).

![#c5f015](https://via.placeholder.com/15/c5f015/c5f015.png) Expectations:
* write reusable code, use appropriate design pattern if need. 
* formatting should be easy to read.

### Task 6: Unit test

Add unit test in file `src/index.test.ts`. run test with cli `yarn test` in a new terminal.

![#c5f015](https://via.placeholder.com/15/c5f015/c5f015.png) Expectations: test should cover all the 
* branches of the functions.
* edege cases


### ⭐ Bonus Task: DB design

use db migrations script to set up relationship between user and book, so that 1 user can be the author of many books and 1 book can be co-authored by many authors.

![#c5f015](https://via.placeholder.com/15/c5f015/c5f015.png) Expectations:
* set the correct db relationship. 
* Rest API get author(s) can return book ids. get book[s] can return author ids.


### commands
run migration to load data `yarn migrate:latest`
run migration to remove data `yarn migrate:down`