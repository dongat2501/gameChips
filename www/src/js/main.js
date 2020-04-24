"use strict";

// Change Eyes closed threshold value for future use.

let eyesClosedThreshold = 0.65; // For 65% open eyes.
let timeThreshold = 100; // For 0.5 seconds;

let lastClosedTime,
  continuous = false;
let alarm = document.getElementById("alarm");
let body = document.querySelector("body");
var blinkCount = 0;
//entry point :
function main() {
  console.log(JEEFACETRANSFERAPI)
  JEEFACETRANSFERAPI.init({
    canvasId: "canvas",
    NNCpath: "src/model/",
    callbackReady: function (errCode) {
      if (errCode) {
        console.log(
          "ERROR - cannot init JEEFACETRANSFERAPI. errCode =",
          errCode
        );
        errorCallback(errCode);
        return;
      }
      console.log("INFO : JEEFACETRANSFERAPI is ready !!!");
      alert('Turn up volume?');
      successCallback();
    } //end callbackReady()
  });
} //end main()

function successCallback() {
  // Call next frame
  // document.getElementById("full-page-loader").style.display = "none";
  var stream = JEEFACETRANSFERAPI.get_videoStream();
  var videoElement = document.querySelector('video');
  if ("srcObject" in videoElement) {
    videoElement.srcObject = stream
  }
  console.log('streamstream', stream)
  startGame();
  nextFrame();
  // Add code after API is ready.
}

function errorCallback(errorCode) {
  // Add code to handle the error
  alert("Cannot work without camera. Check if the camera is attached.");
}

function nextFrame() {
  let deltaTime = Date.now() - lastClosedTime;
  if (deltaTime > timeThreshold && continuous) {
    start_alarm();
    blinked();
    // document.getElementById('blink-count').innerHTML = blinkCount;
    body.style.background = "#f00";
  } else {
    stop_alarm();
    body.style.background = "#fff";
  }

  if (JEEFACETRANSFERAPI.is_detected()) {
    // Do something awesome with animation values
    let expressions = JEEFACETRANSFERAPI.get_morphTargetInfluences();
    //**************************************************************************** */
    if (
      expressions[8] >= eyesClosedThreshold && // For left and right eye
      expressions[9] >= eyesClosedThreshold
    ) {
      if (lastClosedTime === undefined || !continuous)
        lastClosedTime = Date.now(); // Now is the new time
      continuous = true;
    } else {
      continuous = false;
    }

  } else {
    // Tell the user that detection is off.
    continuous = false;
    // console.log("Not Detected");
  }
  // Replay frame
  requestAnimationFrame(nextFrame);
}


var clockCountdown, paused = false, inprogress = false;
var timeleft = 30, exactCount = 0;
var centerX, centerY, audio;
var soundRight, soundWrong, soundLose, soundWin;
function startGame() {
  animateDiv();
  getCentral();
  $('#clock-spinner').addClass('pie spinner')
  // var soundCustom = new Howl({
  //   src: ['/sound/Blink-Right.mp3']
  // });
  // soundCustom.play();
  soundRight = new Howl({
    src: ['/sound/Blink-Right.mp3']
  });
  soundWrong = new Howl({
    src: ['/sound/Blink-Wrong.mp3']
  });
  soundLose = new Howl({
    src: ['/sound/Game-Lose.mp3']
  });
  soundWin = new Howl({
    src: ['/sound/Game-Win.mp3']
  });
  clockCountdown = setInterval(function () {
    timeleft -= 1;
    if (timeleft <= 0) {
      soundLose.play();
      window.location.pathname = '/play-again.html'
      document.getElementById("clock").innerHTML = 0;
      clearInterval(clockCountdown);
    } else {
      document.getElementById("clock").innerHTML = timeleft;
    }


  }, 1000);
}
function blinked() {
  if (inprogress) { return };
  // blinkCount++;
  // document.getElementById('blink-count').innerHTML = blinkCount;
  inprogress = true;
  addToping();
  setTimeout(function () { inprogress = false }, 2000);
  $('#cookie').stop();
  if (exactCount > 4) {
    soundWin.play();
    setTimeout(function () {
      window.location.pathname = '/welldone.html'
    }, 1000); return;
  }
  // else if (blinkCount >= 5 && exactCount <= 4) {
  //   soundLose.play();
  //   setTimeout(function () {
  //     window.location.pathname = '/play-again.html'
  //   }, 1000); return;
  // }
  setTimeout(function () { animateDiv() }, 1000)
}
function addToping() {
  var exact = caculatePosition();
  // console.log('#toping' + index)
  if (exact < 0.5) {
    // $(id).animate({ top: 40, right: 50 }, 800, function () {
    //   setTimeout(function () {
    //     $(id).css("display", "none");
    //   }, 100)
    // });
    soundWrong.play();
  } else {
    exactCount++;
    $('#candy' + exactCount).css("display", "none");
    var idOutside = '#toping' + exactCount + '_outside'
    $(idOutside).animate({ top: 40, right: 50 }, 800, function () {
      setTimeout(function () {
        $(idOutside).css("display", "none");
        $('#toping' + exactCount).css("display", "block");
      }, 200)
    });
    soundRight.play();
  }

}
function caculatePosition() {
  var cookieWidth = 178;
  var cookieEl = $('#center_cookie')
  var cookieY = cookieEl.offset().top;
  var cookieX = cookieEl.offset().left;
  // console.log() 
  return (cookieWidth - Math.abs(cookieY - centerY)) / cookieWidth
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function animateDiv() {
  $('#cookie').animate({ bottom: getRandomInt(-250, 250), left: 0 }, 2000, function () {
    animateDiv();
  });

};
function getCentral() {
  var centerElement = $('#center_circle');
  var offset = centerElement.offset();
  var width = centerElement.width();
  centerX = offset.left
  centerY = offset.top
  console.log(centerX, centerY);
}
function playAudio(url) {
  if (audio) {
    audio.pause(); audio.currentTime = 0;
  }
  audio = new Audio(url);
  audio.crossOrigin = 'anonymous';
  audio.play().then(s => {
    console.log(s)
  }).catch(err => {
    console.log(err)
  });
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  // this.sound.play();
  this.play = function () {
    this.sound.play();
  }
  this.stop = function () {
    this.sound.pause();
  }
}
