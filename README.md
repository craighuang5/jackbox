# Jackbox Client

## About

This client is built with [VueJS]() & [Vuetfify](). It provides an interface for users to establish a WebSocket connection with the *Jackbox Server*. Users can create, join, start, and leave games.

## Installation

1) Clone this repository from Github:

```git clone git@github.com:craighuang5/jackbox.git```

2) Install dependencies:

```npm install```

3) Go to the following file: ```jackbox/src/constants/originConfig.ts``` and edit the file to the following: ```export const serverUrl = 'http://localhost:3000'```. You are most likely testing the jackbox_server repository on your local machine on port 3000. Therefore, the client code will communicate with the development server on your local machine. ```https://jackbox-server.onrender.com``` is our remote server deployed on the Render service.

4) Run the client by reading *Development* or *Production* below.

## Development

For development purposes, nodemon is used for hot reloading. To start the development server:

``` npm run dev```

## Production

For a production server:

```npm run build```

```npm run start```
