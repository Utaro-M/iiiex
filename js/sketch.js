let keyTextSize;

let fps;

let xLines = [];
let yJudgeLine;

let laneWidth;
let emojiHeight;
let emojiWidth;
let yVelocity; //  px/frame

let yBlock = -emojiHeight;

let jsonData;
let arrayLen;

let endWait; //second

let arrayLanes = [[], [], [], []];

let frame;
let frameYoin;
let angle = 0;

let emojis = [, [], [], []];

let framesPressed = [0, 0, 0, 0];

let colorD;
let colorF;
let colorJ;
let colorK;
let frameColors = [];
let greatColor;
let colorDay;
let colorEvening;
let colorNight;

let timeNightEnd;
let timeDayStart;
let timeDayEnd;
let timeEvening;
let timeNightStart;

let isGreat = [false, false, false, false];

let onPress = false;

let isStart = false;
let isYoin = false;
let yoinTime;
let isAwake = false;
let isInHome = true;
let bgChanged = false;
let bgDisplay = [true, true, true, true, true];

let nowBG = 0;
/*
0 go
1 active1
2 study2
3 reading3
4 back
*/
let bgChangeAngle = [];
let sleepLaneNum = 0;
let keyLaneNum = 0;

let bgImage;

let endingTime = 0;

let resultArray = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

let sampleSound;

let userAgent;

let secondPerDay = 6;

function preload() {
  //data
  jsonData = loadJSON("./data/10days_interval300.json");
  //image
  //bgImage = loadImage("./image/kisho_demo.JPG");
  bgSuimin = loadImage("./image/suimin.JPG");
  bgKisho = loadImage("./image/kisho_demo.JPG");
  bgGo = loadImage("./image/go.JPG");
  bgActive1 = loadImage("./image/active1.JPG");
  bgStudy2 = loadImage("./image/study2.JPG");
  bgReading3 = loadImage("./image/reading3.JPG");
  bgBack = loadImage("./image/back_b.JPG");

  imgBicycle = loadImage("./image/bicycle.png");
  imgCake = loadImage("./image/cake.png");
  imgFish = loadImage("./image/fish.png");
  imgHotdog = loadImage("./image/hotdog.png");
  imgCurry = loadImage("./image/curry.png");
  imgKey = loadImage("./image/key.png");
  imgRiceball = loadImage("./image/riceball.png");
  imgSun = loadImage("./image/sun.png");
  imgZzz = loadImage("./image/zzz.png");
  imgNidone = loadImage("./image/nidone.png");
  imgHeart = loadImage("./image/heart.png");
  imgWalk = loadImage("./image/walk.png");

  //sound
  keySound = loadSound("./sound/key.mp3");
  bicycleSound = loadSound("./sound/bicycle2.mp3");
  eatSound = loadSound("./sound/eat.mp3");
  alarmSound = loadSound("./sound/alarm.mp3");
  sleepSound = loadSound("./sound/sleep.mp3");
  bedSound = loadSound("./sound/bed.mp3");
  BGM = loadSound("./sound/test_sound.wav");
}

function setup() {
  fps = 30;
  frameRate(fps);
  createCanvas(windowWidth, windowHeight);
  userAgent = window.navigator.userAgent.toLowerCase();

  if (isTapDevice()) {
    laneWidth = windowWidth / 4;
    emojiHeight = windowWidth / 8;
    emojiWidth = windowWidth / 8;
    if (isEmbedded()) {
      keyTextSize = 30;
    } else {
      keyTextSize = 100;
    }
    xLines = [
      0,
      windowWidth / 4,
      windowWidth / 2,
      (windowWidth * 3) / 4,
      windowWidth,
    ];
  } else {
    laneWidth = 150;
    emojiHeight = 100;
    emojiWidth = 100;
    keyTextSize = 50;
    xLines = [
      windowWidth / 2 - laneWidth * 2,
      windowWidth / 2 - laneWidth,
      windowWidth / 2,
      windowWidth / 2 + laneWidth,
      windowWidth / 2 + laneWidth * 2,
    ];
  }

  yJudgeLine = windowHeight * 0.8;

  frameColors = [
    color(63, 169, 245, 255),
    color(255, 123, 172, 255),
    color(122, 201, 67, 255),
    color(245, 139, 63, 255),
  ];
  //jsonデータをlaneごとにarrayにpushし，(timingでsort)
  arrayLen = Object.keys(jsonData.notes).length;
  for (let i = 0; i < arrayLen; i++) {
    arrayLanes[jsonData.notes[i].lane].push([
      jsonData.notes[i].timing,
      jsonData.notes[i].len,
    ]);
  }

  //emojis配列に絵文字を入れる
  emojis[0] = imgKey;
  for (let i = 0; i < arrayLanes[1].length; i++) {
    emojis[1].push(
      random([imgRiceball, imgCake, imgFish, imgHotdog, imgCurry])
    );
  }
  for (let i = 0; i < arrayLanes[2].length; i++) {
    emojis[2].push(random([imgBicycle, imgHeart, imgWalk]));
  }
  //emojis[2] = imgBicycle;
  let isAwake2 = true;
  for (let i = 0; i < arrayLanes[3].length; i++) {
    if (isAwake2) {
      emojis[3].push(imgSun);
      isAwake2 = false;
    } else {
      emojis[3].push(imgZzz);
      isAwake2 = true;
    }
  }
  let lastEmojiTime = 0;
  for (let i = 0; i < 4; i++) {
    lastEmojiTime = max(
      lastEmojiTime,
      arrayLanes[i][arrayLanes[i].length - 1][0]
    );
  }

  //定数,変数の初期値設定
  endWait = 1;
  timeNightEnd = (23 * PI) / 24;
  timeDayStart = (27 * PI) / 24;
  timeDayEnd = (8 * PI) / 3;
  timeEvening = (33 * PI) / 12;
  timeNightStart = (17 * PI) / 6;
  colorDay = [0, 200, 255];
  colorEvening = [242, 99, 44];
  colorNight = [0, 0, 10];
  //bgChangeAngle = [1.5 * PI, 2 * PI, 2.5 * PI, 3 * PI, 3.5 * PI];
  bgChangeAngle = [1 * PI, 2 * PI, 3 * PI]; //, 3 * PI, 3.5 * PI];
  frame = -(secondPerDay / 2) * fps;
  endingTime = lastEmojiTime / 1000 + endWait; //second
  frameYoin = 0;
  yoinTime = 2;
  bgImage = bgSuimin;

  //音の設定(Aを再生中にBが再生されてもAを一時停止しない)
  keySound.playMode("sustain");
  bedSound.playMode("sustain");
  sleepSound.playMode("sustain");
  alarmSound.playMode("sustain");
  eatSound.playMode("sustain");
  bicycleSound.playMode("sustain");
  BGM.playMode("sustain");
}

function draw() {
  //背景描画
  drawBG();

  if (!isStart && !isYoin) {
    if (isTapDevice()) {
      if (window === window.parent) {
        textSize(100);
      } else {
        textSize(30);
      }
      fill(0, 0, 0);
      strokeWeight(10);
      stroke(38, 221, 38);
      textAlign(CENTER);
      text("タップしてスタート", windowWidth / 2, windowHeight / 2);
    } else {
      fill(0, 0, 0);
      strokeWeight(5);
      stroke(255, 255, 255);
      textSize(40);
      textAlign(CENTER);
      text("spaceキーを押してスタート", windowWidth / 2, windowHeight / 2);
    }
  }

  frameColors = [
    color(63, 169, 245, framesPressed[0] * 42),
    color(255, 123, 172, framesPressed[1] * 42),
    color(122, 201, 67, framesPressed[2] * 42),
    color(245, 139, 63, framesPressed[3] * 42),
  ];

  //bpm[回/min]のペースで(フレームレートbase)
  if (frame % ((fps * 60) / jsonData.bpm) < 1) {
    //とりあえず点滅
    //fill("black");
    //rect(0, 0, windowWidth / 2 - laneWidth * 2, windowHeight);
    //rect(windowWidth / 2 + laneWidth * 2,0,windowWidth / 2 - laneWidth * 2,windowHeight);
  }

  //指定されたタイミングでブロック描画
  for (let i = 0; i < 4; i++) {
    drawLane(i);
  }
  //ゲーム終了&時計が12時 → 余韻タイムスタート
  if (frame > endingTime * fps && frame % (fps * 5) === 0) {
    isStart = false;
    isYoin = true;
  }
  //ゲーム終了
  if (frameYoin > yoinTime * fps) {
    gameEnd();
  }
  //tap or spaceキーが押される → ゲームスタート
  if (isStart) {
    frame++;
  }
  //短針が1周したらゲーム開始，音楽鳴らす
  if (frame === 0) {
    BGM.loop();
  }
  //余韻モード
  if (isYoin) {
    frameYoin++;
  }
}

//スマホ,iPad判定
function isTapDevice() {
  let isSmartPhone = navigator.userAgent.match(/iPhone|Android.+Mobile/);
  let isiPad =
    /iPad|Macintosh/i.test(navigator.userAgent) && "ontouchend" in document;
  if (isSmartPhone || isiPad) {
    return true;
  } else {
    return false;
  }
}
//埋め込まれているかの判定
function isEmbedded() {
  if (window === window.parent) {
    return false;
  } else {
    return true;
  }
}
//ウインドウサイズが変わった時
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  userAgent = window.navigator.userAgent.toLowerCase();

  if (isTapDevice()) {
    laneWidth = windowWidth / 4;
    emojiHeight = windowWidth / 8;
    emojiWidth = windowWidth / 8;
    if (isEmbedded()) {
      keyTextSize = 30;
    } else {
      keyTextSize = 100;
    }
    xLines = [
      0,
      windowWidth / 4,
      windowWidth / 2,
      (windowWidth * 3) / 4,
      windowWidth,
    ];
  } else {
    laneWidth = 150;
    emojiHeight = 100;
    emojiWidth = 100;
    keyTextSize = 50;
    xLines = [
      windowWidth / 2 - laneWidth * 2,
      windowWidth / 2 - laneWidth,
      windowWidth / 2,
      windowWidth / 2 + laneWidth,
      windowWidth / 2 + laneWidth * 2,
    ];
  }

  yJudgeLine = windowHeight * 0.8;
}

//背景描画
function drawBG() {
  //frameから時計の角度計算[0,4*PI)
  angle = ((frame * 4 * PI) / (fps * secondPerDay)) % (2 * TWO_PI);

  //背景リセット
  background(color(20, 20, 20));

  //時間によって背景変更
  if (bgChangeAngle[0] <= angle && angle <= bgChangeAngle[1]) {
    nowMode = 0;
    if (!bgDisplay[2]) {
      bgChanged = false;
      bgDisplay[4] = true;
    }
    if (bgDisplay[nowBG]) {
      bgImage = bgActive1;
    }
  } else if (bgChangeAngle[1] <= angle && angle <= bgChangeAngle[2]) {
    nowMode = 1;
    if (!bgDisplay[0]) {
      bgChanged = false;
      bgDisplay[0] = true;
    }
    if (bgDisplay[nowBG]) {
      bgImage = bgStudy2;
    }
  } else {
    nowMode = 2;
    if (!bgDisplay[1]) {
      bgChanged = false;
      bgDisplay[1] = true;
    }
    if (bgDisplay[nowBG]) {
      bgImage = bgReading3;
    }
  }

  //睡眠レーンによって背景変更
  if (sleepLaneNum < arrayLanes[3].length) {
    if ((frame * 1000) / fps > arrayLanes[3][sleepLaneNum][0]) {
      bgChanged = true;
      bgDisplay[nowBG] = false;
      sleepLaneNum++;
      bgImage = bgSuimin;
      if (isAwake) {
        isAwake = false;
        bgImage = bgSuimin;
      } else {
        isAwake = true;
        bgImage = bgKisho;
      }
    }
  }
  if (keyLaneNum < arrayLanes[0].length) {
    if ((frame * 1000) / fps > arrayLanes[0][keyLaneNum][0]) {
      bgChanged = true;
      bgDisplay[nowBG] = false;
      keyLaneNum++;
      bgImage = bgGo;
      if (isInHome) {
        isInHome = false;
        bgImage = bgGo;
      } else {
        isInHome = true;
        bgImage = bgBack;
      }
    }
  }

  if (isTapDevice()) {
    //スマホ背景
    if (windowWidth >= (9 / 16) * windowHeight) {
      image(
        bgImage,
        0.5 * windowWidth - (9 / 32) * windowHeight,
        0,
        (9 / 16) * windowHeight,
        windowHeight
      );
    } else {
      image(
        bgImage,
        0,
        0.5 * windowHeight - (8 / 9) * windowWidth,
        windowWidth,
        (16 / 9) * windowWidth
      );
    }
  } else {
    //PC背景
    if (windowHeight >= 3200 / 3) {
      image(bgImage, xLines[0], 0.5 * windowHeight - 1600 / 3, 600, 3200 / 3);
    } else {
      image(
        bgImage,
        xLines[0] + 300 - (9 / 32) * windowHeight,
        0,
        (9 / 16) * windowHeight,
        windowHeight
      );
    }
  }

  //時計描画
  stroke(0, 0, 0, 100);
  push();
  translate(windowWidth / 2, windowHeight / 2);
  rotate(angle);
  if (isTapDevice()) {
    strokeWeight(20);
    line(0, 0, 0, -(windowWidth * 2) / 5);
  } else {
    strokeWeight(10);
    line(0, 0, 0, -(laneWidth * 8) / 5);
  }
  pop();

  //背景に色つける
  if (frame > 0) {
    noStroke();
    let colorBG;
    //色の場合分け
    if (timeNightEnd <= angle && angle < timeDayStart) {
      colorBG = timeToColor(
        angle,
        timeNightEnd,
        timeDayStart,
        colorNight,
        colorDay
      );
    } else if (timeDayStart <= angle && angle < timeDayEnd) {
      colorBG = color(colorDay[0], colorDay[1], colorDay[2], 100);
    } else if (timeDayEnd <= angle && angle < timeEvening) {
      colorBG = timeToColor(
        angle,
        timeDayEnd,
        timeEvening,
        colorDay,
        colorEvening
      );
    } else if (timeEvening <= angle && angle < timeNightStart) {
      colorBG = timeToColor(
        angle,
        timeEvening,
        timeNightStart,
        colorEvening,
        colorNight
      );
    } else {
      colorBG = color(colorNight[0], colorNight[1], colorNight[2], 100);
    }
    fill(colorBG);
    if (isTapDevice()) {
      rect(0, 0, windowWidth, windowHeight);
    } else {
      rect(xLines[0], 0, laneWidth * 4, windowHeight);
    }
  }
  //枠線
  strokeWeight(5);
  stroke(70, 70, 70);
  for (let i = 0; i < 5; i++) {
    line(xLines[i], 0, xLines[i], windowHeight);
  }

  //判定線
  strokeWeight(10);
  stroke(70, 70, 70);
  line(xLines[0], yJudgeLine, xLines[4], yJudgeLine);

  //文字
  if (!isTapDevice()) {
    strokeWeight(2);
    stroke(0, 0, 0);
    fill(255, 255, 255);
    ellipse((xLines[0] + xLines[1]) / 2, windowHeight * 0.9, keyTextSize * 1.5);
    ellipse((xLines[1] + xLines[2]) / 2, windowHeight * 0.9, keyTextSize * 1.5);
    ellipse((xLines[2] + xLines[3]) / 2, windowHeight * 0.9, keyTextSize * 1.5);
    ellipse((xLines[3] + xLines[4]) / 2, windowHeight * 0.9, keyTextSize * 1.5);
    fill(0, 0, 0);
    strokeWeight(5);
    textSize(keyTextSize);
    //textAlign(CENTER, CENTER);
    textAlign(CENTER);
    text(
      "D",
      (xLines[0] + xLines[1]) / 2,
      windowHeight * 0.9 + keyTextSize / 2
    );
    text(
      "F",
      (xLines[1] + xLines[2]) / 2,
      windowHeight * 0.9 + keyTextSize / 2
    );
    text(
      "J",
      (xLines[2] + xLines[3]) / 2,
      windowHeight * 0.9 + keyTextSize / 2
    );
    text(
      "K",
      (xLines[3] + xLines[4]) / 2,
      windowHeight * 0.9 + keyTextSize / 2
    );
  }
}

//レーン描画
function drawLane(laneNum) {
  for (let i = 0; i < 4; i++) {
    if (framesPressed[i] > 0) {
      framesPressed[i]--;

      if (isGreat[i]) {
        fill("red");
        textSize(keyTextSize);
        textAlign(CENTER);
        strokeWeight(0);
        text("Great!", (xLines[i] + xLines[i + 1]) / 2, windowHeight * 0.9);
      }
    }
  }

  //レーンの色変える
  //strokeWeight(0);
  //fill(frameColors[laneNum]);
  //rect(xLines[laneNum], 0, laneWidth, windowHeight);
  //判定線の色変える
  strokeWeight(10);
  stroke(frameColors[laneNum]);
  line(xLines[laneNum], yJudgeLine, xLines[laneNum + 1], yJudgeLine);

  for (let i = 0; i < arrayLanes[laneNum].length; i++) {
    let emoji;
    if (laneNum === 1) {
      emoji = emojis[1][i];
    } else if (laneNum === 2) {
      emoji = emojis[2][i];
    } else if (laneNum === 3) {
      emoji = emojis[3][i];
    } else {
      emoji = emojis[laneNum];
    }

    //4日目からスピードアップ
    yVelocity = 10;
    /*
    if (arrayLanes[laneNum][i][0] < 30000) {
      if (isTapDevice()) {
        if (isEmbedded()) {
          yVelocity = 10;
        } else {
          yVelocity = 10;
        }
      } else {
        yVelocity = 10;
      }
    } else {
      if (isTapDevice()) {
        if (isEmbedded()) {
          yVelocity = 20;
        } else {
          yVelocity = 20;
        }
      } else {
        yVelocity = 20;
      }
    }
    */
    noStroke();
    yBlock =
      yVelocity * (frame - fps * (arrayLanes[laneNum][i][0] / 1000)) +
      yJudgeLine -
      emojiHeight / 2;

    if (yBlock < yJudgeLine) {
      fill(255, 0, 0, 255);
    } else {
      fill(255, 0, 0, 100);
    }
    textAlign(CENTER);
    strokeWeight(1);
    stroke(255, 255, 255);
    fill(0, 0, 0);
    image(
      emoji,
      xLines[laneNum] + (laneWidth - emojiWidth) / 2,
      yBlock,
      emojiWidth,
      emojiHeight
    );
  }
}

//キーボード
function keyPressed() {
  if (key === "d") {
    lanePressed(0);
  }
  if (key === "f") {
    lanePressed(1);
  }
  if (key === "j") {
    lanePressed(2);
  }
  if (key === "k") {
    lanePressed(3);
  }
  if (keyCode === 32) {
    if (!isStart) {
      isStart = true;
      //BGM.loop();
    }
    return false;
  }
}

function touchStarted() {
  if (!isStart) {
    isStart = true;
  } else {
    for (let tap = 0; tap < touches.length; tap++) {
      for (let i = 0; i < 4; i++) {
        if (xLines[i] < touches[tap].x && touches[tap].x < xLines[i + 1]) {
          lanePressed(i);
        }
      }
    }
  }
}
/*
//クリックを離したとき，指を離したときに実行される
function mouseClicked() {
  onPress = false;
}

//PC..クリックしたとき,スマホ..タップしたときと指を離したときに実行される
function mousePressed() {
  if (!isTapDevice()) {
    for (let i = 0; i < 4; i++) {
      if (xLines[i] < mouseX && mouseX < xLines[i + 1]) {
        lanePressed(i);
      }
    }
  } else {
    if (!isStart) {
      isStart = true;
      //BGM.loop();
    } else {
      let isSafari;
      if (
        userAgent.indexOf("msie") != -1 ||
        userAgent.indexOf("trident") != -1
      ) {
        //IE向けの記述
        isSafari = false;
      } else if (userAgent.indexOf("edge") != -1) {
        //旧Edge向けの記述
        isSafari = false;
      } else if (
        userAgent.indexOf("chrome") != -1 ||
        userAgent.indexOf("crios") != -1
      ) {
        //Google Chrome向けの記述
        if (window === window.parent) {
          isSafari = false;
        } else {
          isSafari = true;
        }
      } else if (userAgent.indexOf("safari") != -1) {
        //Safari向けの記述
        isSafari = true;
      } else if (userAgent.indexOf("firefox") != -1) {
        //FireFox向けの記述
        isSafari = false;
      } else {
        //その他のブラウザ向けの記述
        isSafari = false;
      }

      if (isSafari) {
        for (let i = 0; i < 4; i++) {
          if (xLines[i] < mouseX && mouseX < xLines[i + 1]) {
            lanePressed(i);
          }
        }
      } else {
        if (!onPress) {
          for (let i = 0; i < 4; i++) {
            if (xLines[i] < mouseX && mouseX < xLines[i + 1]) {
              lanePressed(i);
            }
          }
          onPress = true;
        }
      }
    }
  }
}
*/
function lanePressed(laneNum) {
  framesPressed[laneNum] = 6;
  let great = false;
  for (let i = 0; i < arrayLanes[laneNum].length; i++) {
    if (
      isTapDevice() &&
      abs(fps * (arrayLanes[laneNum][i][0] / 1000) - frame) <
        (emojiHeight * 1.5) / (2 * yVelocity)
    ) {
      great = true;
    } else if (
      !isTapDevice() &&
      abs(fps * (arrayLanes[laneNum][i][0] / 1000) - frame) <
        (emojiHeight * 1.5) / (2 * yVelocity)
    ) {
      great = true;
    }
  }
  if (great) {
    isGreat[laneNum] = true;
    resultArray[laneNum][0] += 1;
    if (laneNum === 0) {
      keySound.play();
    } else if (laneNum === 1) {
      eatSound.play();
    } else if (laneNum === 2) {
      bicycleSound.play();
    } else if (laneNum === 3) {
      bedSound.play();
    }
  } else {
    isGreat[laneNum] = false;
  }
}

function timeToColor(angle, startTime, endTime, startColor, endColor) {
  return color(
    ((endColor[0] - startColor[0]) / (endTime - startTime)) *
      (angle - startTime) +
      startColor[0],
    ((endColor[1] - startColor[1]) / (endTime - startTime)) *
      (angle - startTime) +
      startColor[1],
    ((endColor[2] - startColor[2]) / (endTime - startTime)) *
      (angle - startTime) +
      startColor[2],
    100
  );
}

function gameEnd() {
  for (let i = 0; i < 4; i++) {
    resultArray[i][1] = arrayLanes[i].length - resultArray[i][0];
  }
  var resultJSON = {
    great: [
      resultArray[0][0],
      resultArray[1][0],
      resultArray[2][0],
      resultArray[3][0],
    ],
    miss: [
      resultArray[0][1],
      resultArray[1][1],
      resultArray[2][1],
      resultArray[3][1],
    ],
  };
  BGM.pause();
  sessionStorage.setItem("resultJSON", JSON.stringify(resultJSON));
  window.location.href = "./gameend.html";
}
