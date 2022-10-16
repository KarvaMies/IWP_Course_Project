import "./styles.css";

// Array for mp3 samples, items are object having file source and name
const samples = [];

samples.push({ src: "src/audio/bass.mp3", name: "Bass" });
samples.push({ src: "src/audio/drum.mp3", name: "Drum" });
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
  console.log(sample.name);

  let newButton = document.createElement("button");
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

  console.log("Sample number: " + sampleNumber);
  console.log("Track number: " + trackNumber);

  tracks[trackNumber].push(samples[sampleNumber]);

  let trackDiv = document.getElementById("trackDiv" + trackNumber);
  let newItem = document.createElement("div");
  newItem.innerText = samples[sampleNumber].name;
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
      console.log("Audio level: " + volumeLevel);
      audio.volume = volumeLevel;
      audio.play();
      console.log(
        "Starting: Track " + trackNumber + ", instrument " + track[i].name
      );
    },
    true
  );

  console.log("Audio level: " + volumeLevel);

  audio.volume = volumeLevel;
  audio.loop = false;
  audio.src = track[0].src;
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

  audioSrc = URL.createObjectURL(file);
  let sample = { src: audioSrc, name: "New Sample" };
  samples.push(sample);
  id = samples.length - 1;

  let newButton = document.createElement("button");
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

  /*
    <div id="track2div">
      <input type="radio" id="track2" name="track" value="1" />
      <label for="track2">Track 2</label>
      <label for="volume2">Volume: </label>
      <input
        type="range"
        name="volume"
        id="volume2"
        min="0"
        max="200"
        value="100"
        oninput="this.nextElementSibling.value = this.value"
      />
      <output id="volume2output">100</output><span>%</span>
    </div>
  */

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
  volumeLabel.innerText = "Volume: ";

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

  const output = document.createElement("output");
  output.setAttribute("id", "volume" + (trackCount + 1) + "output");
  output.innerText = "100";

  const span = document.createElement("span");
  span.innerText = "%";

  div.appendChild(selectTrack);
  div.appendChild(trackLabel);
  div.appendChild(volumeLabel);
  div.appendChild(selectVolume);
  div.appendChild(output);
  div.appendChild(span);

  const trackSelector = document.getElementById("track-selector");
  trackSelector.appendChild(div);

  trackCount++;
});
