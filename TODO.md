# TODO

## Config file
- url to the index.html file
- query param that is the itemId

## on start:
- fetch the index.html file, and cache in memory

## on request:
- pluck out the item id
- xhr for the item
- inject the headers
  - add to in-process cache
- return index.html


# v0.1 Simplest Thing
- express
- get id, serve headers
- host on now...
