# Authentication and User Microservices with Moleculer.js

**Description:**
This repository contains the source code and documentation for a robust Authentication and User Microservices architecture built with Moleculer.js.
The project is designed to provide a secure and scalable solution for user authentication and management, suitable for a wide range of applications.

**Key Features:**
- **Authentication Microservice:**
    - User registration with MongoDB storage.
    - User login and JWT token generation.
    - Token refresh functionality for extended sessions.
    - Forgot password functionality with email notifications (RMQ).
    - Redis integration for efficient token caching.

- **User Microservice:**
    - User details retrieval for regular users.
    - User details retrieval by ID for administrators.
    - User listing for administrators.
    - MySQL database storage with TypeORM.

**Technology Stack:**
- Moleculer.js for microservices architecture.
- TypeScript for type-safe development.
- MongoDB for user authentication data storage.
- MySQL with TypeORM for user-related data.
- Redis for JWT token caching.
- RabbitMQ (RMQ) for asynchronous tasks.
- JWT for authentication and authorization.

**Usage:**
1. Clone the repository.
2. Set up and configure the services according to the provided documentation.
3. Deploy and scale the microservices as needed.
4. Integrate the authentication and user services into your application.

**Documentation:**
Comprehensive documentation and API reference can be found in the project's [Wiki](wiki-url).

**Contributing:**
We welcome contributions from the community! Please read our [Contribution Guidelines](CONTRIBUTING.md) for more details on how to get involved.

**License:**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

**Author:**
Me


[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# Auth-User-Microservice
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Usage
Start the project with `npm run dev` command.
After starting, open the http://localhost:3000/ URL in your browser.
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.
- `call products.list` - List the products (call the `products.list` action).


## Services
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
- **products**: Sample DB service. To use with MongoDB, set `MONGO_URI` environment variables and install MongoDB adapter with `npm i moleculer-db-adapter-mongo`.

## Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose
