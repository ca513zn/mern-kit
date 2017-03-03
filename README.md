Mern-Kit
========
mern-kit is designed to be a starter kit which provides everything needed in a full stack application using Mongoose (MongoDB), Express, React, and Node, all running inside a docker container.

## STATUS
* MVP (Minimum Viable product) - In Progress
* Mocha Tests - In Progress
* Jest Tests - Coming soon

## Getting started
1. Make sure you have the latest version of [Docker](https://www.docker.com/products/docker) installed. Docker for Mac and Windows comes with the latest docker-compose. For linux, you may need to install docker-compose manually.
2. Copy `secrets/local.secrets.example` to `secrets/local.secrets` and fill in the appropriate fields.
3. Run the start command, `docker-compose up`.
4. Open `localhost:3000`.

## Architecture
The architecture got it's inspiration from a project I worked on that is service oriented. Each folder in src contains all the routes, models, controllers, components, scripts, templates, and configurations necessary for it to integrate with the application. A 'service' folder structure looks like the following:

```
sample
  |- README.md
  |- client
    |- components
    |- css
    |- sample.js
    |- webpack.config.js
  |- server
    |- controllers
    |- routes
    |- models
  |- script
    |- sample.database.js
  |- tests
    |- mocha
    |- jest
  |- views
    |- index.pug
```

## Commands
Docker commands generally follow this syntax:
```
docker-compose [options] [command] [args]
```
See [compose reference](https://docs.docker.com/compose/reference/overview/) for a complete list of available options and commands. You can specify which service and commands specific to the service in args. Something like `web npm start` would run `npm start` on the web service.

### Start
Start your container and all necessary services. This will install everything it needs the first time but on subsequent builds will just start the services/containers. If you modify the `package.json` or need to rebuild, see 'Re-build' below.
```
docker-compose up
```

### Re-build
Start and rebuild the containers, this will re-install all your node modules.
```
docker-compose up --build
```

### Test
You have multiple options for running your tests and the commands differ slightly based on the conditions.

If the container is running
```
docker-compose exec web npm test
```

If the container is not running
```
docker-compose run web npm test
```
> Note: `exec` in the previous commands runs the provided command in an already running container for the specified service. Example, `docker-compose exec web npm test` runs `npm test` inside the 'web' container. `run` is a one-off command.

If you need to regenerate jest snapshots
```
docker-compose exec web npm test -- -u
```

If you want to run eslint
```
docker-compose exec web npm run lint
```

### Connect to Mongo
Again, use `exec` if the mongo container is running and `run` if it's not. This will give you shell access to mongo and you can run all of your favorite [mongo shell commands](https://docs.mongodb.com/manual/reference/mongo-shell/).
```
docker-compose exec mongo mongo
```

### Drop collections
This command can be used to drop your mongoose collections. It will iterate over all the scripts in the `<service>/script/` directories. If the scripts have a `dropCollection` export it will be invoked. You can see an example in the [src/app/users/script/users.database.js](./src/app/users/script/users.database.js) file.
```
docker-compose exec web npm run drop
```

### Populate collections
This command can be used to populate your mongoose collections. It will iterate over all the scripts in the `<service>/script/` directories. If the scripts have a `populateCollection` export it will be invoked. You can see an example in the [src/app/users/script/users.database.js](./src/app/users/script/users.database.js) file.
```
docker-compose exec web npm run populate
```

## Tooling
mern-kit has several tools already setup for your convenience. If you would like to change their default configurations, see the sections below.

### Webpack
mern-kit is using Webpack 2 for bundling, asset loading, and hot module replacement in development. Configurations are located in the various environment files.  Common config is in the `src/config/env/default.js` environment file, while development and production configs are in the `src/config/env/development.js` and `src/config/env/production.js` file, respectively. You can also configure aliases and entries inside your service folder.  For example, if you add a service called `sample`, you can add a `webpack.config.js` file in the client folder like so:
```
//- src/app/sample/client/webpack.config.js
module.exports = {
  alias: {
    sample: 'app/sample/client'
  },
  entry: {
    sample: 'app/sample/client/index.js'
  }
};
```

View the user's service for an example.

### CSS - SCSS
mern-kit uses a scss loader so you can import scss files. It also has postcss loader setup with a loader options plugin that adds the autoprefixer. Feel free to add more configurations as necessary to the webpack config in the environment files (`src/config/env`). You can import a scss file like so:
```
//- This assumes you configured a 'users' alias
import 'users/css/app.scss';

//- You could also use relative paths
import '../../css/app.scss';
```

### ES6 - Babel
mern-kit uses babel with the following presets and plugins, but you can always add more to the `.babelrc` if wanted.
```
{
  "presets": ["react", "es2015", "stage-0"],
  "plugins": ["transform-runtime"]
}
```

It is set to apply this loader to all `.js` files, but if you would like to support `.jsx` files as well, just update the loader configuration for the webpack settings in `src/config/env/default.js`.

### Jest(with Enzyme) and Mocha
mern-kit will use globs to find all test files in each service directory. This way you can write tests for your specific service and let mern-kit worry about finding them and running them. For example, if you have a service called `sample`, you could add tests like so:
```
|- sample
  |- tests
    |- jest // For component testing
      |- sample.component.test.js
    |- mocha
      |- sample.model.test.js
      |- sample.controller.test.js
```

## Contributing
Please see the [CONTRIBUTING.md](./CONTRIBUTING.md) if interested in contributing.

## Troubleshooting
If you have questions specific to Docker, Mongo, Node, React, Webpack, or Redux. Check Stack Overflow or consider posting your question there since Stack Overflow has a lot of support already available for those topics. If you have questions on how any of those are used in this repo, don't hesitate to ask in the issues section. If you think you are experiencing a bug, please copy the [ISSUE_TEMPLATE.md](./ISSUE_TEMPLATE.md) and create an issue.

## Docker Tips
Docker can take up some space quickly, and when errors happen, you sometimes get stuck with intermediate containers not being destroyed. Here are a couple of commands to help you see whats going on and clean up your local machine.

### Inspecting
- **View running containers** - `docker ps` or `docker-compose ps`
- **View all containers** - `docker ps -a`
- **View all images** - `docker images`
- **View all volumes** - `docker volume ls`

### Cleanup
- **Remove a container** - `docker rm <CONTAINER_ID>`
- **Remove a image** - `docker rmi <IMAGE_ID>`
- **Remove a volume** - `docker volume rm <VOLUME>`
- **Remove all containers** - `docker rm $(docker ps -aq)`
- **Remove all hanging images** - `docker rmi $(docker images -q -f "dangling=true")`
- **Remove all hanging volumes** - `docker volume rm $(docker volume ls -qf "dangling=true")`

## License
Mern-Kit is [MIT licensed](./LICENSE)
