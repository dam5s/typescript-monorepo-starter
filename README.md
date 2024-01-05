# Typescript MonoRepo

This is a monorepo using React/Redux/Typescript on the frontend and Hapi/Typescript on the backend.

## Dev dependencies

 * [Node 20](https://nodejs.org/)
 * [Docker](https://www.docker.com/get-started)
 * [Pack](https://buildpacks.io/docs/tools/pack/)
 * [PostgreSQL 14](https://www.postgresql.org)

## Jake setup

```
npm install
npx jake --tasks
```

## Database setup

```
npx jake db:create db:migrate
```

### Creating a new migration

```
npx jake "db:new-migration[name-of-migration]"
```

## Running the build

```
npx jake
```

## Building the container

```
npx jake deployments:app
```

## Running the built container

```
docker run -p 3000:3000 -e PORT=3000 -it --tty --rm --entrypoint web starter-app
```
