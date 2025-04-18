import React, { useState, useEffect } from 'react';
import { Music, Play, Volume2, X, Home, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { playBowlSound, stopBowlSound, initAudio, isAudioContextRunning } from './utils/sound';

const gameLevels = [
  { bowls: 1, description: "Start your journey with a single singing bowl", emoji: "🎵" },
  { bowls: 2, description: "Add a second bowl to increase complexity", emoji: "🌟" },
  { bowls: 3, description: "Master three harmonious bowls", emoji: "✨" },
  { bowls: 4, description: "Challenge yourself with four bowls", emoji: "🌈" },
  { bowls: 5, description: "Experience the harmony of five bowls", emoji: "🎶" },
  { bowls: 6, description: "Advance to six resonating bowls", emoji: "💫" },
  { bowls: 7, description: "Achieve mastery with all seven bowls", emoji: "🌠" }
];

const avatarOptions = [
  { emoji: "🧘‍♀️", name: "Meditating Yogi" },
  { emoji: "🧙‍♀️", name: "Mystic Sage" },
  { emoji: "🦋", name: "Spirit Butterfly" },
  { emoji: "🌸", name: "Lotus Flower" },
  { emoji: "🌟", name: "Cosmic Star" },
  { emoji: "🐉", name: "Spirit Dragon" },
  { emoji: "🦚", name: "Peaceful Peacock" },
  { emoji: "🌺", name: "Sacred Bloom" }
];

const chakraInfo = [
  {
    name: 'Root Chakra',
    location: 'Base of spine',
    properties: 'Grounding',
    color: '#FF0000',
    symbol: '🔴',
    note: 'G',
    emoji: '🌳',
    affirmation: "I Am",
    qualities: "Grounding, basic trust, stability",
    material: "Metal bowls for deep, resonant tones",
    healing: "Supports physical vitality and feeling of safety",
    usage: "Place the bowl near your feet during meditation"
  },
  {
    name: 'Sacral Chakra',
    location: 'Lower abdomen',
    properties: 'Creativity',
    color: '#FFA500',
    symbol: '🟠',
    note: 'A',
    emoji: '🌊',
    affirmation: "I Feel",
    qualities: "Sexuality, creativity, emotion",
    material: "Crystal bowl for pure, flowing energy",
    healing: "Enhances emotional balance and creative expression",
    usage: "Gentle rim rubbing for sustained vibrations"
  },
  {
    name: 'Solar Plexus Chakra',
    location: 'Upper abdomen',
    properties: 'Willpower',
    color: '#FFFF00',
    symbol: '💛',
    note: 'B',
    emoji: '☀️',
    affirmation: "I Do",
    qualities: "Power, wisdom, social self, will",
    material: "Brass bowl for focused energy",
    healing: "Strengthens personal power and confidence",
    usage: "Strike with medium force for empowerment"
  },
  {
    name: 'Heart Chakra',
    location: 'Center of chest',
    properties: 'Love',
    color: '#008000',
    symbol: '💚',
    note: 'C',
    emoji: '🌸',
    affirmation: "I Love",
    qualities: "Love, compassion, integration",
    material: "Crystal bowl for pure heart resonance",
    healing: "Opens the heart and promotes healing",
    usage: "Gentle, continuous rim circling"
  },
  {
    name: 'Throat Chakra',
    location: 'Throat',
    properties: 'Communication',
    color: '#0000FF',
    symbol: '💙',
    note: 'D',
    emoji: '🗣️',
    affirmation: "I Speak",
    qualities: "Expression, inspiration, truth",
    material: "Smaller metal bowl for higher frequencies",
    healing: "Enhances communication and self-expression",
    usage: "Light strikes for clear tones"
  },
  {
    name: 'Third Eye Chakra',
    location: 'Forehead',
    properties: 'Intuition',
    color: '#4B0082',
    symbol: '🟣',
    note: 'E',
    emoji: '👁️',
    affirmation: "I See",
    qualities: "Intuition, awareness, charisma",
    material: "Crystal bowl for clarity",
    healing: "Strengthens intuition and mental clarity",
    usage: "Soft, sustained tones for meditation"
  },
  {
    name: 'Crown Chakra',
    location: 'Top of head',
    properties: 'Spirituality',
    color: '#EE82EE',
    symbol: '👑',
    note: 'F',
    emoji: '✨',
    affirmation: "I Understand",
    qualities: "Spirituality, wisdom",
    material: "Pure crystal bowl for highest vibrations",
    healing: "Connects to higher consciousness",
    usage: "Very gentle playing for spiritual connection"
  }
];

function ChakraInfoPopup({ chakra, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 max-w-2xl w-full text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl">{chakra.emoji}</div>
          <div>
            <h3 className="text-2xl font-bold">{chakra.name}</h3>
            <p className="text-amber-300">{chakra.note} Note - {chakra.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-amber-300">Affirmation</h4>
              <p>"{chakra.affirmation}"</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-300">Qualities</h4>
              <p>{chakra.qualities}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-300">Bowl Material</h4>
              <p>{chakra.material}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-amber-300">Healing Properties</h4>
              <p>{chakra.healing}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-300">Usage Technique</h4>
              <p>{chakra.usage}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/20">
          <h4 className="font-semibold text-amber-300 mb-2">Sound Healing Benefits</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <li>✨ Reduces anxiety</li>
            <li>🧘‍♀️ Promotes mindfulness</li>
            <li>💆‍♀️ Eases chronic pain</li>
            <li>🌙 Improves sleep</li>
            <li>⚡ Enhances energy</li>
            <li>🧠 Boosts cognition</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedChakra, setSelectedChakra] = useState<typeof chakraInfo[0] | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [showCustomization, setShowCustomization] = useState(true);

  useEffect(() => {
    const checkAudioContext = async () => {
      if (!audioInitialized && isAudioContextRunning()) {
        setAudioInitialized(true);
      }
    };
    checkAudioContext();
  }, [audioInitialized]);

  const generateSequence = () => {
    const newSequence = Array.from(
      { length: gameLevels[currentLevel].bowls },
      () => Math.floor(Math.random() * chakraInfo.length)
    );
    setSequence(newSequence);
    return newSequence;
  };

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      setPlayingIndex(i);
      await playBowlSound(i, seq[i]);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    setPlayingIndex(null);
    setIsPlaying(false);
  };

  const handleChakraClick = async (chakraIndex: number) => {
    if (isPlaying) return;

    const newUserSequence = [...userSequence, chakraIndex];
    setUserSequence(newUserSequence);
    await playBowlSound(newUserSequence.length - 1, chakraIndex);

    if (newUserSequence.length === sequence.length) {
      const correct = newUserSequence.every((val, idx) => val === sequence[idx]);
      setIsCorrect(correct);
      setShowResult(true);
      if (correct) {
        setScore(score + 100);
        setSelectedChakra(chakraInfo[chakraIndex]);
      }
    }
  };

  const handleNextLevel = () => {
    setSelectedChakra(null);
    if (currentLevel < gameLevels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    }
    setShowResult(false);
    setUserSequence([]);
    const newSequence = generateSequence();
    setTimeout(() => playSequence(newSequence), 1000);
  };

  const handleRetry = () => {
    setShowResult(false);
    setUserSequence([]);
    playSequence(sequence);
  };

  const handleStartGame = async () => {
    if (!audioInitialized) {
      await initAudio();
      setAudioInitialized(true);
    }
    setGameStarted(true);
    setShowInstructions(false);
    const newSequence = generateSequence();
    setTimeout(() => playSequence(newSequence), 1000);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-700 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">
              Soundbowl Harmony Quest ✨
            </h1>
            <div className="flex justify-center mb-8">
              <div className="text-6xl spin-animation">🎵</div>
            </div>
            <p className="text-xl mb-8 text-amber-100">
              Embark on a journey of sound and harmony with traditional chakra singing bowls 🌟
            </p>
          </div>

          {showCustomization ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute -right-16 -bottom-16 text-8xl float-animation opacity-20">
                🎶
              </div>
              <h2 className="text-2xl font-semibold mb-6 text-amber-300">Customize Your Journey ✨</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="playerName" className="block text-lg mb-2 text-amber-100">
                    Enter Your Name
                  </label>
                  <input
                    type="text"
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your spiritual name..."
                    className="w-full bg-white/5 border border-amber-500/30 rounded-lg px-4 py-2 text-white placeholder-amber-200/50 focus:outline-none focus:border-amber-500 transition-colors"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-lg mb-4 text-amber-100">
                    Choose Your Spirit Guide
                  </label>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setSelectedAvatar((prev) => (prev > 0 ? prev - 1 : avatarOptions.length - 1))}
                      className="bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <div className="text-center">
                      <div className="text-6xl mb-2 float-animation">
                        {avatarOptions[selectedAvatar].emoji}
                      </div>
                      <div className="text-amber-200">
                        {avatarOptions[selectedAvatar].name}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedAvatar((prev) => (prev < avatarOptions.length - 1 ? prev + 1 : 0))}
                      className="bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => {
                      if (playerName.trim()) {
                        setShowCustomization(false);
                        setShowInstructions(true);
                      }
                    }}
                    disabled={!playerName.trim()}
                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ) : showInstructions ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute -right-16 -bottom-16 text-8xl float-animation opacity-20">
                🎶
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{avatarOptions[selectedAvatar].emoji}</div>
                <h2 className="text-2xl font-semibold text-amber-300">
                  Welcome, {playerName}! ✨
                </h2>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-amber-300">How to Play ✨</h3>
              <ul className="space-y-4 text-lg text-amber-100">
                <li className="flex items-start">
                  <span className="mr-2">🎵</span>
                  <span>Listen carefully to the singing bowl sounds played in sequence</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎯</span>
                  <span>Match each sound to its corresponding chakra</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⬆️</span>
                  <span>Progress through levels of increasing complexity</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🌟</span>
                  <span>Master all seven chakra frequencies to complete your journey</span>
                </li>
              </ul>
              <button
                onClick={handleStartGame}
                className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Begin Your Journey ➡️
              </button>
            </div>
          ) : null}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameLevels.map((level, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-amber-500/20"
              >
                <h3 className="text-lg font-semibold mb-2 text-amber-300 flex items-center gap-2">
                  <span className="float-animation inline-block">{level.emoji}</span>
                  Level {index + 1}
                </h3>
                <p className="text-amber-100">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-700 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setGameStarted(false);
                setCurrentLevel(0);
                setScore(0);
                setShowInstructions(true);
                setSequence([]);
                setUserSequence([]);
                setIsPlaying(false);
                setShowResult(false);
                setSelectedChakra(null);
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Return Home
            </button>
            <h2 className="text-3xl font-bold">Level {currentLevel + 1} {gameLevels[currentLevel].emoji}</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg py-2 px-4">
              <p className="text-xl">Score: {score} ⭐</p>
            </div>
          </div>
          
          {!isPlaying && !showResult && sequence.length > 0 && (
            <button
              onClick={() => playSequence(sequence)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center mx-auto gap-2"
            >
              <Volume2 className="w-5 h-5" />
              Replay Sequence 🔄
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {chakraInfo.map((chakra, index) => (
            <div key={index} className="flex flex-col gap-2">
              <button
                disabled={isPlaying || showResult}
                onClick={() => handleChakraClick(index)}
                className={`
                  bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2
                  transition-all duration-300 relative overflow-hidden
                  ${userSequence.includes(index) ? 'border-amber-500' : 'border-transparent'}
                  ${playingIndex === sequence.indexOf(index) ? 'animate-pulse border-amber-400' : ''}
                `}
              >
                <div className="flex items-center">
                  <div className="flex flex-col items-center justify-center mr-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl">
                      <span className={`${playingIndex === sequence.indexOf(index) ? 'glow-animation' : ''}`}>
                        {chakra.emoji}
                      </span>
                    </div>
                    <div className="text-sm mt-1 font-semibold" style={{ color: chakra.color }}>
                      {chakra.note}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg flex items-center gap-2">
                      {chakra.name} {chakra.symbol}
                    </div>
                    <div className="text-sm text-gray-300">{chakra.location}</div>
                    <div className="text-sm text-amber-300">{chakra.properties}</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  if (!isPlaying) {
                    playBowlSound(index, index);
                    setTimeout(() => stopBowlSound(index), 2000);
                  }
                }}
                disabled={isPlaying}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg py-2 px-4 text-sm font-medium text-amber-300 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Volume2 className="w-4 h-4" />
                Try Sound
              </button>
            </div>
          ))}
        </div>

        {showResult && (
          <div className={`text-center p-6 rounded-lg ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <h3 className="text-2xl font-bold mb-4">
              {isCorrect ? '✨ Excellent! ✨' : '❌ Not quite right'}
            </h3>
            <p className="mb-4">
              {isCorrect
                ? "You've mastered this level's sequence! 🎉"
                : "Let's try that sequence again! 🔄"}
            </p>
            <button
              onClick={isCorrect ? handleNextLevel : handleRetry}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center mx-auto gap-2"
            >
              <Play className="w-5 h-5" />
              {isCorrect ? 'Next Level ⭐' : 'Try Again 🔄'}
            </button>
          </div>
        )}

        {selectedChakra && (
          <ChakraInfoPopup
            chakra={selectedChakra}
            onClose={() => setSelectedChakra(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;