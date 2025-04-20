# Quiz Mate - Development

This documentation is for developers who want to maintain, enhance or customise the Quiz Mate source code. It contains instructions for how to build and run the application from its source.

Documentation for how to use the released application (as published in the NPM package registry), please refer to regular the [README](README.md).

## Cloning the repository

The repository can be downloaded from GitHub as an archive file, or cloned via `git`:

```sh
git clone https://github.com/david-04/quiz-mate.git
cd quiz-mate
```

Fork the repository and clone the fork (instead of the original repository) if you plan to make and commit changes.

## Running locally (without Docker)

Local development requires Node.js to be installed. There are no other prerequisites.

The first step is always to install the dependencies. This needs to be done separately for the frontend and the backend:

```sh
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Then start the backend server with the following commands:

```sh
cd ../backend
npm start
```

The server runs locally on port `3001` for `HTTP` and `3002` for `HTTPS`. However, the backend server is not accessed directly in the browser. Instead, start the dedicated development server for the frontend:

```sh
cd ../frontend
npm run start
```

This will automatically compile/bundle the frontend and open it in the web browser:

http://localhost:3000

The development server runs in watch mode. Whenever a file is changed, it automatically recompiles the frontend and reflects the changes in browser (hot module reload).

The frontend development server is optimized for fast development and test cycles. On the other hand, assembling a release (as described below), generates an optimized production build. To test this this build (rather than the development-optimized version), compile and bundle the frontend with this command:

```sh
cd ../frontend
npm run build
```

The (re-)start the backend server:

```sh
# stop the backend server if it is running
cd ../backend
npm start
```

The application can now be accessed through via:

| Protocol | URL                                              |
| -------- | ------------------------------------------------ |
| HTTP     | [http://localhost:3001 ](http://localhost:3001 ) |
| HTTPS    | [https://localhost:3002](https://localhost:3002) |

For HTTPS, a self-signed certificate is used. It causes a warning in the browser that needs to be accepted/confirmed.

The production-optimized build neither supports watch mode nor hot module reload. The frontend needs to be rebuilt and the browser page has to be reloaded manually after each code change.

## Running and developing with Docker

The application can also be built and run in Docker. The first step is to build the Docker image:

```sh
# From the project root
docker build -t quiz-mate .
```

Then start the container and pass through ports `3001` (and, if using `HTTPS` also `3002`) to the host:

```sh
# Run with default ports (3001 for HTTP, 3002 for HTTPS)
docker run -p 3001:3001 -p 3002:3002 quiz-mate

# Or map to other ports (e.g., default ports 80 and 443)
docker run -p 80:3001 -p 443:3002 quiz-mate
```

Ports `80` and `443` are privileged ports on UNIX-style operating systems (including MacOS) and require elevated permissions.

Once the container has started, the application can be accessed at:

- http://localhost:3001 (or http://localhost if mapped to port `80`)
- https://localhost:3002 (or https://localhost if mapped to port `443`)

The Docker image includes a sample SSL certificate for development purposes. It is self-signed and will cause a security warning in the browser - which can be safely ignored/confirmed. For production use, mount your own SSL certificates as follows:

```bash
docker run \
  -p 80:3001 \
  -p 443:3002 \
  -v /path/to/your/certs:/app/dist/certs \
  -e HTTPS_CERT_FILE=/app/dist/certs/your-cert.pem \
  -e HTTPS_KEY_FILE=/app/dist/certs/your-key.pem \
  quiz-mate
```

## Assembling a release

Assembling a release means to build/bundle the application into a self-contained, productionized package. This is only required if you've made changes and want to archive or distribute them without contributing changes back to the main project. If you want to feed your code changes back into the main repository, create a pull request instead.

To assemble a release, start by editing the following files. Update the version numbers and (to avoid confusion), also consider changing the application name:

- `frontend/package.json`
- `backend/package.json`
- `CHANGELOG.md`

The next step is to create a production-optimized build of the frontend:

```sh
cd frontend
npm run build
```

Finally, copy all the relevant files to the `dist` directory. This includes the production-optimized frontend build and the backend sources. The latter don't need to be compiled.

```sh
# Create dist directory if it doesn't exist
mkdir -p dist

# Copy all backend files
cp -r backend/* dist/

# Copy the production-optimized frontend build
cp -r frontend/build/* dist/public/

# Copy documentation and license
cp README.md LICENSE CHANGELOG.md dist/
```

Optionally, you can create an archive with the release (replace `X.X.X` with your version number):

```sh
tar -czf quiz-mate-vX.X.X.tar.gz dist/
```

Alternatively, you can build and distribute a Docker image:
```bash
docker build -t quiz-mate:vX.X.X .
```

You can't publish any changes to the `quiz-mate` package in the NPM package registry.
