# Browser Platform App

Browser Platform app (Main app) for an **io.Connect Browser** project that also acts as a Workspaces App.

## Usage

Go to the project directory and install the necessary dependencies:

```cmd
npm install
```

To start the Browser Platform app, execute the following command:

```cmd
npm start
```

By default, the Browser Platform app will be hosted at `http://localhost:3002`. You can change the port in the `vite.config.ts` file by modifying the `server.port` setting.

The static resources for the Intent Resolver and Modals UI are served from the `public/resources` directory of this app. If you change the app port in `vite.config.ts`, you also need to update the `modals.sources` and `intentResolver.sources` URLs in `src/config.json` to use the same port.
