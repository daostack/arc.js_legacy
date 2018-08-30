# Running Arc.js Against a Ganache database

It can be very handy to run Arc.js tests or your application against a Ganache database that is a snapshot of the chain at any given point. Here's how, assuming you are running the script from your application (which is why you see "`npm explore @daostack/arc.js -- `" prepended to each script command).

!!! note
    These instructions are very similar to those you would use when [_not_ running Ganache against a database](Home#migratetoganache).

### Start Ganache

First you want to run Ganache with the appropriate flags that will create a database.

```script
npm explore @daostack/arc.js -- npm start ganacheDb
```

You can use this same command when you a restarting Ganache against a pre-populated database.

### Migrate Contracts

Now migrate the Arc contracts.  You only absolutely need to do this when you are starting from scratch with a new database, but you can do it whenever you wish.

```script
npm explore @daostack/arc.js -- npm start ganacheDb.migrateContracts
```

### Terminate Ganache
To save the current state so that you can restore it later in cases where the database has become no longer useful, manually, in your own OS, terminate the Ganache process you spawned above.

### Zip the Ganache Database
If you want you can zip the database for later reuse when you wish to restore a database to the zipped snapshot.

```script
   npm explore @daostack/arc.js -- npm start ganacheDb.zip
```

At this point you can restart Ganache as above and it will recommence from the point represented in the zipped snapshot. 

### Restore Ganache Snapshot

After running against the database you may want to restart Ganache, recommencing at the point at which you [zipped up a snapshot](#zip-the-ganache-database).

First make sure you have [terminated Ganache](#terminate-ganache), then unzip the database:

```script
   npm explore @daostack/arc.js -- npm start ganacheDb.restoreFromZip
```
Now when you restart ganacheDb it will be running against the previously-zipped snapshot.

### Start Clean
To start again fully from scratch, an empty database, you can clean out the pre-existing database.  Note this can take a long time as there may be thousands of files to delete:

```script
   npm explore @daostack/arc.js -- npm start ganacheDb.clean
```
