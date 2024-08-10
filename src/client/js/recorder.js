import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const actionBtn = document.querySelector(".recorder__actionBtn");
const videoPreview = document.querySelector(".recorder__video-preview");

let stream;
let recorder;
let video;

const files = {
  input: "input.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const preview = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 1024, height: 576 },
  });
  videoPreview.srcObject = stream;
  videoPreview.play();
};

preview();

const downloadFile = (url, name) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
};

const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);

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
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  const ffmpeg = new FFmpeg();
  ffmpeg.on("log", ({ message }) => {
    console.log(message);
  });

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  // using Blob URL
  await ffmpeg.writeFile(files.input, await fetchFile(video));
  await ffmpeg.exec(["-i", files.input, "-r", "60", files.output]);
  await ffmpeg.exec([
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb,
  ]);
  const data = await ffmpeg.readFile(files.output);
  const thumbnail = await ffmpeg.readFile(files.thumb);

  // using binary data directly instead of Blob
  //   const response = await fetch(video);
  //   const videoData = await response.arrayBuffer();
  //   const videoUint8Array = new Uint8Array(videoData);

  //   await ffmpeg.writeFile(files.input, videoUint8Array);
  //   await ffmpeg.exec(["-i", files.input, "-r", "60", files.output]);
  //   const data = await ffmpeg.readFile(files.output);

  const blob = new Blob([data.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbnail.buffer], { type: "image/jpg" });

  const url = URL.createObjectURL(blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(url, "My recording.mp4");
  downloadFile(thumbUrl, "My thumb.jpg");

  console.log("delete");
  ffmpeg.deleteFile(files.input);
  ffmpeg.deleteFile(files.output);
  ffmpeg.deleteFile(files.thumb);

  URL.revokeObjectURL(video);
  URL.revokeObjectURL(url);
  URL.revokeObjectURL(thumbUrl);

  actionBtn.disabled = false;
  actionBtn.innerText = "Start Recording";
  actionBtn.addEventListener("click", handleStart);
};

actionBtn.addEventListener("click", handleStart);
