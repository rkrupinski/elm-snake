const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function makeSound(freq, duration) {
  const oscillator = audioCtx.createOscillator();

  oscillator.type = 'square';
  oscillator.frequency.value = freq;

  oscillator.connect(audioCtx.destination);
  oscillator.start(0);

  setTimeout(oscillator.stop.bind(oscillator), duration);
}

export function beep() {
  makeSound(300, 100);
}

export function boop() {
  makeSound(100, 500);
}
