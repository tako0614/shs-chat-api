const ws = new WebSocket("ws://localhost:8000/api/app?password=takotako");
ws.onmessage = (event) => {
console.log(event.data);
}
function send() {

ws.send("Hello, Server!");
}