// Ambient audio. Gated behind a click so browsers allow playback.
// Merry Go by Kevin MacLeod (incompetech.com, CC BY 3.0).
window.SherwoodAudio = (function () {
  let sound = null;
  let ready = false;

  function init() {
    if (ready) return;
    ready = true;
    sound = new Howl({
      src: ["assets/audio/merry-go.mp3"],
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
