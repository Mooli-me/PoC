# PoC conclusions

There is a big problem for getting background notifications out of the official O.S. provider dependant API.

Service worker is designed for a short life time, avoiding enegy consumption. There are a work around for avoid service worker to die, fetching from window a file over and over each 20 seconds. That is data and energy consumption.

Moreover, there is no way for get running a worker in the background on operating system start.
As I read, shared worker is better option for longer life time, but... it have a really bad support in many important bowsers and the most movile browsers.
So, if we want to have a movile browser getting notifications, we must to get one of tow solutions:

1. Relay in OS background notifications API, granting OS to access data/metadata and depending on they.
1. Provides a native app (Dart/Flutter?) for who want to get real time notifications.

In the other hand, PoC explorations grant us discover the Broadcast API, much more simple and efficient for get realtime updates from backend. That grant us a mechenism for creating broadcast channels for each chat/gallery, in the way each user can subscribe adecuate channels minimizing complexity and data/power consumption. Message sending can be implemented by a simple Rest API. It will be intersting to explore HTTP/2 for optimizing connection times/overloads in message sending and getting boradcast notifications.

References:
* Shared worker bad support: https://caniuse.com/?search=sharedworker
* Prevent service worker to stop: https://stackoverflow.com/questions/29741922/prevent-service-worker-from-automatically-stopping
* Broadcast channel API: https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
* HTTP/2:
  * https://en.wikipedia.org/wiki/HTTP/2
  * https://nodejs.org/api/http2.html
  * https://webapplog.com/http2-node/
