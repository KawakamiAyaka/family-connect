// ページが読み込まれたときに実行する処理
document.addEventListener('DOMContentLoaded', ()=>{

    // キャンバスとコンテキストの取得、最後の位置、ドラッグ中かどうかのフラグの初期化
    const canvas = document.querySelector('#canvas');
    const context = canvas.getContext('2d');
    const lastPosition = { x: null, y: null };
    let isDrag = false;

    // タイマー、描画色、コンテキスト、線の幅の初期設定
    let timer;
    let drawColor = 'black';

    let lineWidth = 3;
    let mode = 'pen';  // 初期モードをペンモードに設定

    const textBox = document.getElementById('textBox');
    textBox.style.display = 'none';  // ページを読み込んだときにテキストボックスを非表示にする

    const stampContainer = document.getElementById('stampContainer');
    stampContainer.style.display = 'none';  // 最初はスタンプコンテナを非表示にする


    // スタンプのデータ
    const stamps = [
        { id: 1, image: 'img/stamp_good.png', name: 'スタンプいいね' },
        { id: 2, image: 'img/stamp_happy.png', name: 'スタンプ喜び' },
        { id: 3, image: 'img/stamp_question.png', name: 'スタンプ疑問' },
        { id: 4, image: 'img/stamp_sad.png', name: 'スタンプ悲しい' },
        // 他のスタンプデータ...
    ];

    // 選択されたスタンプ
    let selectedStamp = null;

    // 描画モードの種類
    let selectDraw = true;
    


    // 色選択ボタンが長押しされたときに色選択ダイアログを開く
    document.getElementById('colorButton').addEventListener('touchstart', function(){
        timer = setTimeout(function(){
            document.getElementById('colorPicker').click();
        }, 500);
    });

    // 色選択ボタンが離されたときにタイマーをクリアする
    document.getElementById('colorButton').addEventListener('touchend', function(){
        clearTimeout(timer);
    });

    // 色選択ダイアログで色が選択されたときに描画色を更新する
    document.getElementById('colorPicker').addEventListener('change', function(){
        drawColor = this.value;
    });
    // 描画処理
    function draw(x, y){
        if (!isDrag){
            return;
        }
        if (mode === 'pen' || mode === 'eraser') {
            context.lineCap = 'round';  // 線の端を丸くする
            context.lineJoin = 'round';  // 線の接続点を丸くする
            context.lineWidth = lineWidth;  // 線の幅を設定
            context.strokeStyle = drawColor;  // 描画色を設定
            context.beginPath();  // パスの開始
            if (lastPosition.x === null || lastPosition.y === null){
                context.moveTo(x, y);  // パスの開始座標を設定
            }else{
                context.moveTo(lastPosition.x, lastPosition.y);  // パスの開始座標を設定
            }
            context.lineTo(x, y);  // 線を引く
            context.stroke();  // 線を描画
        } else if (mode === 'sticky') {
            drawShape(context, x, y, document.getElementById('textBox').value);  // 付箋を描画
            document.getElementById('textBox').value = '';  // 入力をクリア
        }
        lastPosition.x = x;  // 最後の位置を更新
        lastPosition.y = y;  // 最後の位置を更新
    }

    // ドラッグ開始時の処理
    function dragStart(event){
        context.beginPath();  // パスの開始
        isDrag = true;  // ドラッグ中フラグを立てる
    }

    // ドラッグ終了時の処理
    function dragEnd(event){
        context.closePath();  // パスを閉じる
        isDrag = false;  // ドラッグ中フラグを下ろす
        lastPosition.x = null;  // 最後の位置をリセット
        lastPosition.y = null;  // 最後の位置をリセット
    }

    // イベントハンドラの初期化
    function initEventHandler(){
        const clearButton = document.querySelector(".reset");
        if (clearButton !== null){
            clearButton.addEventListener("touchstart", function(){
                context.clearRect(0, 0, canvas.width, canvas.height);  // キャンバスをクリア
            });
        }else{
            console.log('Element with class "reset" does not exist');
        }
        canvas.addEventListener("touchstart", (event)=>{
            event.preventDefault();  // デフォルトのタッチイベントを無効にする

            if(selectDraw){
                dragStart(event.touches[0]);  // ドラッグ開始
            }
            drawStamp(event.touches[0].clientX,event.touches[0].clientY); //スタンプはる
    
        }, false);
        canvas.addEventListener("touchend", dragEnd, false);  // タッチ終了時
        canvas.addEventListener("touchmove", (event)=>{
            event.preventDefault();  // デフォルトのタッチイベントを無効にする
            const rect = canvas.getBoundingClientRect();  // キャンバスの位置を取得
            const x = (event.touches[0].clientX - rect.left) * (canvas.width / rect.width);  // タッチのX座標を計算
            const y = (event.touches[0].clientY - rect.top) * (canvas.height / rect.height);  // タッチのY座標を計算
            draw(x, y);  // 描画
        }, false);
    }
    initEventHandler();  // イベントハンドラの初期化

// ペンボタンがクリックされたときの処理
document.querySelector('.fa-regular.fa-pen-to-square').addEventListener('touchstart', function() {
    mode = 'pen';  // ペンモードに切り替え

    // スタンプモードを解除
    selectedStamp = null;

    // お絵描きモードに変更
    selectDraw = true;
    
    drawColor = 'black';
    lineWidth = 5;
    document.getElementById('textBox').style.display = 'none';  // テキストボックスを非表示にする

    // スタンプコンテナを非表示にする
    stampContainer.style.display = 'none';
});

    // 消しゴムボタンがクリックされたときの処理
    document.querySelector('.fa-solid.fa-eraser').addEventListener('touchstart', function(){
        mode = 'eraser';  // 消しゴムモードに切り替え
        drawColor = 'white';
        lineWidth = 50;
        document.getElementById('textBox').style.display = 'none';  // テキストボックスを非表示にする

        // スタンプコンテナを非表示にする
        stampContainer.style.display = 'none';
    });



    if (canvas.getContext) {
        // 付箋を描画する関数
        function drawShape(context, x, y, text) {
            if(selectDraw){
                context.fillStyle = "#abdad1";  // 付箋の色を設定
                context.fillRect(x, y, 100, 100);  // 付箋を描画
                context.fillStyle = "black";  // テキストの色を設定
                context.font = '15px Arial';  // フォントを設定
                context.fillText(text, x + 10, y +20);  // テキストを描画
            }
        }

        const drawButton = document.getElementById('drawButton');

        // 付箋ボタンがクリックされたときの処理
        drawButton.addEventListener('touchstart', function() {
            mode = 'sticky';  // 付箋モードに切り替え
            textBox.style.display = 'block';  // テキストボックスを表示する
            
            // 中止してお絵描きモードに切り替え
            selectDraw = true;
            
            // スタンプコンテナを非表示にする
            stampContainer.style.display = 'none';
            
            // 中止するために選択されたスタンプをクリア
            selectedStamp = null;
        });

        // クリアボタンがクリックされたときの処理
        const clearButton = document.querySelector('.reset');
        clearButton.addEventListener('touchstart', function() {
            context.clearRect(0, 0, canvas.width, canvas.height);  // キャンバスをクリア
        });
    }

    // スタンプを表示する関数
    function showStamps() {
        const stampContainer = document.getElementById('stampContainer');
        stamps.forEach(function(stamp) {
            const img = document.createElement('img');
            img.src = stamp.image;
            img.alt = stamp.name;
            img.className = 'stamp';
            img.onclick = function() {
                selectStamp(stamp);
            };
            stampContainer.appendChild(img);
        });
    }

    // スタンプを選択する関数
    function selectStamp(stamp) {
        selectedStamp = new Image();
        selectedStamp.src = stamp.image;
    }
    function drawStamp(eventX,eventY) {
        // スタンプモードの時にスタンプをキャンバスに描画
        if (selectedStamp) {
            console.log(eventX,eventY);
            const rect = canvas.getBoundingClientRect();
            const x = eventX - rect.left;
            const y = eventY - rect.top;
            context.drawImage(selectedStamp, x, y, 100, 100);
        }
    }

    // canvasをクリックしたときのイベントリスナー
    canvas.addEventListener('click', function(event) {
        console.log("PCでキャンバスクリック");
        drawStamp();
    });

    // スタンプ選択ボタンをクリックしたときのイベントリスナー
    document.getElementById('stampButton').addEventListener('click', function() {
        // お絵描きモードを中止
        selectDraw = false;

        const stampContainer = document.getElementById('stampContainer');
        stampContainer.style.display = stampContainer.style.display === 'none' ? 'block' : 'none';
    });

    // スタンプを表示
    showStamps();
});
