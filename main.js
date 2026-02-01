// main.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/* ======================
   狀態
====================== */
let dialogState = 'intro'; // intro | intro-lock | target | none
let showDialog = true;
let parkVisible = false;
let hasClosedParkOnce = false;
const DIALOG_TEXT = {
    intro:
        '嗨!周小寶,今天是難得的情人節,\n' +
        '我想說給你一個驚喜，順邊發揮所長(?)\n\n' +
        '前陣子花了點時間在用電腦,\n' +
        '就是因為這個喔!希望你不要擔心~\n\n' +
        '點擊右下角的按鈕吧!',
    park:
        '這裡是不是很熟悉呢?\n' +
        '這是寶寶跟我告白的瓶蓋公園呦!\n\n' +
        '雖然當天嚇死我了，我覺得好突然所以緊張到把自己扭成一團\n'+
        '當時其實想了很久，因為你剛好要當兵，我又很黏人\n'+
        '可是我又覺得愛情就是不能猶豫!\n'+
        '如果我們遇見彼此時沒有握緊雙方的手，那我們就會走散了\n'+
        '所以過了幾天就找機會跟寶寶說我的想法了\n'+
        '(雖然周小寶本人很心機說想看我寫的字)\n\n'+
        '再點一次右下角吧!',
     temple:
        '這邊是我們第一次去台中後回來的地方!\n' +
        '那個時候好像沒算好時間，太晚回來\n\n' +
        '然後我們就跑去洪爐地拜拜???\n'+
        '前陣子才知道呂洞賓不喜歡情侶\n'+
        '可是我們還是交往了一年多!\n'+
        '被不喜歡情侶的神明放過一馬的感覺就是這樣嗎><\n'+
        '我記得我跟你在一起前，也去了台中拜月老\n'+
        '當時抽到了上上籤，說我會遇到非~常適合我的人\n\n'+
        '我想就是周小寶吧!',
    sea:
        '第一次見你朋友是去年的228露營\n' +
        '回程的時候去了漂亮的海邊\n\n' +
        '不知道是誤打誤撞還是周宏澤細心規劃\n'+
        '但到現在還是覺得愛心入口很浪漫\n'+
        '現在想想當時應該多拍一點合照\n'+
        '可惜周小寶當時沒有頭髮嘻嘻\n'+
        '那幾天只有瘋狂瑟瑟\n\n'+
        '呀哈\n',
    exit1:
        '恭喜你獲得被榨乾機會乙次\n' 
       
};

function getCurrentDialogText() {
    return DIALOG_TEXT[dialogState] || '';
}

/* ======================
   圖片
====================== */
const parkImg = new Image();
const boyImg = new Image();
const me = new Image();

parkImg.src = 'park.png';
boyImg.src = 'firstboy.png';
me.src = 'me.png';

let loaded = 0;
[parkImg, boyImg, me].forEach(img => {
    img.onload = () => {
        loaded++;
        if (loaded === 3) requestAnimationFrame(gameLoop);
    };
});

/* ======================
   角色
====================== */
let p1, p2;
let moveDir = 0;

const initialPlayerPos = {
    x: null,
    y: null
};

function init() {
    const groundY = canvas.height * 0.65;

    p1 = { x: canvas.width / 5, y: groundY, w: 80, h: 180, speed: 4 };
    p2 = { x: canvas.width / 2, y: groundY, w: 80, h: 180 };

    // 記住初始位置
    initialPlayerPos.x = p1.x;
    initialPlayerPos.y = p1.y;
}

init();
/* ======================
   控制
====================== */
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

leftBtn.onmousedown = leftBtn.ontouchstart = e => { e.preventDefault(); moveDir = -1; };
rightBtn.onmousedown = rightBtn.ontouchstart = e => { e.preventDefault(); moveDir = 1; };
leftBtn.onmouseup = leftBtn.onmouseleave = leftBtn.ontouchend =
rightBtn.onmouseup = rightBtn.onmouseleave = rightBtn.ontouchend =
() => moveDir = 0;

/* ======================
   對話框
====================== */
canvas.addEventListener('mousedown', handleDialogClick);
canvas.addEventListener('touchstart', handleDialogClick, { passive:false });

function handleDialogClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!showDialog) return;

    const layout = getDialogLayout(getCurrentDialogText());
const { boxX, boxY, boxW, boxH } = layout;
const { leftBtn, rightBtn } = getDialogButtons(layout);

const hit = (b) =>
    x >= b.x && x <= b.x + b.w &&
    y >= b.y && y <= b.y + b.h;


    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (e.touches ? e.touches[0].clientX : e.clientX);
    const cy = (e.touches ? e.touches[0].clientY : e.clientY);
    const x = (cx - rect.left) * scaleX;
    const y = (cy - rect.top) * scaleY;

    /* ================= intro / intro-lock ================= */
    if (dialogState === 'intro' || dialogState === 'intro-lock') {
        if (hit(rightBtn))  {
             
            showDialog = false;
            parkVisible = true;
            controls.classList.remove('hidden');
            dialogState = 'park'
            return;
        }
        return;
    }

    /* ================= park ================= */
   if (dialogState === 'park') {
    
    // A：彈跳（關掉 → 下一 frame 再打開）
    if (hit(leftBtn))  {
        // 標記為「彈跳重開中」
        isDialogReopening = true;
         dialogState = 'none';
        showDialog = false;
        requestAnimationFrame(() => {
            showDialog = true;
            dialogState = 'exit1';
            isDialogReopening = false; // 重開完成
        });
        return;
    }

    // B：關閉 → 換背景（要忽略彈跳瞬間）
   if (hit(rightBtn)) {
      
        showDialog = false;
        dialogState = 'temple';
        // ② 重置角色
        p1.x = initialPlayerPos.x;
        p1.y = initialPlayerPos.y;
        moveDir = 0;

       
        if (!hasClosedParkOnce) {
            parkImg.src = 'temple.png';
           controls.classList.remove('hidden');
        } 

        return;
    }
}
    if (dialogState === 'exit1') {
       if (hit(rightBtn)) {
             
            showDialog = false;
            parkVisible = true;
            controls.classList.remove('hidden');
            dialogState = 'park'
            return;
        }
        return;
    }


if (dialogState === 'temple') {
    
    // A：彈跳（關掉 → 下一 frame 再打開）
   if (hit(leftBtn)) {
        // 標記為「彈跳重開中」
        isDialogReopening = true;
         dialogState = 'none';
        showDialog = false;
        requestAnimationFrame(() => {
            showDialog = true;
             dialogState = 'temple';
            isDialogReopening = false; // 重開完成
        });
        return;
    }

    // B：關閉 → 換背景（要忽略彈跳瞬間）
   if (hit(rightBtn)) {
      
        showDialog = false;
          dialogState = 'sea';
       
        p1.x = initialPlayerPos.x;
        p1.y = initialPlayerPos.y;
        moveDir = 0;

       
        if (!hasClosedParkOnce) {
            parkImg.src = 'sea.jpg';
           controls.classList.remove('hidden');
        } 

        return;
    }
}

}


function drawDialog() {
    const text = getCurrentDialogText();
    const { boxX, boxY, boxW, boxH, lines, padding, lineH } =
        getDialogLayout(text);

    ctx.fillStyle = '#fff';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#f2a7c6';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#333';
    ctx.font = '18px sans-serif';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    lines.forEach((l, i) => {
        ctx.fillText(l, boxX + padding, boxY + padding + i * lineH);
    });

    const btnH = 40;
    const gap = 16;
    const btnY = boxY + boxH - 50;

    /* === 單顆按鈕（置右） === */
    if (dialogState === 'intro' || dialogState === 'intro-lock' || dialogState === 'exit1') {
        const btnW = 80;
        drawButton(
            boxX + boxW - btnW - 24,
            btnY,
            btnW,
            btnH,
            '關閉'
        );
    }

    /* === 兩顆按鈕（置中 + gap） === */
    if (dialogState === 'park' || dialogState === 'temple' || dialogState === 'sea') {
        const leftW = 200;
        const rightW = 80;
        const totalW = leftW + rightW + gap;
        const startX = boxX + (boxW - totalW) / 2;

        const leftText =
            dialogState === 'park' ? '你想要點這個喔??' :
            dialogState === 'temple' ? '你又想亂按嗎?' :
            '你還想按嗎?';

        drawButton(startX, btnY, leftW, btnH, leftText);
        drawButton(startX + leftW + gap, btnY, rightW, btnH, '關閉');
    }
}



function getDialogLayout(text) {
    const padding = 24;
    const maxW = canvas.width * 0.75;
    const lineH = 26;

    ctx.font = '18px sans-serif';

    const lines = wrapText(ctx, text, maxW - padding * 2);
    const textHeight = lines.length * lineH;

    const boxW = maxW;
    const boxH = textHeight + padding * 2 + 40; 

    const boxX = (canvas.width - boxW) / 2;
    const boxY = (canvas.height - boxH) / 2;

    const closeSize = 28;

    return {
        boxX,
        boxY,
        boxW,
        boxH,
        lines,
        padding,
        lineH,
        closeX: boxX + boxW - closeSize - 12,
        closeY: boxY + 12,
        closeSize
    };
}
function getDialogButtons(layout) {
    const { boxX, boxY, boxW, boxH } = layout;

    const btnH = 40;
const btnW = Math.max(120, Math.min(160, boxW * 0.32));

    const gap  = 16;
    const btnY = boxY + boxH - btnH - 10;

    const leftBtn = {
        x: boxX + (boxW - btnW * 2 - gap) / 2,
        y: btnY,
        w: btnW,
        h: btnH
    };

    const rightBtn = {
        x: leftBtn.x + btnW + gap,
        y: btnY,
        w: btnW,
        h: btnH
    };

    return { leftBtn, rightBtn };
}

function wrapText(ctx, text, maxW) {
    const result=[];
    text.split('\n').forEach(p=>{
        let line='';
        [...p].forEach(ch=>{
            const t=line+ch;
            if(ctx.measureText(t).width>maxW && line){
                result.push(line);
                line=ch;
            }else line=t;
        });
        if(line) result.push(line);
        result.push('');
    });
    result.pop();
    return result;
}

function drawButton(x, y, w, h, text) {
    ctx.fillStyle = '#fde4ef';
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = '#c94a7c';
    ctx.font = '16px sans-serif';   // ✅ 固定字級
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // ✅ 若文字太長，自動縮小
    let fontSize = 16;
    while (ctx.measureText(text).width > w - 20 && fontSize > 10) {
        fontSize--;
        ctx.font = `${fontSize}px sans-serif`;
    }

    ctx.fillText(text, x + w / 2, y + h / 2);
    ctx.textAlign = 'left';
}

function drawCloseIcon(x,y){
    ctx.fillStyle='#c94a7c';
    ctx.font='28px sans-serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText('×',x,y);
}

/* ======================
   主迴圈
====================== */
function update(){
    if(showDialog) return;

    p1.x += moveDir*p1.speed;
    p1.x = Math.max(0, Math.min(canvas.width-p1.w, p1.x));

    const hit =
        p1.x < p2.x+p2.w &&
        p1.x+p1.w > p2.x &&
        p1.y < p2.y+p2.h &&
        p1.y+p1.h > p2.y;

    if (hit) {
        if (['intro', 'park', 'temple', 'sea'].includes(dialogState)) {
          
            showDialog = true;
            moveDir = 0;
            controls.classList.add('hidden');
            return;
        }

    
    }
}


function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (parkVisible) {
        ctx.drawImage(parkImg,0,0,canvas.width,canvas.height);
        ctx.drawImage(me,p2.x,p2.y,p2.w,p2.h);
        ctx.drawImage(boyImg,p1.x,p1.y,p1.w,p1.h);
    }
}

function gameLoop(){
    update();
    draw();
    if(showDialog) drawDialog();
    requestAnimationFrame(gameLoop);
}
