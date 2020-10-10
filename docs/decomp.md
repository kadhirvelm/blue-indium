# Blue indium decomposition

## Goals

1. Let's get the scss module loader working correctly first, that feels like the most bite sized problem I can use to dip our toes back into side project territory. Also it's the part of this setup that's easiest to carry over to other projects.
2. Create a generic plugin architecture that lets a developer write their own custom puzzles, both frontend and backend allowing the infrastructure to handle the socket connections and room stability
3. Have a generic set of components that can help augment a puzzle
   1. Like levers, hidden zones, etc

## Assumptions

1. That I will be the only developer adding puzzles, so breaking API changes won't be a big deal
2. That we work in a monorepo, but the puzzles themselves exist in their own namespace
   1. With one package for the common types, one for the backend, and one for the frontend
   2. That the infrastructure knows how to tie the frontend and backend packages together neatly

## Technical requirements

1. Simple way to define a new puzzle
   1. Where the puzzle room state gets distributed to all players
   2. And all metadata associated with the puzzle gets defined
2. Clean way to instantiate the backend logic and frontend rendering
   1. With a simple way to develop new puzzles (i.e. a developer mode)
   2. An extensible puzzle room state to allow new types of puzzles to be created as time goes on

## Ideal API breakdown

API – a place to define common types and implementations of abstract ones
Backend - to define puzzle room state logic
Frontend - to render the current puzzle room state and allow players to interact with the room

Infrastructure level – provide a simple mechanism to change a key and value of the current game state (let's start simple)

Open questions
* Do each of these go in their own packages?
  * I think so – also to make building easy
  * The backend and frontend packages should implement plugin points instead of new systems
* Let's try and do this without a database again, it should be relatively stateless
  * Excepting a cache on the server to reinstate the last game state on crash
* Let's not host the game anywhere this time
  * Maybe a raspberry pi on the home network instead – messing with AWS is a pain in the butt
  * It could also be interesting getting a publishing script in place to push to the local network instead of a box
  * Along with custom code to get a sense of the health on the rapsberry pi

## Backend implementation

1. Identify my puzzle id + other metadata
2. Set an initial room state
3. Define state handlers for room events with payload

## Frontend implementation

1. Get the room state + other metadata
2. Shoot off state events with payload

## Infrastructure implementation

Because we'll only have one implementation running at any given moment, we need:

1. Be able to handle connections and re-connections
2. Load up defined puzzles
3. Allow people to select which puzzles to go into

## Side goals and other thoughts

~~It would be awesome to get rid of team super cell's scss modules loader and replace it with my own custom loader. It shouldn't be super difficult, but will require at the very least a custom webpack loader. The whole scss setup I've got isn't working super well, it'd be a lot nicer if I could write scss and the types just loaded into the dist folder instead of directly into the src.~~

Done!