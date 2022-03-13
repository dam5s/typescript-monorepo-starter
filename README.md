# Typescript MonoRepo

This is a monorepo using React/Redux/Typescript on the frontend and Hapi/Typescript on the backend.

## Dev dependencies

 * [Node 16](https://nodejs.org/)
 * [Docker](https://www.docker.com/get-started)
 * [Pack](https://buildpacks.io/docs/tools/pack/)

## Running the build

```
npm install
npx jake
```

## Building the container

```
npm install
npx jake deployments:app
```

## Running the built container

```
docker run --name starter-app --env PORT=5001 -p 5001:5001 starter-app\
```
