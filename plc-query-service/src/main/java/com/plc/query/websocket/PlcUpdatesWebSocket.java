package com.plc.query.websocket;

import io.quarkus.logging.Log;
import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.WebSocket;
import io.quarkus.websockets.next.WebSocketConnection;

@WebSocket(path = "/ws")
public class PlcUpdatesWebSocket {

    @OnOpen
    void onOpen(WebSocketConnection connection) {
        Log.debugf("PLC WebSocket connected: %s", connection.id());
    }

    @OnClose
    void onClose(WebSocketConnection connection) {
        Log.debugf("PLC WebSocket disconnected: %s", connection.id());
    }
}
