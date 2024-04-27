let userName = "匿名さん"
let ws = new WebSocket("ws://localhost:8000/api/app?password=takotako");
let mostOldMessageDate = Date.now();
// イベントハンドラ
const onload = async () => {
const DefaultMessageDataraw = await fetch(`http://localhost:8000/api/getoldeMessage?password=takotako&when=${mostOldMessageDate}&howMany=15`);
let DefaultMessageData = await DefaultMessageDataraw.json();
if (typeof DefaultMessageData === 'string') {
    DefaultMessageData = JSON.parse(DefaultMessageData);
}
//配列繰り返し処理
if (Array.isArray(DefaultMessageData)) {
    DefaultMessageData.forEach((obj) => {
        const reqDate = obj.timestamp;
        const Date = reqDate.toLocaleString('ja-JP');
        const User = obj.user;
        const Message = obj.message;
        const parent = document.getElementById('chat');
        //全体
        const div = document.createElement('div');
        div.className = 'bg-white p-2 rounded-lg flex mt-2';
        //ユーザー名以外
        const div2 = document.createElement('div');
        //時
        const span1 = document.createElement('div');
        span1.innerText = Date;
        span1.className = 'text-sm';
        //メッセージ
        const span2 = document.createElement('div');
        span2.innerText = Message;
        span2.className = 'text-lg';
        //ユーザー名
        const div3 = document.createElement('div');
        div3.innerText = User;
        div3.className = 'text-xl ml-auto pt-2';
        //追加
        div2.appendChild(span1);
        div2.appendChild(span2);
        div.appendChild(div2);
        div.appendChild(div3);
        parent.appendChild(div);
        if(mostOldMessageDate > obj.timestamp){
            mostOldMessageDate = obj.timestamp;
        }
    });
} else {
    console.error('Data is not an array:', DefaultMessageData);
}
}
ws.onclose = () => {
    alert("接続が切れました。リロードしてください。");
}
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const reqDate = data.timestamp;
    const Date = reqDate.toLocaleString('ja-JP');
    const User = data.user;
    const Message = data.message;
    const parent = document.getElementById('chat');

    //全体
    const div = document.createElement('div');
    div.className = 'bg-white p-2 rounded-lg flex mt-2';
    //ユーザー名以外
    const div2 = document.createElement('div');
    //時
    const span1 = document.createElement('div');
    span1.innerText = Date;
    span1.className = 'text-sm';
    //メッセージ
    const span2 = document.createElement('div');
    span2.innerText = Message;
    span2.className = 'text-lg';
    //ユーザー名
    const div3 = document.createElement('div');
    div3.innerText = User;
    div3.className = 'text-xl ml-auto pt-2';
    //追加
    div2.appendChild(span1);
    div2.appendChild(span2);
    div.appendChild(div2);
    div.appendChild(div3);
    parent.prepend(div);
}
ws.onopen = () => {
    console.log("接続完了");
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
    const inputnameElement = document.getElementById("inputname");
    userName = inputnameElement.value;
    const nameElement = document.getElementById("name");
    nameElement.innerText = "現在の表示名: " + userName;
}

window.addEventListener('load', onload());

