# KoALa Project

Welcome to the KoALa project.

## Local Development

### Prerequisites

- Install [Node.js](https://nodejs.org) 18 LTS version
- Clone this reposistory

### Setup

To install the KoALa app on your local mashine, open a terminal window and run the following command:

```Bash
cd koala-app
npm install
```

### Start Frontend

```Bash
cd koala-app
nx serve koala-frontend
```

Open the url http://localhost:4200 in a browser

### Start Backend

```Bash
cd koala-app
nx serve api
```

Open the url http://localhost:3333/graphql in a browser


### Generate GraphQL Angular Types/Requests

```Bash
cd koala-app
nx serve api
npm run codegen
```
