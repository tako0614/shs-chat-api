let userName = "匿名さん"
const ws = new WebSocket("ws://localhost:8000/api/app?password=takotako");

ws.onmessage = (event) => {
    console.log(event.data);
}
ws.onopen = () => {
    //console.log("接続完了");
    const parent = document.getElementById('parent');
    const child = document.createElement('div');
    child.id = "child";
};
const send = () => {
    const messageElement = document.getElementById("message");
    if (messageElement.value === "") {
        return;
    }
    ws.send(JSON.stringify({type: "send", message: messageElement.value, user: userName, password: "takotako"}));
    messageElement.value = "";
    console.log("送信完了");
}

const ChangeName = () => {
    const nameElement = document.getElementById("name");
    userName = nameElement.value;
    nameElement.value = "";
}

