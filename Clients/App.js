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
  defaultUserName: "匿名",
  httpplotocoll: "https",
  wsplotocoll: "wss",
  host: "chat.takos.jp",
  password: "a3Xsx2W5MAAv86iBrZdz7LTy8F8c2j",
  defaultLoadMessage: 20,
  updateMessage: 15
};
//アスキーアートオブジェクト
//JavaScriptの割合増やすためなのは内緒
//変数設定
let userName = config.defaultUserName;
const httpplotocoll = config.httpplotocoll;
const wsplotocoll = config.wsplotocoll;
const host = config.host;
const password = config.password;
let mostOldMessageDate = new Date();
let theme
//webSocket接続
const ws = new WebSocket(
  `${wsplotocoll}://${host}/api/app?password=${password}`,
);

//読み込まれたときに実行
const onload = async () => {
  const isDarkmode = getComputedStyle(document.querySelector("html"))
    .getPropertyValue("--isDarkmode");
  console.log(isDarkmode);
  if (isDarkmode == "True") {
    theme = "white"
    ChangeColor(true);
  } else {
    theme = "dark"
    ChangeColor(false);
  }
  const nameElement = document.getElementById("name");
  if (userName == "") {
    nameElement.innerText = "名前を入力してください";
  } else {
    nameElement.innerText = "現在の表示名: " + userName;
  }
  const inputnameElement = document.getElementById("inputname");
  inputnameElement.value = userName;
  const DefaultMessageDataraw = await fetch(
    `${httpplotocoll}://${host}/api/getoldeMessage?password=${password}&when=${mostOldMessageDate}&howMany=${config.defaultLoadMessage}`,
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
  alert("接続が切れました。10秒後にリロードします");
  setTimeout(() => {
    window.location.href = "./client.html";
  }, 10000);
};
//メッセージ受信時
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type == "message") {
    createMessageElement(data, false);
    data.timestamp = new Date(data.timestamp);
  } else if (data.type == "people") {
    const peopeleNumberElement = document.getElementById("peopeleNumber");
    peopeleNumberElement.innerText = data.people + "人";
  }
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


//色変更コーナー
const ChangeColor = (isDarkmode) => {
  if (isDarkmode === true) {
    const bodyElement = document.getElementById("body");
    const headerElement = document.getElementById("header");
    const ChangeNameAreaElement = document.getElementById("ChangeNameArea");
    const EditColorAreaElement = document.getElementById("EditColorArea");
    const explainAreaElement = document.getElementById("explainArea");
    const ChangeThemaAreaElement = document.getElementById("ChangeThemaArea");
    const AAAreaElement = document.getElementById("AAArea");
    const ConnectPeopleAreaElement = document.getElementById(
      "ConnectPeopleArea",
    );
    const footerElement = document.getElementById("footer");
    const ChangeButtonElement = document.getElementById("ChangeButton")
    bodyElement.className = "flex h-screen w-full bg-gray-950";
    headerElement.className = "h-16 bg-gray-900 text-white";
    ChangeNameAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg mb-2 h-1/3 text-white";
    EditColorAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg h-1/3 mb-2 text-white";
    explainAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg h-1/6 flex text-white";
    ChangeThemaAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg h-[25%] mb-2 text-white";
    AAAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg h-1/3 mb-2 text-white";
    ConnectPeopleAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg h-[25%] text-white";
    footerElement.className = "fixed bottom-0 w-full bg-gray-900 h-1/12";
    ChangeButtonElement.className = "w-32 h-32 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-300"
    theme = "dark";
    return;
  } else if (isDarkmode === false) {
    const bodyElement = document.getElementById("body");
    const headerElement = document.getElementById("header");
    const ChangeNameAreaElement = document.getElementById("ChangeNameArea");
    const EditColorAreaElement = document.getElementById("EditColorArea");
    const explainAreaElement = document.getElementById("explainArea");
    const ChangeThemaAreaElement = document.getElementById("ChangeThemaArea");
    const AAAreaElement = document.getElementById("AAArea");
    const ConnectPeopleAreaElement = document.getElementById(
      "ConnectPeopleArea",
    );
    const footerElement = document.getElementById("footer");
    const ChangeButtonElement = document.getElementById("ChangeButton")
    bodyElement.className = "flex h-screen w-full bg-gray-400";
    headerElement.className = "h-16 bg-gray-500 text-white";
    ChangeNameAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg mb-2 h-1/3";
    EditColorAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg h-1/3 mb-2";
    explainAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg h-1/6 flex";
    ChangeThemaAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg h-[25%] mb-2";
    AAAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg h-1/3 mb-2";
    ConnectPeopleAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg h-[25%]";
    footerElement.className = "fixed bottom-0 w-full bg-gray-500 h-1/12";
    ChangeButtonElement.className = "w-32 h-32 bg-slate-800 text-white text-lg font-semibold rounded-full hover:bg-gray-800"
    theme = "white";
    return;
  }
  const bodyElement = document.getElementById("body");
  const headerElement = document.getElementById("header");
  const ChangeNameAreaElement = document.getElementById("ChangeNameArea");
  const EditColorAreaElement = document.getElementById("EditColorArea");
  const explainAreaElement = document.getElementById("explainArea");
  const ChangeThemaAreaElement = document.getElementById("ChangeThemaArea");
  const AAAreaElement = document.getElementById("AAArea");
  const ConnectPeopleAreaElement = document.getElementById("ConnectPeopleArea");
  const footerElement = document.getElementById("footer");
  const ChangeButtonElement = document.getElementById("ChangeButton")
  if (theme == "white") {
    bodyElement.className = "flex h-screen w-full bg-gray-950";
    headerElement.className = "h-16 bg-gray-900 text-white";
    ChangeNameAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg mb-2 h-1/3 text-white";
    EditColorAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg h-1/3 mb-2 text-white";
    explainAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg h-1/6 flex text-white";
    ChangeThemaAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg h-[25%] mb-2 text-white";
    AAAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg h-1/3 mb-2 text-white";
    ConnectPeopleAreaElement.className =
      "m-auto w-full bg-slate-800 rounded-lg h-[25%] text-white";
    footerElement.className = "fixed bottom-0 w-full bg-gray-900 h-1/12";
    ChangeButtonElement.className = "w-32 h-32 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-300"
    theme = "dark";
  } else if (theme == "dark") {
    bodyElement.className = "flex h-screen w-full bg-gray-400";
    headerElement.className = "h-16 bg-gray-500 text-white";
    ChangeNameAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg mb-2 h-1/3";
    EditColorAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg h-1/3 mb-2";
    explainAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg h-1/6 flex";
    ChangeThemaAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg h-[25%] mb-2";
    AAAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg h-1/3 mb-2";
    ConnectPeopleAreaElement.className =
      "m-auto w-full bg-slate-200 rounded-lg h-[25%]";
    footerElement.className = "fixed bottom-0 w-full bg-gray-500 h-1/12";
    ChangeButtonElement.className = "w-32 h-32 bg-slate-800 text-white text-lg font-semibold rounded-full hover:bg-gray-800"
    theme = "white";
  }
};

//メッセージ生成用関数
const createMessageElement = (data, isAppend) => {
  //組み立て
  const reqDate = data.timestamp;
  const User = data.user;
  const Message = data.message;
  const parent = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = "p-2 rounded-lg flex mt-2";
  div.style = `background-color: ${data.bgColor}`;
  const div2 = document.createElement("div");
  const span1 = document.createElement("div");
  span1.innerText = formatDate(new Date(reqDate));
  span1.className = "text-sm";
  span1.style = `color: ${data.timeColor}`;
  const span2 = document.createElement("div");
  span2.innerText = Message;
  span2.className = "text-lg";
  span2.style = `color: ${data.textColor}`;
  const div3 = document.createElement("div");
  div3.innerText = User;
  div3.className = "text-xl ml-auto pt-2 mt-auto mb-auto";
  div3.style = `color: ${data.nameColor}`;
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
};

//ページ移動用関数
changePage = (page) => {
  window.location.href = page;
};
//webSocketが接続されたとき
ws.onopen = () => {
  console.log("接続完了");
};
ws.onerror = () => {
  alert("WebSocket Error")
}
//メッセージ送信用関数
const send = () => {
  const messageElement = document.getElementById("message");
  const textColorElement = document.getElementById("text-color");
  const bgColorElement = document.getElementById("bg-color");
  const nameColorElement = document.getElementById("name-color");
  const timeColorElement = document.getElementById("time-color");
  if (
    messageElement.value == "" || textColorElement.value == "" ||
    bgColorElement.value == "" || nameColorElement == "" ||
    timeColorElement == ""
  ) {
    return false;
  }
  //XSS対策
  const message = messageElement.value.replace(/</g, "&lt;").replace(
    />/g,
    "&gt;",
  );
  if (userName == "" || userName == undefined) {
    alert("名前を設定してください");
    return false;
  }
  ws.send(
    JSON.stringify({
      type: "send",
      message: message,
      user: userName,
      password: password,
      textColor: textColorElement.value,
      timeColor: timeColorElement.value,
      bgColor: bgColorElement.value,
      nameColor: nameColorElement.value,
    }),
  );
  messageElement.value = "";
  console.log("送信完了");
  return;
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
  if (windowHeight + scrolled >= documentHeight - 10) {
    const result = await fetch(
      `${httpplotocoll}://${host}/api/getoldeMessage?password=${password}&when=${mostOldMessageDate}&howMany=${config.updateMessage}`,
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

//接続されている数取得

setInterval(() => {
  const test = {
    type: "people",
    password: password,
  };
  ws.send(JSON.stringify(test));
}, 1000);
