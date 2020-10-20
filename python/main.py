#!/usr/bin/env python

import websockets
import asyncio
import time

async def hello(uri):
    async with websockets.connect(uri) as websocket:
        while True:
            await websocket.send("START_START")
            print("SENT");
            await websocket.recv()
            time.sleep(2)

asyncio.get_event_loop().run_until_complete(
    hello('ws://localhost:2020')
)