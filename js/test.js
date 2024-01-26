// タイマーを格納するための変数を定義します。
let timer;

// 描画色の初期値を設定します。
let drawColor = 'black';

// 'colorButton'というIDを持つ要素に対して、マウスダウンイベントリスナーを追加します。
document.getElementById('colorButton').addEventListener('mousedown', function() {
    // マウスボタンが押されてから1秒後に、'colorPicker'というIDを持つ要素をクリックするように設定します。
    timer = setTimeout(function() {
        document.getElementById('colorPicker').click();
    }, 500);
});

// 'colorButton'というIDを持つ要素に対して、マウスアップイベントリスナーを追加します。
document.getElementById('colorButton').addEventListener('mouseup', function() {
    // マウスボタンが離されたときに、設定したタイマーをクリアします。
    clearTimeout(timer);
});

// 'colorPicker'というIDを持つ要素に対して、値が変更されたときのイベントリスナーを追加します。
document.getElementById('colorPicker').addEventListener('change', function() {
    // 色選択器の値が変更されたときに、描画色をその値に変更します。
    drawColor = this.value;
});

document.addEventListener('DOMContentLoaded', () => {
    // キャンバス要素とコンテキストの取得
    const canvas = document.querySelector('#canvas');
    const context = canvas.getContext('2d');
    
    // 直前の描画位置の初期化
    const lastPosition = { x: null, y: null };
    
    // ドラッグ中かどうかを示すフラグ
    let isDrag = false;

    // 描画関数
    function draw(x, y) {
        if (!isDrag) {
            return;
        }

        // 描画スタイルの設定
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 3;
        context.strokeStyle = drawColor;  // 描画色を設定

        // パスの開始
        context.beginPath();

        if (lastPosition.x === null || lastPosition.y === null) {
            context.moveTo(x, y);
        } else {
            context.moveTo(lastPosition.x, lastPosition.y);
        }

        // パスの終点
        context.lineTo(x, y);
        context.stroke();

        lastPosition.x = x;
        lastPosition.y = y;
    }

    // ドラッグ開始時の処理
    function dragStart(event) {
        context.beginPath();
        isDrag = true;
    }

    // ドラッグ終了時の処理
    function dragEnd(event) {
        context.closePath();
        isDrag = false;
        lastPosition.x = null;
        lastPosition.y = null;
    }

    // イベントハンドラの初期化
    function initEventHandler() {        
        // マウスイベント
        canvas.addEventListener("mousedown", dragStart);
        canvas.addEventListener("mouseup", dragEnd);

        // マウスがキャンバス外に移動した場合もドラッグ終了とみなす
        canvas.addEventListener("mouseout", () => {
            if (isDrag) {
                dragEnd();
            }
        });

        // pointerEventsを'auto'に設定
        canvas.style.pointerEvents = 'auto';

        // マウス移動イベント
        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;
            draw(x, y);
        });

        // タッチイベント
        canvas.addEventListener("touchstart", (event) => {
            event.preventDefault();
            dragStart(event.touches[0]);
        }, false);

        canvas.addEventListener("touchend", dragEnd, false);

        canvas.addEventListener("touchmove", (event) => {
            event.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const x = (event.touches[0].clientX - rect.left) * (canvas.width / rect.width);
            const y = (event.touches[0].clientY - rect.top) * (canvas.height / rect.height);
            draw(x, y);
        }, false);
    }

    // イベントハンドラの初期化を呼び出し
    initEventHandler();
});

// 'fa-regular fa-pen-to-square'というクラスを持つ要素に対して、クリックイベントリスナーを追加します。
document.querySelector('.fa-regular.fa-pen-to-square').addEventListener('click', function() {
    // 描画色と線の太さを元の値に戻します。
    drawColor = 'black';  // ここでは、例として描画色を黒と仮定しています。
    context.lineWidth = 3;  // 線の太さを3に設定します。
});

// 描画色と線の太さの初期値を設定します。
let lineWidth = 3;

// 'fa-solid fa-eraser'というクラスを持つ要素に対して、クリックイベントリスナーを追加します。
document.querySelector('.fa-solid.fa-eraser').addEventListener('click', function() {
    // 描画色をキャンバスの背景色と同じに設定します。
    drawColor = 'white';  // ここでは、例としてキャンバスの背景色を白と仮定しています。
    lineWidth = 50;  // 線の太さを50に設定します。
});

// 描画関数
function draw(x, y) {
    if (!isDrag) {
        return;
    }

    // 描画スタイルの設定
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = lineWidth;  // 描画色を設定
    context.strokeStyle = drawColor;  // 線の太さを設定

    // パスの開始
    context.beginPath();

    if (lastPosition.x === null || lastPosition.y === null) {
        context.moveTo(x, y);
    } else {
        context.moveTo(lastPosition.x, lastPosition.y);
    }

    // パスの終点
    context.lineTo(x, y);
    context.stroke();

    lastPosition.x = x;
    lastPosition.y = y;
}




