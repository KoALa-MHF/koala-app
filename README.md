# KoALa Project

Welcome to the KoALa project.

## Local Development

### Prerequisites

- Install [Node.js](https://nodejs.org) 18 LTS version
- Clone this reposistory

### Setup

To install the KoALa app on your local mashine, open a terminal window and run the following command:

```Bash
npm install
```

### Start Frontend

```Bash
nx serve koala-frontend
```

Open the url http://localhost:4200 in a browser

### Start Backend

```Bash
nx serve api
```

Open the url http://localhost:3333/graphql in a browser


### Generate GraphQL Angular Types/Requests

```Bash
nx serve api
npm run codegen
```
