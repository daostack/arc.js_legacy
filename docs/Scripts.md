# Running Arc.js Scripts
Arc.js contains a set of scripts for building, publishing, running tests and migrating contracts to any network.  These scripts are meant to be accessible to and readily usable by client applications.

Typically an application that has installed the Arc.js `npm` package will run an Arc.js script by prefixing "`npm explore @daostack/arc.js -- `" to the name Arc.js script command.  For example, to run the Arc.js script `npm start ganache` from your application, you would run:

```script
npm explore @daostack/arc.js -- npm start ganache
```

Otherwise, when running the scripts at the root of an Arc.js repo, you must omit the `npm explore @daostack/arc.js -- ` so it looks like this.

```script
npm start ganache
```

!!! info "nps"
Other scripts not described here are defined in `package-scripts.js` that is used to configure a tool called [nps](https://www.npmjs.com/package/nps). Arc.js uses `nps` run all of its scripts. While `nps` is installed locally by Arc.js, you can also install it globally and then substitute `npm start` with `nps`, so, when running scripts from the root of an Arc.js repo, it looks like this:

    ```script
    nps ganache
    ```
