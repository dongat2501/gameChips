let audioContext, osc, lfo;

function start_alarm() {
  try {
    if (osc != undefined) {
      osc.connect(audioContext.destination);
    }
  } catch (e) {}
}

function stop_alarm() {
  try {
    if (osc != undefined) {
      osc.disconnect(audioContext.destination);
    }
  } catch (e) {}
}


