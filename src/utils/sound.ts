// Web Audio API context
let audioContext: AudioContext | null = null;

// Store active oscillators and their associated nodes
const activeOscillators = new Map<number, OscillatorNode[]>();
const activeGains = new Map<number, GainNode[]>();

// Store timeout IDs for auto-stopping sounds
const soundTimeouts = new Map<number, number>();

// Chakra frequencies (traditional singing bowl frequencies in Hz)
const chakraFrequencies = [
  256.0, // Root Chakra (C)
  288.0, // Sacral Chakra (D)
  320.0, // Solar Plexus (E)
  341.3, // Heart Chakra (F)
  384.0, // Throat Chakra (G)
  426.7, // Third Eye (A)
  480.0  // Crown Chakra (B)
];

export const initAudio = async () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  
  return audioContext;
};

export const playBowlSound = async (bowlId: number, chakraIndex: number) => {
  try {
    if (!audioContext || audioContext.state !== 'running') {
      audioContext = await initAudio();
    }

    // Stop any existing sound and clear timeout for this bowl
    stopBowlSound(bowlId);
    if (soundTimeouts.has(bowlId)) {
      window.clearTimeout(soundTimeouts.get(bowlId));
      soundTimeouts.delete(bowlId);
    }

    const baseFrequency = chakraFrequencies[chakraIndex];
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // Create multiple oscillators for rich harmonics
    [1, 2, 3, 4].forEach((harmonic) => {
      const oscillator = audioContext!.createOscillator();
      const gainNode = audioContext!.createGain();

      // Set frequency with slight detuning for natural sound
      const detune = (Math.random() - 0.5) * 4;
      oscillator.frequency.setValueAtTime(baseFrequency * harmonic + detune, audioContext!.currentTime);

      // Set gain levels for harmonics
      const gainValue = 1 / (harmonic * 2);
      gainNode.gain.setValueAtTime(0, audioContext!.currentTime);
      gainNode.gain.linearRampToValueAtTime(gainValue, audioContext!.currentTime + 0.1);

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext!.destination);

      // Start oscillator
      oscillator.start();

      oscillators.push(oscillator);
      gains.push(gainNode);
    });

    // Store active nodes
    activeOscillators.set(bowlId, oscillators);
    activeGains.set(bowlId, gains);

    // Set timeout to stop the sound after 2.5 seconds
    const timeoutId = window.setTimeout(() => {
      stopBowlSound(bowlId);
    }, 2500);
    soundTimeouts.set(bowlId, timeoutId);

  } catch (error) {
    console.error('Error playing bowl sound:', error);
  }
};

export const stopBowlSound = (bowlId: number) => {
  const oscillators = activeOscillators.get(bowlId);
  const gains = activeGains.get(bowlId);

  if (oscillators && gains && audioContext) {
    const stopTime = audioContext.currentTime + 0.1;

    gains.forEach((gain) => {
      gain.gain.linearRampToValueAtTime(0, stopTime);
    });

    oscillators.forEach((oscillator) => {
      oscillator.stop(stopTime);
    });

    activeOscillators.delete(bowlId);
    activeGains.delete(bowlId);
  }

  // Clear any existing timeout
  if (soundTimeouts.has(bowlId)) {
    window.clearTimeout(soundTimeouts.get(bowlId));
    soundTimeouts.delete(bowlId);
  }
};

export const isAudioContextRunning = () => {
  return audioContext?.state === 'running';
};