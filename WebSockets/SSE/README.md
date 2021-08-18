# Backend <-> worker Server-Sent Events comunication

Reading about how to keep web socket live, I found a unknown technology for me: Server -Sent Events (SSE). Reading the article you can find at bottom, I understand web sockets is not the best option for Mooli, but SSE.

Web sockets don't provides a clear way for keep connection alive. Commonly adopted solution is to implement a heartbeat mechanism for detect disconnections and try to reconnect. Actual Mooli alpha implements this solution and it isn't easy. But more important than that it's heratbeat mechanisms make web sockets inneficient, sending lots of messages only for monitoring connection. SSE, in the other hand, provides a native solution for allow browser 'sleep' until a new message arrives from backend.

In consecuence, I will close the web socket investigation thread for start a new one for SSE.

SSE worls unidirectionally server -> agent.

So, for Mooli we will use a API Rest POST poll for sending messages from browser, and SSE for receiving messages from backend.

Each chat/conversation will be represented by a URL. Worker can subscribe for getting SSE notifications and cant send new messages to the same URL.

Both subscriptions and message sending will require adecuate authentication/authorization.