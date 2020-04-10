const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  // get video
  // returns a promise
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
  .then(localMediaStream => {
    video.srcObject = localMediaStream;
    video.play();
  })
  // if not allowed by user
  .catch(err(`No working`, err));
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    // pass video element and will paint to canvas
    // top left hand of the canva
    ctx.drawImage(video, 0, 0, width, height);
    // take pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // change pixels
    // pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);
    ctx.globalAlpha = 0.1;
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}


function takePhoto() {
  // playing sound
  snap.currentTime = 0,
  snap.play();

  // take data out canvas // text based representation of photo
  const data = canvas.toDataURL('image/jpeg');
  // create a link
  const link = document.createElement('a');
  // href set to data
  link.href = data;
  // 'handsome' = name of the link downloaded
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Quarantine Look" />`;
  strip.insertBefore(link, strip.firstChild);
}

// filter = get the pixels out of the canvas
// change values like rgb & put them back in
function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 150; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 500] = pixels.data[i + 1]; // green
    pixels.data[i - 500] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

getVideo();

// once video is played, it will emit event called canplay and will start paintToCanva
video.addEventListener('canplay', paintToCanvas)
