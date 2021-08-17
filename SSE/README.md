# Window <-> worker communication by Broadcast & IndexDB

## Service worker
* Increase counter each second and notify counter value to window.
* Each 5 seconds, write time to DB and notify new register to window.
* Listen for window notifications:
  * clean: remove oldest registers from DB
  * click: increase clicks counter and notify to window new value.

## Window
* Listen for worker notifications:
  * click: update DIV content.
  * counter: update another DIV content.
  * updateDB:
    * log last register.
    * Update UL content.
    * Request DB cleaning to worker.
