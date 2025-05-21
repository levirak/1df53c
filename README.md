# Journey Builder React Coding Challenge

A coding challenge from Avantos.

## Running the Project

### Build the project

```
$ npm ci
$ npm run build
```

### Start the dummy server

```
$ git submodule update --init --recursive   # to clone frontendchallengeserver
$ git apply frontendchallengeserver.patch   # fix an upstream bug
$ cd frontendchallengeserver                # cd into the patched repo
$ npm run start                             # start the dummy server
```

Notice that I've included a patch file that needs to be applied before running
the dummy server. This is because there's an upstream bug
([frontendchallengeserver #1](https://github.com/mosaic-avantos/frontendchallengeserver/issues/1)) that
means that the dummy server doesn't recognise the URL from the docs. Please
ensure that that patch is applied before running the server.

### Start the project server

```
$ npm run preview
```

View the site at [http://localhost:4173/](http://localhost:4173/) or type `o`
then enter into the project server terminal.

## Extending the Project

I have taken this project as far as I care to for the moment. To be entirely
sincere, I have low expectations that this effort will yield me an interview,
so I would rather spend my time on other things. But for the sake of the
hypothetical, what future directions would this project have?

### Data Sources

The present endpoint / data source is hard-coded in `App.tsx` to a dummy URL
that will almost certainly only work against the (patched) dummy server. Were
this going to move to production, a system to fill out that URL template
dynamically would be needed. Likewise, pulling a host name from configuration
would be preferable.

Otherwise, a real, genuine persistence layer is desperately needed. Given the
structure of the data, probably a noSQL DB would be appropriate, but everything
I've seen so far suggests it wouldn't be hard to force this into a SQL DB like
SQLite. Either way, extensions to `DatabaseImpl` would need to be made to
account for saving changes out to the database.

### Additional Nodes

So far, only `form` nodes are supported (`FormNode` in `src/Node.tsx`), but I
expect it should be pretty easy to extend to the `branch`, `trigger` and
`configuration` nodes I found documented. I expect this will be a trivial
effort because the data seems to already be formatted for the `xyflow` library
I found to use. Judging by the screenshots from the challenge page, Avantos
uses that very library already, hence the coincidence.

The effort will require fighting TypeScript's type checker, and for the moment
will require intervention in `App.tsx`, when the `DatabaseImpl` is created.
It's not yet clear to me if abstracting out a generic node element is worth the
effort given that I don't know how similar or different they are intended to
appear.

### Organization

The `src` hierarchy is very flat. I'm usually a big file kind of guy and find
it frustrating to have many small files. "Jump to declaration" features in
editors helps, but only so much. As this project hypothetically grew, it will
become useful to enrich the hierarchy, but in general, my bias is toward
splitting late rather than early.

### Documentation

There is a severe dearth of documentation in this project. On the one hand,
this is because I much prefer to write "self-documenting" code by choosing
descriptive names and trying to adhere to what I've heard called "the principal
of least surprise." It is also because this code base has been in a state of
total flux for the entirety of its development, so spending the time to write
doc comments has been an objective waste of time.

As the project hypothetically matured, its structure started to ossify and the
number of people working on it grew, it would become much more worth while to
write those doc comments.
