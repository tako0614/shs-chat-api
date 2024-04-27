import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  const count = useSignal(3);
  return (
    <>
      <body class="flex h-screen w-full">
        <header class="fixed w-full">
          <nav class="h-16 bg-gray-500 text-white">
            <div class="flex w-11/12 m-auto h-full">
              <div class="text-3xl w-1/5 h-full mt-2">
                <a class="m-auto" href="/">簡易掲示板</a>
              </div>
              <nav class="ml-auto flex">
                <ul class="flex">
                  <li class="pl-10 m-auto">
                    <a href="/home">ログイン</a>
                  </li>
                </ul>
              </nav>
            </div>
          </nav>
        </header>
        <div class="pt-16 h-screen w-full">
          <div class="h-full w-full overflow-y-scroll bg-gray-400">
            <div class="m-2">
              <div class="bg-white p-2 rounded-lg">
                <div class="text-sm">2021/01/01 12:00:00</div>
                <div class="text-lg">Hello, World!</div>
              </div>
            </div>
          </div>
          <div class="fixed bottom-0 w-full bg-gray-500 h-1/12">
            <div class="flex">
              <input
                type="text"
                class="w-11/12 h-12 m-2 rounded-lg"
                id="message"
              />
              <button class="w-1/12 h-12 m-2">送信</button>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}
