const startBtn = document.querySelector(".recorder__startBtn");
const videoPreview = document.querySelector(".recorder__video-preview");

let stream;
let recorder;
let video;

const preview = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  videoPreview.srcObject = stream;
  videoPreview.play();
};

preview();

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    video = URL.createObjectURL(event.data);
    videoPreview.srcObject = null;
    videoPreview.src = video;
    videoPreview.loop = true;
    videoPreview.play();
  };
  recorder.start();
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = video;
  a.download = "My Recording.webm";
  document.body.appendChild(a);
  a.click();
};

startBtn.addEventListener("click", handleStart);
