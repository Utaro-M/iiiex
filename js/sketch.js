let keyTextSize;
let blockTextSize;

const fps = 60;

let xLines = [];
let yJudgeLine;

let blockWidth;
let blockHeight;
let yVelocity;

let yBlock = -blockHeight;

let jsonData;
let arrayLen;

const startDelay = 3; //second
const endWait = 1; //second

let arrayLanes = [[], [], [], []];

let frame = 0;

let emojis = ["☀", "🚴‍♂️", [], "💤"];

let framesPressed = [0, 0, 0, 0];

let colorD;
let colorF;
let colorJ;
let colorK;
let frameColors = [];

let isGreat = [false, false, false, false];

let greatColor;

let onPress = false;

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

function preload() {
  jsonData = loadJSON("./data/test.json");
  //jsonData = loadJSON("./data/data.json");
  //bgImage = loadImage("./image/bgImg9_16.PNG");
  bgImage = loadImage("./image/bgImg9_21.png");
  sampleSound = loadSound("./sound/sound.mp3");
  //greatFont = loadFont("Lato-BlackItalic.ttf");
}

function setup() {
  frameRate(fps);
  createCanvas(windowWidth, windowHeight);
  print(windowWidth);
  userAgent = window.navigator.userAgent.toLowerCase();
  console.log(userAgent);

  if (isSmartPhone()) {
    //print("smartphone");
    yVelocity = 20;
    blockWidth = windowWidth / 4;
    blockHeight = windowWidth / 4;
    blockTextSize = 150;
    keyTextSize = 100;
    xLines = [
      0,
      windowWidth / 4,
      windowWidth / 2,
      (windowWidth * 3) / 4,
      windowWidth,
    ];
  } else {
    print("pc");
    yVelocity = 5;
    blockWidth = 150;
    blockHeight = 150;
    blockTextSize = 70;
    keyTextSize = 50;
    xLines = [
      windowWidth / 2 - blockWidth * 2,
      windowWidth / 2 - blockWidth,
      windowWidth / 2,
      windowWidth / 2 + blockWidth,
      windowWidth / 2 + blockWidth * 2,
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
  /*
  for(let i=0;i<arrayLen;i++){
    arrayLanes[i].sort(function(a,b){return(a[0] - b[0]);});
  }
  */

  //lane3の絵文字をランダムで設定
  for (let i = 0; i < arrayLanes[2].length; i++) {
    emojis[2].push(random(["🍙", "🍰", "🐟", "🌭"]));
  }
  let tmpMax = 0;
  for (let i = 0; i < 4; i++) {
    tmpMax = max(tmpMax, arrayLanes[i][arrayLanes[i].length - 1][0]);
  }
  endingTime = startDelay + tmpMax / 1000 + endWait; //second
  //for debug
  //endingTime = 0;
}

//スマホ判定
function isSmartPhone() {
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    return true;
  } else {
    return false;
  }
}

//ウインドウサイズが変わった時
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (isSmartPhone()) {
    //print("smartphone");
    blockWidth = windowWidth / 4;
    blockHeight = windowWidth / 4;
    blockTextSize = 150;
    keyTextSize = 100;
    xLines = [
      0,
      windowWidth / 4,
      windowWidth / 2,
      (windowWidth * 3) / 4,
      windowWidth,
    ];
  } else {
    //print("pc");
    blockWidth = 150;
    blockHeight = 150;
    blockTextSize = 70;
    keyTextSize = 50;
    xLines = [
      windowWidth / 2 - blockWidth * 2,
      windowWidth / 2 - blockWidth,
      windowWidth / 2,
      windowWidth / 2 + blockWidth,
      windowWidth / 2 + blockWidth * 2,
    ];
  }

  yJudgeLine = windowHeight * 0.8;
}

function draw() {
  //背景描画
  drawBG();

  frameColors = [
    color(63, 169, 245, framesPressed[0] * 15),
    color(255, 123, 172, framesPressed[1] * 15),
    color(122, 201, 67, framesPressed[2] * 15),
    color(245, 139, 63, framesPressed[3] * 15),
  ];

  //greatColor = color(255, 0, 0, framesPressed[0] * 30);

  //bpm[回/min]のペースで(フレームレートbase)
  if (frame % ((fps * 60) / jsonData.bpm) < 1) {
    //とりあえず点滅
    //fill("black");
    //rect(0, 0, windowWidth / 2 - blockWidth * 2, windowHeight);
    //rect(windowWidth / 2 + blockWidth * 2,0,windowWidth / 2 - blockWidth * 2,windowHeight);
  }

  //指定されたタイミングでブロック描画
  for (let i = 0; i < 4; i++) {
    drawLane(i);
  }

  if (frame > endingTime * fps) {
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
    sessionStorage.setItem("resultJSON", JSON.stringify(resultJSON));
    window.location.href = "./result.html";
  }

  if (frame > 500) {
    //yVelocity = 10;
    //console.log("velocity change");
  }

  frame++;
}

//背景描画
function drawBG() {
  //背景リセット
  background("white");
  if (isSmartPhone()) {
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

  //枠線
  strokeWeight(1);
  stroke("black");
  for (let i = 0; i < 5; i++) {
    line(xLines[i], 0, xLines[i], windowHeight);
  }

  strokeWeight(10);
  stroke("black");
  line(xLines[0], yJudgeLine, xLines[4], yJudgeLine);

  //文字
  if (!isSmartPhone()) {
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
      "d",
      (xLines[0] + xLines[1]) / 2,
      windowHeight * 0.9 + keyTextSize / 2
    );
    text(
      "f",
      (xLines[1] + xLines[2]) / 2,
      windowHeight * 0.9 + keyTextSize / 2
    );
    text(
      "j",
      (xLines[2] + xLines[3]) / 2,
      windowHeight * 0.9 + keyTextSize / 2
    );
    text(
      "k",
      (xLines[3] + xLines[4]) / 2,
      windowHeight * 0.9 + keyTextSize / 2
    );
  }
}

//レーン描画
function drawLane(laneNum) {
  //console.log("a");
  for (let i = 0; i < 4; i++) {
    if (framesPressed[i] > 0) {
      framesPressed[i]--;

      if (isGreat[i]) {
        fill("red");
        textSize(keyTextSize);
        textAlign(CENTER);
        strokeWeight(0);
        text("Great!", (xLines[i] + xLines[i + 1]) / 2, windowHeight * 0.9);
      } else {
      }
    }
  }

  strokeWeight(0);
  fill(frameColors[laneNum]);
  rect(xLines[laneNum], 0, blockWidth, windowHeight);

  for (let i = 0; i < arrayLanes[laneNum].length; i++) {
    let emoji;
    if (laneNum == 2) {
      emoji = emojis[2][i];
    } else {
      emoji = emojis[laneNum];
    }

    noStroke();
    yBlock =
      yVelocity *
        (frame - fps * (startDelay + arrayLanes[laneNum][i][0] / 1000)) +
      yJudgeLine -
      blockHeight / 2;

    if (yBlock < yJudgeLine) {
      fill(255, 0, 0, 255);
    } else {
      fill(255, 0, 0, 100);
    }
    textAlign(CENTER);
    textSize(blockTextSize);
    text(emoji, xLines[laneNum], yBlock, blockWidth, blockHeight);

    /*
      stroke("blue");
      strokeWeight(3);
      line(
        xLines[laneNum],
        yBlock + blockTextSize / 2,
        xLines[laneNum] + blockWidth,
        yBlock + blockTextSize / 2
      );
      */
    //}
  }
}

//キーボード
function keyPressed() {
  if (key == "d") {
    lanePressed(0);
  }
  if (key == "f") {
    lanePressed(1);
  }
  if (key == "j") {
    lanePressed(2);
  }
  if (key == "k") {
    lanePressed(3);
  }
}

//クリックを離したとき，指を離したときに実行される
function mouseClicked() {
  onPress = false;
}

//PC..クリックしたとき,スマホ..タップしたときと指を離したときに実行される
function mousePressed() {
  if (!isSmartPhone()) {
    console.log("pc");
    for (let i = 0; i < 4; i++) {
      if (xLines[i] < mouseX && mouseX < xLines[i + 1]) {
        lanePressed(i);
      }
    }
  } else {
    let isSafari;
    if (userAgent.indexOf("msie") != -1 || userAgent.indexOf("trident") != -1) {
      //IE向けの記述
      isSafari = false;
      console.log("mobile IE");
    } else if (userAgent.indexOf("edge") != -1) {
      //旧Edge向けの記述
      isSafari = false;
      console.log("mobile edge");
    } else if (
      userAgent.indexOf("chrome") != -1 ||
      userAgent.indexOf("crios") != -1
    ) {
      //Google Chrome向けの記述
      isSafari = false;
      console.log("mobile chrome");
    } else if (userAgent.indexOf("safari") != -1) {
      //Safari向けの記述
      isSafari = true;
      console.log("mobile safari");
    } else if (userAgent.indexOf("firefox") != -1) {
      //FireFox向けの記述
      isSafari = false;
      console.log("firefox");
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

function lanePressed(laneNum) {
  framesPressed[laneNum] = 6;
  let great = false;
  for (let i = 0; i < arrayLanes[laneNum].length; i++) {
    if (
      abs(fps * (startDelay + arrayLanes[laneNum][i][0] / 1000) - frame) < 10
    ) {
      great = true;
    }
  }
  if (great) {
    isGreat[laneNum] = true;
    resultArray[laneNum][0] += 1;
    sampleSound.play();
  } else {
    isGreat[laneNum] = false;
  }
}
