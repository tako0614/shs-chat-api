let userName = "匿名さん";
const password = "takotako";
const endpoint = "http://localhost:8000/api";
const webSocketEndpoint = "ws://localhost:8000/api";
let ws = new WebSocket(`${webSocketEndpoint}/app?password=${password}`);
let mostOldMessageDate = new Date();
// イベントハンドラ
const onload = async () => {
  const DefaultMessageDataraw = await fetch(
    `${endpoint}/getoldeMessage?password=${password}&when=${mostOldMessageDate}&howMany=20`,
  );
  let DefaultMessageData = await DefaultMessageDataraw.json();
  if (typeof DefaultMessageData === "string") {
    DefaultMessageData = JSON.parse(DefaultMessageData);
  }
  //配列繰り返し処理
  if (Array.isArray(DefaultMessageData)) {
    DefaultMessageData.forEach((obj) => {
      createMessageElement(obj, true);
    });
    //一番古いメッセージをmostOldMessageDateに代入
    if (DefaultMessageData.length > 0) {
      DefaultMessageData.forEach((obj) => {
        obj.timestamp = new Date(obj.timestamp);
        if (mostOldMessageDate > obj.timestamp) {
          mostOldMessageDate = obj.timestamp;
        }
      });
    }
  } else {
    console.error("Data is not an array:", DefaultMessageData);
  }
};
ws.onclose = () => {
  alert("接続が切れました。リロードしてください。");
};
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  createMessageElement(data, false);
  data.timestamp = new Date(data.timestamp);
};
const formatDate = (date) => {
  const formatted = date
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .split("/")
    .join("-");
  return formatted;
};
function createMessageElement(data, isAppend) {
  const reqDate = data.timestamp;
  const User = data.user;
  const Message = data.message;
  const parent = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = "bg-white p-2 rounded-lg flex mt-2";
  const div2 = document.createElement("div");
  const span1 = document.createElement("div");
  span1.innerText = formatDate(new Date(reqDate));
  span1.className = "text-sm";
  const span2 = document.createElement("div");
  span2.innerText = Message;
  span2.className = "text-lg";
  const div3 = document.createElement("div");
  div3.innerText = User;
  div3.className = "text-xl ml-auto pt-2";
  div2.appendChild(span1);
  div2.appendChild(span2);
  div.appendChild(div2);
  div.appendChild(div3);
  if (isAppend) {
    parent.appendChild(div);
  } else {
    parent.prepend(div);
  }
}
changePage = (page) => {
  window.location.href = page;
};
ws.onopen = () => {
  console.log("接続完了");
};
const send = () => {
  const messageElement = document.getElementById("message");
  if (messageElement.value === "") {
    return;
  }
  //XSS対策
  const message = messageElement.value.replace(/</g, "&lt;").replace(
    />/g,
    "&gt;",
  );
  ws.send(
    JSON.stringify({
      type: "send",
      message: message,
      user: userName,
      password: password,
    }),
  );
  messageElement.value = "";
  console.log("送信完了");
};

const ChangeName = () => {
  const inputnameElement = document.getElementById("inputname");
  //XSS対策
  userName = inputnameElement.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const nameElement = document.getElementById("name");
  nameElement.innerText = "現在の表示名: " + userName;
};

window.addEventListener("load", onload());
window.onscroll = async function () {
  // ブラウザのビューポートの高さ
  const windowHeight = window.innerHeight;

  // 全体のページの高さ
  const documentHeight = document.documentElement.scrollHeight;

  // スクロールされた量
  const scrolled = window.scrollY;

  // スクロールされた量とビューポートの高さの合計が、全体のページの高さと同じかどうかをチェック
  if (windowHeight + scrolled + 10 >= documentHeight) {
    const result = await fetch(
      `${endpoint}/getoldeMessage?password=${password}&when=${mostOldMessageDate}&howMany=15`,
    );
    let data = await result.json();
    data = JSON.parse(data);
    if (Array.isArray(data)) {
      data.forEach((obj) => {
        createMessageElement(obj, true);
      });
    } else {
      console.error("Data is not an array:", data);
    }
    //一番古いメッセージをmostOldMessageDateに代入
    if (data.length > 0) {
      data.forEach((obj) => {
        obj.timestamp = new Date(obj.timestamp);
        if (mostOldMessageDate > obj.timestamp) {
          mostOldMessageDate = obj.timestamp;
        }
      });
    }
  }
};
