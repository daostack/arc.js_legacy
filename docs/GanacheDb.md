# Running Arc.js Against a Ganache database

It can be very handy to run Arc.js tests or your application against a Ganache database that is a snapshot of the chain at any given point. Here's how, assuming you are running the script from your application (which is why you see "`npm explore @daostack/arc.js -- `" prepended to each script command).

Note that some of these instructions are very similar to what you see when [_not_ running Ganache against a database](Home.md#setting-up-a-testnet-with-arc-contracts).

## Run Ganache

First you want to run Ganache with the appropriate flags that will create a database.

```script
   npm explore @daostack/arc.js -- npm start test.ganacheDb.run
```

## Migrate the Arc Contracts

Then migrate the Arc contracts [review the full documentation on migrating contracts](Home.md#setting-up-a-testnet-with-arc-contracts):

```script
   npm explore @daostack/arc.js -- npm start migrateContracts
```

## Terminate Ganache
To let this be your snapshot, manually in your own OS, terminate the Ganache process you spawned above. You will see it running as a "node" process.

## Zip the Ganache Database
Now zip the database for later reuse to start from this point in the chain.

```script
   npm explore @daostack/arc.js -- npm start test.ganacheDb.zip
```

At this point you can restart Ganache as above and it will commence from the point represented in the database. 

## Restore Ganache Snapshot

After running against the snapshot you may want to restart it, commencing at the point at which you [zipped it](#zip-the-ganache-database).

First make sure you have [terminated Ganache](#terminate-ganache), then unzip the database:

```script
   npm explore @daostack/arc.js -- npm start test.ganacheDb.restoreFromZip
```
Now when you restart ganacheDb it will be running against the previously-zipped database.

## Start Clean
To start again fully from scratch, an empty database, you can clean out the pre-existing database.  Note this can take a long time as there may be thousands of files to delete:

```script
   npm explore @daostack/arc.js -- npm start test.ganacheDb.clean
```
