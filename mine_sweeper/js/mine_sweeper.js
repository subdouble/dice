let menu = document.querySelector(".menu");
let menuItem = document.querySelectorAll(".menu-item");
let main = document.querySelector(".main");
let mainList = document.querySelector(".main-list");
let spendTime = document.querySelector(".spend-time");
let mineRemainNum = document.querySelector(".mine-num");
let boxNum = 0;
let mineNum = 0;
let setMineFlag = true;
let mainWidth = mainList.offsetWidth;
let mainHeight = mainList.offsetHeight;
let boxWidth = 0;
let boxHeight = 0;

// 选择难度，设置雷的个数
menuItem.forEach(function (value, key) {
    value.onclick = function () {
        if (key === 0) {
            boxNum = 9;
            mineNum = 8;
        }
        else if (key === 1) {
            boxNum = 10;
            mineNum = 25;
        }
        else {
            boxNum = 15;
            mineNum = 50;
        }
        mineRemainNum.lastElementChild.innerText = mineNum;
        menu.style.display = "none";
        main.style.display = "block";
        initMain();
    };
});

// 初始化扫雷界面
function initMain() {
    mainWidth = mainList.offsetWidth;
    mainHeight = mainList.offsetHeight;
    boxWidth = boxHeight = mainHeight / boxNum;
    for (let i = 0; i < boxNum; i++) {
        for (let j = 0; j < boxNum; j++) {
            let box = document.createElement("div");
            box.className = "main-item blank";
            box.id = `box-${i}-${j}`;
            box.style.cssText = `
                width: ${boxWidth}px;
                height: ${boxHeight}px;
            `;
            mainList.appendChild(box);
        }
    }
}

// 右键标记
main.oncontextmenu = function (e) {
    e.preventDefault();
    // console.log(e.target);
    rightClick(e.target);
};

function rightClick(box){
    if(box.classList.contains("blank")){
        box.style.backgroundImage = "url('img/flag.bmp')";
        box.classList.remove("blank");
        box.classList.add("marked");
        mineNum--;
    }
    else if(box.classList.contains("marked")){
        box.style.backgroundImage = "url('img/ask.bmp')";
        box.classList.remove("marked");
        box.classList.add("unknown");
        mineNum++;
    }
    else if(box.classList.contains("unknown")){
        box.style.backgroundImage = "url('img/blank.bmp')";
        box.classList.remove("unknown");
        box.classList.add("blank");
    }
    else{
        // 已经打开了
    }
    if(mineNum === 0){
        // alert("successful!");
    }
    console.log(mineNum);
}

// 左键点击
mainList.onclick = function(e){
    console.log(e.target);
    if(!e.target.classList.contains("main-list"))
    {
        leftClick(e.target);
    }
    if(document.querySelectorAll(".known").length == (boxNum ** 2 - mineNum)){
        setTimeout(function(){
            alert("you win");
        }, 50);
    }
};

function leftClick(box){
    if(setMineFlag){
        setMineFlag = false;
        setMine(box);
        console.log("setMine");
    }
    setKnown(box);
}

function setKnown(box){
    if(box.classList.contains("known") || box.classList.contains("marked") || box.classList.contains("unknown")){
        return;
    }
    if(box.classList.contains("mine")){
        boxMine = document.querySelectorAll(".mine");
        boxMine.forEach(function(value, index){
            value.style.backgroundImage = "url('img/blood.bmp')";
            value.style.backgroundRepeat = "no-repeat";
            value.style.backgroundSize = "100% 100%";
        });
        alert("you lose!");
        return;
    }
    
    let boxPos = getBoxPos(box);
    let mineNum = 0;
    for(let i = boxPos[0] - 1; i <= boxPos[0] + 1; i ++){
    	for(let j = boxPos[1] - 1; j <= boxPos[1] + 1; j ++){
    		let judgeBox = document.querySelector("#box-" + i + "-" + j);
    		if(judgeBox && judgeBox.classList.contains("mine")){
    			mineNum++;
    		}
    	}
    }
    box.style.backgroundImage = `url('img/${mineNum}.bmp')`;
    box.classList.remove("blank");
    box.classList.add("known");
    
    if(mineNum == 0){
        for(let i = boxPos[0] - 1; i <= boxPos[0] + 1; i ++){
        	for(let j = boxPos[1] - 1; j <= boxPos[1] + 1; j ++){
        		let judgeBox = document.querySelector("#box-" + i + "-" + j);
        		if(judgeBox){
        			setKnown(judgeBox);
        		}
        	}
        }
    }
}

function setMine(box){
    // 获取所有盒子
    let boxAll = document.querySelectorAll(".main-item");
    // console.log(boxAll)
    let boxPos = getBoxPos(box);
    // console.log(boxPos);
    let boxIndex = boxPos[0] * boxNum + boxPos[1];
    // console.log(boxIndex);
    let nowMineNum = 0;
    while(nowMineNum < mineNum){
        let mineIndex = getRandom(0, boxNum ** 2 - 1);
        if(mineIndex !== boxIndex && !boxAll[mineIndex].classList.contains("mine")){
            boxAll[mineIndex].classList.add("mine");
            boxAll[mineIndex].style.background = "#f66";
            nowMineNum++;
        }
        else{}
    }
    // console.log(document.querySelectorAll(".mine"));
}

// 获取盒子位置
function getBoxPos(box){
    let boxId = box.id;
    let arr = boxId.split("-");
    return [Number(arr[1]), Number(arr[2])];
}

// 获取随机数
function getRandom(start, end){
    return Math.floor(Math.random() * (end - start + 1) + start);
}