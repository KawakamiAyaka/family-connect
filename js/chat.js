function sendMessage() {
    // 'userInput'というIDを持つHTML要素を取得します。これは、ユーザーが入力するテキストフィールドです。
    var input = document.getElementById('userInput');

    // ユーザーが何も入力していない場合（空白のみの場合を含む）、関数はここで終了します。
    if (input.value.trim() === '') {
        return;
    }

    // 新しいメッセージとタイムスタンプを格納するための新しいdiv要素を作成します。
    var messageContainer = document.createElement('div');

    // ユーザーの入力から新しいp要素を作成します。
    var message = document.createElement('p');

    // 現在の時間から新しいspan要素を作成します。
    var timestamp = document.createElement('span');

    // 現在の日付と時間を取得します。
    var date = new Date();

    // 時間を "時:分" の形式で取得します。
    let minutes = date.getMinutes();
    var time = date.getHours() + ":" + minutes.toString().padStart(2, '0');

    // ユーザーの入力をメッセージ要素のテキストとして設定します。
    message.textContent = input.value;

    // 現在の時間をタイムスタンプ要素のテキストとして設定します。
    timestamp.textContent = time;

    // タイムスタンプとメッセージをメッセージコンテナに追加します。
    messageContainer.appendChild(timestamp);
    messageContainer.appendChild(message);
    messageContainer.className = 'message';

    // メッセージコンテナを 'chatbox'というIDを持つHTML要素に追加します。これは、チャットメッセージが表示される領域です。
    document.getElementsByClassName('datewrap')[0].appendChild(messageContainer);

    // 最後に、ユーザーの入力フィールドを空にリセットします。
    input.value = '';
}
