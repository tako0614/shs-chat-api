//
//
//       npmが使えないので生のJavaScirptで実装しています
//       DOM操作の部分がぐちゃぐちゃなので誰か修正して…
//       接続先サーバーを変更するときやプロトコルを変更する場合はconfigオブジェクトを編集してください
//       できるだけコメントアウトで説明してますが不十分なところがあるかもしれません
//       この掲示板のgithub
//       https://github.com/tako0614/shs-chat-api
//       電気通信法の関係で身内(他人じゃない人)以外で使用するのはお勧めしません(非公開じゃないからたぶん大丈夫だけど)
//       バグがあったら教えて
//
//




//config
const config = {
  useDefaultUserName: false,
  defaultUserName: "",
  httpplotocoll: "https",
  wsplotocoll: "wss",
  host: "chat.takos.jp",
  password: "takotakotakotako"
}
//変数設定
let userName = config.defaultUserName;
const httpplotocoll = config.httpplotocoll;
const wsplotocoll = config.wsplotocoll;
const host = config.host;
const password = config.password;
let mostOldMessageDate = new Date();
//webSocket接続
const ws = new WebSocket(`${wsplotocoll}://${host}/api/app?password=${password}`);




//読み込まれたときに実行
const onload = async () => {
  const nameElement = document.getElementById("name")
  nameElement.innerText = "現在の表示名: " + userName
  const inputnameElement = document.getElementById("inputname")
  inputnameElement.value = userName
  const DefaultMessageDataraw = await fetch(
    `${httpplotocoll}://${host}/api/getoldeMessage?password=${password}&when=${mostOldMessageDate}&howMany=15`,
  );
  let DefaultMessageData = await DefaultMessageDataraw.json();
  if (typeof DefaultMessageData === "string") {
    DefaultMessageData = JSON.parse(DefaultMessageData);
  }
  //メッセージ表示
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

//接続が途切れた場合
ws.onclose = () => {
  alert("接続が切れました。OKを押した後10秒後にリロードします");
  setTimeout(() => {
    window.location.href = "./client.html";
  }, 10000)
};
//メッセージ受信時
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  createMessageElement(data, false);
  data.timestamp = new Date(data.timestamp);
};

//Date型を文字列に変換
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
//名前を変更
const ChangeName = () => {
  const inputnameElement = document.getElementById("inputname");
  //XSS対策
  userName = inputnameElement.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const nameElement = document.getElementById("name");
  nameElement.innerText = "現在の表示名: " + userName;
};


//メッセージ生成用関数
const createMessageElement = (data, isAppend) => {
  //組み立て
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
  //生成
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

//ページ移動用関数
changePage = (page) => {
  window.location.href = page;
};
//webSocketが接続されたとき
ws.onopen = () => {
  console.log("接続完了");
};
//メッセージ送信用関数
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
  if(userName == "" || userName == undefined) {
    alert("名前を設定してください")
    return
  }
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

//開いたときに実行
window.addEventListener("load", onload());


//自動更新
window.onscroll = async () => {
  // ブラウザのビューポートの高さ
  const windowHeight = window.innerHeight;

  // 全体のページの高さ
  const documentHeight = document.documentElement.scrollHeight;

  // スクロールされた量
  const scrolled = window.scrollY;

  // スクロールされた量とビューポートの高さの合計が、全体のページの高さと同じかどうかをチェック
  if (windowHeight + scrolled >= documentHeight) {
    const result = await fetch(
      `${httpplotocoll}://${host}/api/getoldeMessage?password=${password}&when=${mostOldMessageDate}&howMany=15`,
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