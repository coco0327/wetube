const video = document.querySelector("video");
const playBtn = document.querySelector(".video-player__playBtn");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.querySelector(".video-player__muteBtn");
const muteBtnIcon = muteBtn.querySelector("i");
const timeBar = document.querySelector(".video-player__timeBtn");
const volumeBar = document.querySelector(".video-player__volume--bar");
const currentTime = document.querySelector(
  ".video-player__time-display--current"
);
const totalTime = document.querySelector(".video-player__time-display--total");
const timeline = document.querySelector(".video-player__timeline");
const fullscreenBtn = document.querySelector(".video-player__fullscreenBtn");
const fullscreenBtnIcon = fullscreenBtn.querySelector("i");
const videoContainer = document.querySelector(".video-player__container");
const videoControls = document.querySelector(".video-player__controls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const togglePlayPause = () => {
  video.paused ? video.play() : video.pause();
  playBtnIcon.className = `fas fa-${video.paused ? "play" : "pause"}`;
};

const handlePlayClick = togglePlayPause;
const handleVideoClick = togglePlayPause;

const handleSpacePlay = (event) => {
  const { code } = event;
  if (code === "Space") {
    event.preventDefault();
    togglePlayPause();
  }
};

const handleMuteClick = () => {
  //   video.muted ? (video.muted = false) : (video.muted = true);
  video.muted = !video.muted;
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeBar.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;

  if (parseFloat(value) === 0) {
    video.muted = true;
    muteBtnIcon.classList = "fas fa-volume-mute";
  } else {
    if (video.muted) {
      video.muted = false;
      muteBtnIcon.classList = "fas fa-volume-up";
    }
  }

  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// Check until total video time update
const updateTotalTime = () => {
  if (isFinite(video.duration) && video.duration > 0) {
    totalTime.innerText = formatTime(video.duration);
    timeline.max = Math.floor(video.duration);
  } else {
    setTimeout(updateTotalTime, 100); // 재시도
  }
};

const handleLoadedMetadata = () => {
  updateTotalTime();
};

const handleDurationChange = () => {
  updateTotalTime();
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(video.currentTime);
  timeline.value = Math.floor(video.currentTime);
};

const handleEnded = () => {
  const {
    dataset: { id },
  } = videoContainer;
  fetch(`/api/videos/${id}/views`, {
    method: "POST",
  });
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreenCheck = document.fullscreenElement;
  if (fullscreenCheck) {
    document.exitFullscreen();
    fullscreenBtnIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullscreenBtnIcon.classList = "fas fa-compress";
  }
};

const hideControls = () =>
  videoControls.classList.remove("video-player__controls--visible");

const handleMouseOver = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("video-player__controls--visible");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseOut = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeBar.addEventListener("input", handleVolumeChange);
timeline.addEventListener("input", handleTimelineChange);
fullscreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("click", handleVideoClick);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("durationchange", handleDurationChange);
video.addEventListener("keydown", handleSpacePlay);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mouseover", handleMouseOver);
videoContainer.addEventListener("mouseout", handleMouseOut);
