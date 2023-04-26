---
sidebar_position: 1
---

# Installation

## Prerequisites

- Install [Node.js](https://nodejs.org) 18 LTS version
- Clone this repository

## Setup

To install the KoALa app on your local machine, open a terminal window and run the following command in the root folder of the KoALa app:

```Bash
npm install
```

## Start Frontend

To run the frontend in development mode, run the following command in the root folder of the KoALa app:

```Bash
nx serve koala-frontend
```

or

```Bash
npm run start
```

Open the url http://localhost:4200 in a browser.

## Start Backend

To start the server in development / local mode, run the following command in the root folder of the KoALa app:

```Bash
nx serve api
```

or

```Bash
npm run start:api
```

You can check the GraphQL API through the GraphQL playground by opening the url http://localhost:3333/graphql in a browser.

## Run Frontend and Backend Together

```Bash
npm run start:all
```

### Generate GraphQL Angular Types/Requests

To regenerate the client access objects to the GraphQL server based on the changes in the server, run the following commands in separate sessions in the root folder of the KoALa app (wait for the first command to start the server completely, because a running server is needed for the code generation to work):

```Bash
nx serve api
npm run codegen
```

or

```Bash
npm run start:api
npm run codegen
```

## Execute E2E Tests

First you need to start the KoALa server locally, because the end2end tests rely on a running server instance. You can do that by running the following command in your terminal (see also [Start Backend](#start-backend))

```Bash
nx serve api
```

or

```Bash
npm run start:api
```
