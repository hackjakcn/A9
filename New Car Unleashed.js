// 选择可用的车,第一列第一辆编号为1,第一列第二辆为2,第二列第一辆为3,以此类推
// 在第6行填写车的编号,最多6辆车循环
// 按填写先后顺序用车
// 请根据自己实际情况修改第6行后开始运行脚本

const cars = [1, 2, 3, 4, 5, 6];


/********** 设备 start **********/
const { width, height } = device;

const POWER_SAVE_BRIGHTNESS = 0;
const POWER_SAVE_MUSIC_VOLUME = 0;
const AUTO_BRIGHTNESS_MODE = 1;

const isAutoBrightnessMode = device.getBrightnessMode();
const previousBrightness = device.getBrightness();
const previousMusicVolume = device.getMusicVolume();

/**
 * 调节亮度及音量，进入低功耗模式
 */
const _savePower = () => {
    device.setBrightness(POWER_SAVE_BRIGHTNESS);
    device.setMusicVolume(POWER_SAVE_MUSIC_VOLUME);
}

/**
 * 还原运行时脚本之前的屏幕亮度及设备音量
 */
const _revertPower = () => {
    isAutoBrightnessMode ? device.setBrightnessMode(AUTO_BRIGHTNESS_MODE) : device.setBrightness(previousBrightness);
    device.setMusicVolume(previousMusicVolume);
}

/**
 * 是否调节亮度及音量，以此减少功耗
 * @param {boolean} enable 
 */
const enablePowerSave = enable => enable ? _savePower() : _revertPower();
/********** 设备 end **********/



var profile1920 = {
    //比赛
    compete: {
        x: 1800,
        y: 1000
    },

    //生涯,开始,继续
    goldenPoint: {
        x: 1500,
        y: 1000
    },

    //firstCar,第一辆车位置
    firstCar: {
        x: 555,
        y: 616
    },

    //每辆车的距离
    distance: {
        x: 518,
        y: 363
    },

    //活动首页取特征点
    countdown: {
        x: 331,
        y: 292
    },

    //左边按钮
    left: { x: 840, y: 735 },

    //右边按钮
    right: { x: 1340, y: 735 }
}

var profile2160 = {
    compete: {
        x: 1832,
        y: 974
    },

    goldenPoint: {
        x: 1700,
        y: 1000
    },

    firstCar: {
        x: 565,
        y: 630
    },

    distance: {
        x: 513,
        y: 359
    },

    countdown: {
        x: 337,
        y: 313
    },

    left: { x: 961, y: 730 },

    right: { x: 1170, y: 730 }
}

var profile2340 = {
    //比赛
    compete: {
        x: 1863,
        y: 961
    },

     // 生涯,开始,继续
     goldenPoint: { x: 1800, y: 1000 },

    // 第一辆车
    firstCar: { x: 573, y: 643 },

    // 车辆间距
    distance: { x: 510, y: 358 },

    //每辆车的距离
    distance: {
        x: 518,
        y: 363
    },

    //活动首页取特征点
    countdown: {
        x: 156,
        y: 316
    }
}


var profile;
if (height === 1920 && width === 1080) {
    profile = profile1920;
} 
else if ((height === 2160 || height === 2220) && width === 1080) {
    profile = profile2160;
}
else if (height === 2340 && width === 1080) {
    profile = profile2340;
}
else {
    toast("该分辨率暂未支持,程序结束");
    exit();
}


mainEntrence();

//程序主入口
function mainEntrence() {
    toast("请切换至BC活动主界面");
    sleep(2000);
    toast("3秒后将开始运行程序");
    sleep(3000);
    before();
    eventListener();

    while (true) {
        //运行主函数
        main();
    }
}


function before() {
    auto();
    if (!requestScreenCapture()) {
        toast('请求截图失败，程序结束');
        exit();
    }
    enablePowerSave(true);
}

function eventListener() {
    threads.start(function () {
        // 启用按键监听
        events.observeKey();
        // 监听音量上键按下
        events.onKeyDown("volume_down", function (event) {
            toastLog("程序手动退出");
            enablePowerSave(false);
            threads.shutDownAll();
            exit();
        });
    });
}

function main() {
    // 比赛
    click(profile.compete.x, profile.compete.y);
    click(profile.compete.x, profile.compete.y);
    sleep(2000);

    // 选车 & 开始比赛
    toast("选车");
    sleep(700);
    chooseCar();
    click(profile.goldenPoint.x, profile.goldenPoint.y);
    click(profile.goldenPoint.x, profile.goldenPoint.y);

    // 载入动画
    sleep(10000);

    // 开跑
    threads.start(function () {
        run()
    });

    // 跑完之后
    afterRun();
}


function run() {
    // 在新线程执行的代码
    // console.log("定时器启动,定时点击氮气");
    // 预计时间90秒
    var exitTime = new Date().getTime() + 90000;
    // 定时点击氮气
    var id = setInterval(function () {
        click(height * 4 / 5, width / 2);
        swipe(5 * height / 8, width / 2, height * 7 / 8, width / 2, 500);
        var now = new Date().getTime();
        if (now > exitTime) {
            // console.log("定时器结束");
            clearInterval(id);
        }
    }, 1000);
}



function afterRun() {
    sleep(90000);
    toast("跑完了");

    // 本层循环用于点击三次继续.
    while (true) {
        // 截图
        var img = captureScreen();

        // 倒计时
        var color_countdown = images.pixel(img, profile.countdown.x, profile.countdown.y);

        // 粉红(在跑完之后会出现一闪而过的活动主页)
        if (colors.equals(color_countdown, "#ffff0054")) {
            break;
        }
        click(profile.goldenPoint.x, profile.goldenPoint.y);
    }

    sleep(1000);

    // 本层循环用于控制领代币或者升级
    while (true) {
        sleep(1000);
        // 截图
        var img = captureScreen();

        // 倒计时
        var color_countdown = images.pixel(img, profile.countdown.x, profile.countdown.y);

        // 粉红
        if (colors.equals(color_countdown, "#ffff0054")) {
            toast("即将开始下一次比赛");
            break;
        } else {
            back();
            sleep(2000);
        }
    }
}

function chooseCar() {
    var flag = true;
    swipe(300, 500, 900, 500, 500);
    sleep(2000);
    for (let i = 0; i < cars.length; i++) {
        let n = cars[i];
        // toastLog(n);
        var carPoint = {
            x: profile.firstCar.x + profile.distance.x * parseInt((n - 1) / 2),
            y: profile.firstCar.y + profile.distance.y * ((n - 1) % 2)
        }
        // toastLog(carPoint.x + ","+ carPoint.y);
        var img = captureScreen();
        var carStatus = images.pixel(img, carPoint.x, carPoint.y);

        if (colors.equals(carStatus, "#ffc3fb12")) {
            flag = false;
            click(carPoint.x - profile.distance.x / 2, carPoint.y - profile.distance.y / 2);
            sleep(2000);
            //开始
            click(profile.goldenPoint.x, profile.goldenPoint.y);
            break;
        }
    }
    if (flag) {
        toastLog("都没油了");
        //看广告脚本有问题...暂且屏蔽
        exit();
        let n = cars[0];
        var carPoint = {
            x: profile.firstCar.x + profile.distance.x * parseInt((n - 1) / 2),
            y: profile.firstCar.y + profile.distance.y * ((n - 1) % 2)
        }
        click(carPoint.x - profile.distance.x / 2, carPoint.y - profile.distance.y / 2);
        sleep(2000);
        //开始
        click(profile.goldenPoint.x, profile.goldenPoint.y);
        ad();
    }
}

function checkForResolution(x, y, img) {
    var width = img.getWidth();
    var height = img.getHeight();
    if (width < height) {
        var e = x;
        x = y;
        y = e;
    }

    return {
        positionX: x,
        positionY: y
    };
}


function ad() {
    toastLog("开始为车辆补充燃油");
    while (true) {
        // confirm the UI
        var img = captureScreen();
        var left = images.pixel(img, profile.left.x, profile.left.y);
        var right = images.pixel(img, profile.right.x, profile.right.y);
        // toastLog("left is " + colors.toString(left));
        // toastLog("right is " + colors.toString(right));
        if (colors.equals(left, "#c3fb12") && colors.equals(right, "#ffffff")) {
            click(profile.right.x, profile.right.y);
            toastLog("开始看这个广告");
            break;
        }
        else {
            sleep(1000);
        }
    }

    // wait for playing ad
    sleep(30000);

    var jump_back = 0;

    while (true) {
        if (!jump_back) {
            toastLog("尝试返回")
            back();
            sleep(5000);
        }

        var img = captureScreen();
        var left = images.pixel(img, profile.left.x, profile.left.y);
        var right = images.pixel(img, profile.right.x, profile.right.y);
        var next = images.pixel(img, profile.goldenPoint.x, profile.goldenPoint.y);
        // toastLog("left is " + colors.toString(left));
        // toastLog("right is " + colors.toString(right));
        // toastLog("next is " + colors.toString(next));

        // grey blue
        if (colors.equals(left, "#bababa") && colors.isSimilar(right, "#2580d8")) {
            toastLog("继续广告");
            click(profile.right.x, profile.right.y);
            // click(profile.right.x, profile.right.y);
            sleep(8000);
        }
        // green white
        else if (colors.equals(left, "#c3fb12") && colors.equals(right, "#ffffff")) {
            toastLog("看下一个广告")
            ad();
        }
        // next is green
        else if (colors.equals(next, "#c3fb12")) {
            toastLog("车辆燃油已恢复,即将开始下一场比赛");
            break;
        }
        // next is white
        else if (colors.equals(next, "#ffffff")) {
            toastLog("偶然多点一次返回，看下一个广告")
            click(profile.goldenPoint.x, profile.goldenPoint.y);
            ad();
        }
        // In progress
        else {
            toastLog("请稍等");
            sleep(3000);
            jump_back = 1;
        }
    }
}