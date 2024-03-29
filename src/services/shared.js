// Start off by initializing a new context.
// let context = new (window.AudioContext || window.webkitAudioContext)();

// if (!context.createGain)
//   context.createGain = context.createGainNode;
// if (!context.createDelay)
//   context.createDelay = context.createDelayNode;
// if (!context.createScriptProcessor)
//   context.createScriptProcessor = context.createJavaScriptNode;

// // shim layer with setTimeout fallback
// window.requestAnimFrame = (function(){
// return  window.requestAnimationFrame       ||
//   window.webkitRequestAnimationFrame ||
//   window.mozRequestAnimationFrame    ||
//   window.oRequestAnimationFrame      ||
//   window.msRequestAnimationFrame     ||
//   function( callback ){
//   window.setTimeout(callback, 1000 / 60);
// };
// })();

function playSound(context, buffer, time, connector = undefined,envelope={attackTime:0.001,decayTime:0.102,sustain:1.3,relaseTime:0.400}) {
  var source = context.createBufferSource();
  let {attackTime,decayTime,sustain,relaseTime}=envelope;
  let node= context.createGain();
  node.gain.value=0;
  node.gain.linearRampToValueAtTime(0, context.currentTime);
  node.gain.linearRampToValueAtTime(5, context.currentTime + attackTime);
  node.gain.linearRampToValueAtTime(sustain, context.currentTime +attackTime + decayTime);
  node.gain.linearRampToValueAtTime(0, context.currentTime +attackTime+decayTime+relaseTime);

  source.buffer = buffer;
  source.connect(node);
  if (connector !== undefined) node.connect(connector);
  else node.connect(context.destination);

  source[source.start ? "start" : "noteOn"](time);
}

function loadSounds(context, obj, soundMap, callback) {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in soundMap) {
    var path = soundMap[name];
    names.push(name);
    paths.push(path);
  }
  let bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      obj[name] = buffer;
    }
    if (callback) {
      callback();
    }
  });
  bufferLoader.load();
}

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert("error decoding file data: " + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error("decodeAudioData error", error);
      }
    );
  };

  request.onerror = function() {
    alert("BufferLoader: XHR error");
  };

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};

export { loadSounds, playSound };
