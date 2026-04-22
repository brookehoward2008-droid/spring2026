// Ambient audio. Gated behind a click so browsers allow playback.
// Drop your mp3 at assets/audio/celtic-impulse.mp3 (or edit the path below).
window.SherwoodAudio = (function () {
  let sound = null;
  let ready = false;

  function init() {
    if (ready) return;
    ready = true;
    sound = new Howl({
      src: ["assets/audio/celtic-impulse.mp3"],
      loop: true,
      volume: 0.45,
      html5: true,
      onloaderror: (_, err) => console.warn("[sherwood] audio load error", err),
    });
    sound.play();
  }

  function toggle() {
    if (!sound) return false;
    if (sound.playing()) { sound.pause(); return false; }
    sound.play(); return true;
  }

  function fadeTo(vol, ms = 600) {
    if (!sound) return;
    sound.fade(sound.volume(), vol, ms);
  }

  return { init, toggle, fadeTo };
})();
