import "./styles.css";

// Array for mp3 samples, items are object having file source and name
const samples = [];

samples.push({ src: "src/audio/bass.mp3", name: "Bass" });
samples.push({ src: "src/audio/drum.mp3", name: "Drum" });
samples.push({ src: "src/audio/guitar.mp3", name: "Guitar" });
samples.push({ src: "src/audio/piano.mp3", name: "Piano" });
samples.push({ src: "src/audio/silence.mp3", name: "Silence" });
samples.push({ src: "src/audio/strange-beat.mp3", name: "Strange Beat" });
samples.push({ src: "src/audio/violin.mp3", name: "Violin" });

// 2D array of tracks – so one track can have multiple samples in a row
let tracks = [];
tracks.push([]);
tracks.push([]);
tracks.push([]);
tracks.push([]);

// Let's add these tracks to HTML page, so that user can see them
const tracksDiv = document.getElementById("tracks");
for (let i = 0; i < tracks.length; i++) {
  let trackDiv = document.createElement("div");
  trackDiv.setAttribute("id", "trackDiv" + i);
  let trackDivHeader = document.createElement("h2");
  trackDivHeader.innerText = "Track " + (i + 1);
  trackDiv.appendChild(trackDivHeader);
  tracksDiv.appendChild(trackDiv);
}

// Adding the sample buttons to the page, each sample will generate its own button
const addButtons = document.getElementById("addButtons");
let id = 0;
samples.forEach((sample) => {
  let duration;
  const au = document.createElement("audio");
  au.src = sample.src;

  let newButton = document.createElement("button");

  au.addEventListener("loadedmetadata", () => {
    duration = au.duration;
    console.log(sample.name);
    newButton.setAttribute("duration", duration);
  });

  newButton.setAttribute("data-id", id++);
  newButton.addEventListener("click", () => addSample(newButton));
  newButton.innerText = sample.name;
  addButtons.appendChild(newButton);
});

// By pressing the sample button the sample is added to the tracks array and to the track div
function addSample(addButton) {
  const sampleNumber = addButton.dataset.id;
  const trackNumber = document.querySelector("input[name='track']:checked")
    .value;
  const duration = addButton.getAttribute("duration");

  console.log("Sample number: " + sampleNumber);
  console.log("Track number: " + trackNumber);
  console.log("Duration: " + duration);

  tracks[trackNumber].push(samples[sampleNumber]);

  let trackDiv = document.getElementById("trackDiv" + trackNumber);
  let newItem = document.createElement("div");
  newItem.innerText = samples[sampleNumber].name;
  newItem.style.width = duration * 15 + "px";
  trackDiv.appendChild(newItem);
}

const playButton = document.getElementById("play");
playButton.addEventListener("click", () => playSong());

// Song is played so that each track is started simultaneously
function playSong() {
  let i = 0;
  tracks.forEach((track) => {
    if (track.length > 0) {
      playTrack(track, i);
    }
    i++;
  });
}

// Track is looped – that means it is restarted each time its samples are playd through
function playTrack(track, trackNumber) {
  let volumeInput = document.getElementById(
    "volume" + (trackNumber + 1) + "output"
  );
  let volumeLevel = parseInt(volumeInput.innerText, 10) / 100;

  let audio = new Audio();
  let i = 0;
  audio.addEventListener(
    "ended",
    () => {
      i = ++i < track.length ? i : 0;
      audio.src = track[i].src;
      volumeLevel = parseInt(volumeInput.innerText, 10) / 100;
      audio.volume = volumeLevel;

      console.log("Audio level: " + volumeLevel);
      console.log("Duration: " + audio.duration);

      audio.play();
      console.log(
        "Starting: Track " + trackNumber + ", instrument " + track[i].name
      );
    },
    true
  );

  audio.volume = volumeLevel;
  audio.loop = false;
  audio.src = track[0].src;

  console.log("Audio level: " + volumeLevel);
  console.log("Duration: " + audio.duration);

  audio.play();
  console.log(
    "Starting: Track " + trackNumber + ", instrument " + track[i].name
  );
}

// There is a upload button that adds a sample to samples array and a sample button with an event listener
const uploadButton = document.getElementById("upload");
uploadButton.addEventListener("click", () => {
  const file = document.getElementById("input-sample").files[0];
  let audioSrc = "";
  if (!file) return;

  const fileName = file.name.split(".")[0];

  audioSrc = URL.createObjectURL(file);
  let sample = { src: audioSrc, name: fileName };
  samples.push(sample);
  id = samples.length - 1;

  const au = document.createElement("audio");
  au.src = audioSrc;
  let duration;

  let newButton = document.createElement("button");

  au.addEventListener("loadedmetadata", () => {
    duration = au.duration;
    console.log(sample.name);
    newButton.setAttribute("duration", duration);
  });

  newButton.setAttribute("data-id", id);
  newButton.addEventListener("click", () => addSample(newButton));
  newButton.innerText = sample.name;

  addButtons.appendChild(newButton);
});

// User can add new tracks
let trackCount = 4;
const newTrackButton = document.getElementById("new-track");
newTrackButton.addEventListener("click", () => {
  tracks.push([]);

  let trackDiv = document.createElement("div");
  trackDiv.setAttribute("id", "trackDiv" + trackCount);

  let trackDivHeader = document.createElement("h2");
  trackDivHeader.innerText = "Track " + (trackCount + 1);
  trackDiv.appendChild(trackDivHeader);
  tracksDiv.appendChild(trackDiv);

  const div = document.createElement("div");
  div.setAttribute("id", "track" + (trackCount + 1) + "div");

  const selectTrack = document.createElement("input");
  selectTrack.setAttribute("type", "radio");
  selectTrack.setAttribute("id", "track" + (trackCount + 1));
  selectTrack.setAttribute("name", "track");
  selectTrack.setAttribute("value", trackCount);

  const trackLabel = document.createElement("label");
  trackLabel.setAttribute("for", "track" + (trackCount + 1));
  trackLabel.innerText = "Track " + (trackCount + 1);

  const volumeLabel = document.createElement("label");
  volumeLabel.setAttribute("for", "volume" + (trackCount + 1));
  volumeLabel.innerText = " Volume: ";

  /*
  How to take input from type of range and show it to user:
  https://stackoverflow.com/questions/10004723/html5-input-type-range-show-range-value
  */
  const selectVolume = document.createElement("input");
  selectVolume.setAttribute("type", "range");
  selectVolume.setAttribute("name", "volume");
  selectVolume.setAttribute("id", "volume" + (trackCount + 1));
  selectVolume.setAttribute("min", "0");
  selectVolume.setAttribute("max", "100");
  selectVolume.setAttribute("value", "100");
  selectVolume.setAttribute(
    "oninput",
    "this.nextElementSibling.value = this.value"
  );

  const emptySpan = document.createElement("span");
  emptySpan.innerText = " ";

  const output = document.createElement("output");
  output.setAttribute("id", "volume" + (trackCount + 1) + "output");
  output.innerText = "100";

  const span = document.createElement("span");
  span.innerText = "%";

  div.appendChild(selectTrack);
  div.appendChild(trackLabel);
  div.appendChild(volumeLabel);
  div.appendChild(emptySpan);
  div.appendChild(selectVolume);
  div.appendChild(output);
  div.appendChild(span);

  const trackSelector = document.getElementById("track-selector");
  trackSelector.appendChild(div);

  console.log("Added new track");

  trackCount++;
});
