import { useState, useEffect, useRef } from 'react';

// 2. ІМПОРТ ЛОКАЛЬНИХ ФОТОГРАФІЙ ТА АУДІО
import song from './assets/song.mp3';
import photo1 from './assets/photo1.jpg';
import photo2 from './assets/photo2.jpg';
import photo3 from './assets/photo3.jpg';
import photo4 from './assets/photo4.jpg';
import photo5 from './assets/photo5.jpg';
import photo6 from './assets/photo6.jpg';
import photo7 from './assets/photo7.jpg';
import photo8 from './assets/photo8.jpg';
import photo9 from './assets/photo9.jpg';
import photo10 from './assets/photo10.jpg';
import photo11 from './assets/photo11.jpg';
import photo12 from './assets/photo12.jpg';
import photo13 from './assets/photo13.jpg';
import photo14 from './assets/photo14.jpg';
import photo15 from './assets/photo15.jpg';
import photo16 from './assets/photo16.jpg';
import photo17 from './assets/photo17.jpg';
import photo18 from './assets/photo18.jpg';
import photo19 from './assets/photo19.jpg';
import photo20 from './assets/photo20.jpg';
import photo21 from './assets/photo21.jpg';
import photo22 from './assets/photo22.jpg';
import photo23 from './assets/photo23.jpg';
import photo24 from './assets/photo24.jpg';
import photo25 from './assets/photo25.jpg';
import photo26 from './assets/photo26.jpg';
import photo27 from './assets/photo27.jpg';
import photo28 from './assets/photo28.jpg';
import photo29 from './assets/photo29.jpg';
import photo30 from './assets/photo30.jpg';

const CONFIG = {
  countdownSteps: ["3", "2", "1", "HAPPY", "BIRTHDAY", "TO", "VLAD", "❤️"],
  stepDuration: 1100,
  heartSceneDuration: 5500,
  audio: song,
  gifUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGlubmQ0M3FqYnhqcTl5cDh4ajF1ZnVvczNuc25rYXF1MWJieWN0NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WHRXBIW59jLYDDxa4q/giphy.gif",
  finalScreen: {
    title: "Happy Birthday Vladik  ❤️",
    photos: [
      photo1, photo2, photo3, photo4, photo5,
      photo6, photo7, photo8, photo9, photo10,
      photo11, photo12, photo13, photo14, photo15,
      photo16, photo17, photo18, photo19, photo20,
      photo21, photo22, photo23, photo24, photo25,
      photo26, photo27, photo28, photo29, photo30
    ]
  }
};

const HEART_PATH = [
  { x: 0,   y: -12, rot: 5 },   { x: -7,  y: -19, rot: -15 }, { x: -16, y: -17, rot: -25 },
  { x: -22, y: -10, rot: -35 }, { x: -24, y: -1,  rot: -10 }, { x: -21, y: 8,   rot: 10 },
  { x: -15, y: 16,  rot: 25 },  { x: -7,  y: 23,  rot: 35 },  { x: 0,   y: 29,  rot: 0 },
  { x: 7,   y: 23,  rot: -35 }, { x: 15, y: 16,  rot: -25 }, { x: 21, y: 8,   rot: -10 },
  { x: 24, y: -1,  rot: 10 },  { x: 22, y: -10, rot: 35 },  { x: 16, y: -17, rot: 25 },
  { x: 7,   y: -19, rot: 15 },  { x: -1,  y: -5,  rot: -5 },  { x: 0,   y: 3,   rot: 12 },
];

export default App;

function App() {
  const [stage, setStage] = useState<'welcome' | 'countdown' | 'heartAnimation' | 'book' | 'finalHeart'>('welcome');
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [bookPage, setBookPage] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  const [animatedStartPage, setAnimatedStartPage] = useState<number>(0);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const photoTurns = Math.ceil(CONFIG.finalScreen.photos.length / 2);
  const totalPages = photoTurns + 1;

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Керування відліком (працює тільки якщо телефон у горизонтальному положенні)
  useEffect(() => {
    if (stage !== 'countdown' || !isLandscape) return;
    const timer = setTimeout(() => {
      if (currentStep < CONFIG.countdownSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setStage('heartAnimation');
      }
    }, CONFIG.stepDuration);
    return () => clearTimeout(timer);
  }, [currentStep, stage, isLandscape]);

  useEffect(() => {
    if (stage !== 'heartAnimation' || !isLandscape) return;
    const timer = setTimeout(() => {
      setStage('book');
    }, CONFIG.heartSceneDuration);
    return () => clearTimeout(timer);
  }, [stage, isLandscape]);

  const startSurprise = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio play blocked or failed:", err));
    }
    setStage('countdown');
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (isFlipping) return;

    if (direction === 'next' && bookPage === totalPages) {
      setStage('finalHeart');
      return;
    }

    if (direction === 'next' && bookPage >= totalPages) return;
    if (direction === 'prev' && bookPage <= 0) return;

    setAnimatedStartPage(bookPage);
    setFlipDirection(direction);
    setIsFlipping(true);

    setTimeout(() => {
      if (direction === 'next') {
        setBookPage((prev) => prev + 1);
      } else {
        setBookPage((prev) => prev - 1);
      }
    }, 250);

    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
    }, 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    const minSwipeDistance = 35;
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (Math.abs(swipeDistance) < minSwipeDistance) return;
    if (swipeDistance > 0) handlePageChange('next');
    else handlePageChange('prev');
  };

  const renderLeftPageContent = (pageIndex: number) => {
    if (pageIndex <= 0) return <div className="w-full h-full bg-transparent" />;
    if (pageIndex === totalPages) {
      return (
          <div className="w-full h-full bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-xl shadow-inner layer-accelerate">
            <span className="text-6xl sm:text-7xl select-none filter drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">❤️</span>
          </div>
      );
    }
    return (
        <div className="w-full h-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800/40 layer-accelerate">
          <img src={CONFIG.finalScreen.photos[(pageIndex - 1) * 2]} alt="" className="w-full h-full object-cover" loading="eager" />
        </div>
    );
  };

  const renderRightPageContent = (pageIndex: number) => {
    if (pageIndex === 0) {
      return (
          <div className="w-full h-full bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-xl shadow-inner layer-accelerate">
            <span className="text-6xl sm:text-7xl select-none filter drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">❤️</span>
          </div>
      );
    }
    if (pageIndex >= totalPages) return <div className="w-full h-full bg-transparent" />;
    return (
        <div className="w-full h-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800/40 layer-accelerate">
          <img src={CONFIG.finalScreen.photos[(pageIndex - 1) * 2 + 1] || CONFIG.finalScreen.photos[0]} alt="" className="w-full h-full object-cover" loading="eager" />
        </div>
    );
  };

  return (
      <div className="relative w-full h-screen bg-black overflow-hidden select-none touch-none text-white">

        <audio ref={audioRef} src={CONFIG.audio} loop />

        {/* ГЛОБАЛЬНЕ БЛОКУВАННЯ: Якщо телефон вертикально — цей екран перекриває ВСЕ, навіть welcome-екран */}
        {!isLandscape && (
            <div className="absolute inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
              <MatrixRain color="rgba(244, 63, 94, 0.15)" isPaused={false} />
              <div className="w-14 h-14 mb-4 text-rose-500 animate-[rotatePhone_2s_infinite_ease-in-out]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
              </div>
              <h2 className="font-pixel-retro text-[10px] text-rose-400 tracking-wider mb-2">ПОТРІБЕН ГОРИЗОНТАЛЬНИЙ РЕЖИМ</h2>
              <p className="font-pixel-large text-sm text-zinc-400 max-w-xs">Будь ласка, розверни свій telephone боком!</p>
            </div>
        )}

        {/* СЦЕНА 0: СТАРТОВА КНОПКА */}
        {stage === 'welcome' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black p-4 text-center">
              <MatrixRain color="rgba(244, 63, 94, 0.15)" isPaused={false} />
              <button
                  onClick={startSurprise}
                  className="px-8 py-4 font-pixel-large text-sm sm:text-base border-2 border-rose-500 text-rose-500 rounded-xl bg-rose-950/20 active:scale-95 transition-transform duration-100 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse"
              >
                УВІМКНУТИ СЮРПРИЗ 🔊
              </button>
            </div>
        )}

        {/* СЦЕНА 1: ВІДЛІКУ */}
        {stage === 'countdown' && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
              <MatrixRain color="rgba(244, 63, 94, 0.2)" isPaused={false} />
              <div key={currentStep} className="text-rose-500 font-pixel-large text-7xl md:text-9xl tracking-wider text-center px-4 animate-[pop_1.1s_ease-out_infinite] drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                {CONFIG.countdownSteps[currentStep]}
              </div>
            </div>
        )}

        {/* СЦЕНА 2: ВСТАВЛЕНА ГІФКА */}
        {stage === 'heartAnimation' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black animate-fade-in p-4">
              <StarrySky />
              <MatrixRain color="rgba(244, 63, 94, 0.1)" isPaused={false} />
              <div className="max-w-md w-full aspect-video sm:w-[450px] rounded-2xl overflow-hidden border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                <img src={CONFIG.gifUrl} alt="Birthday Celebration" className="w-full h-full object-cover" />
              </div>
            </div>
        )}

        {/* СЦЕНА 3: КНИЖКА-ЛИСТІВКА */}
        {stage === 'book' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 animate-fade-in">
              <StarrySky />
              <MatrixRain color="rgba(244, 63, 94, 0.08)" isPaused={isFlipping} />

              <div className="w-full max-w-4xl h-full flex flex-col justify-between items-center py-3 px-4">
                <div className="w-full max-w-lg bg-zinc-950/90 border border-zinc-800/60 rounded-xl py-1.5 px-3 text-center shadow-md h-[8vh] flex items-center justify-center">
                  <h1 className="text-[10px] sm:text-xs font-pixel-retro text-rose-400 tracking-tight">{CONFIG.finalScreen.title}</h1>
                </div>

                <div className="w-full flex items-center justify-center h-[76vh] my-auto [perspective:2000px] [transform-style:preserve-3d]">
                  <div
                      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
                      className="relative h-[72vh] aspect-[1.65/1] w-auto flex rounded-2xl bg-zinc-900/10 border border-zinc-800/40 p-1.5 [transform-style:preserve-3d]"
                  >
                    <div className="absolute left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/80 via-zinc-800 to-black/80 shadow-[0_0_10px_rgba(0,0,0,0.9)] z-40 transform -translate-x-1/2" />

                    <div className="flex-1 h-full overflow-hidden [backface-visibility:hidden]">
                      {renderLeftPageContent(bookPage)}
                    </div>

                    <div className="flex-1 h-full overflow-hidden [backface-visibility:hidden]">
                      {renderRightPageContent(bookPage)}
                    </div>

                    {isFlipping && flipDirection && (
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-1/2 z-50 [transform-style:preserve-3d] page-flip-layer
                              ${flipDirection === 'next' ? 'left-1/2 origin-left animate-flip-next' : 'right-1/2 origin-right animate-flip-prev'}`}
                        >
                          <div className="absolute inset-0 [backface-visibility:hidden] z-20 overflow-hidden">
                            {flipDirection === 'next' ? renderRightPageContent(animatedStartPage) : renderLeftPageContent(animatedStartPage)}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none animate-shadow-darken" />
                          </div>

                          <div className="absolute inset-0 [backface-visibility:hidden] z-10 overflow-hidden [transform:rotateY(180deg)]">
                            {flipDirection === 'next' ? renderLeftPageContent(animatedStartPage + 1) : renderRightPageContent(animatedStartPage - 1)}
                            <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent pointer-events-none animate-shadow-lighten" />
                          </div>
                        </div>
                    )}

                  </div>
                </div>

                <div className="flex flex-col items-center justify-center h-[8vh] w-full">
                  <p className="font-pixel-retro text-[7px] sm:text-[9px] text-rose-400 tracking-wider animate-pulse text-center px-4">
                    {bookPage === 0 ? (
                        "* СВАЙПНИ ВЛІВО, ЩОБ ВІДКРИТИ ЛИСТІВКУ *"
                    ) : bookPage < totalPages ? (
                        `* СВАЙПНИ ВЛІВО (СТОРІНКА ${bookPage} З ${totalPages}) *`
                    ) : (
                        <span className="text-rose-500 font-bold drop-shadow-[0_0_5px_rgba(244,63,94,0.4)] animate-[bounce_1s_infinite]">
        * ОСТАННІЙ СВАЙП ВЛІВО ДЛЯ СЮРПРИЗУ! 🔥 *
      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
        )}

        {/* СЦЕНА 4: ФІНАЛЬНЕ СЕРЦЕ */}
        {stage === 'finalHeart' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black overflow-hidden animate-fade-in">
              <StarrySky />
              <MatrixRain color="rgba(244, 63, 94, 0.15)" isPaused={false} />

              <div className="absolute top-[8vh] text-center px-4">
                <h2 className="font-pixel-retro text-rose-400 text-lg sm:text-2xl tracking-widest animate-pulse drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]">
                  HAPPY BIRTHDAY TO YOU! 🎂
                </h2>
              </div>

              <div className="relative w-0 h-0 transform scale-[0.85] sm:scale-100 animate-[heartBeat_2.5s_infinite_ease-in-out_2.5s]">
                {HEART_PATH.map((pos, index) => (
                    <div
                        key={index}
                        style={{
                          left: `${pos.x}vmin`, top: `${pos.y}vmin`,
                          transform: `translate(-50%, -50%) rotate(${pos.rot}deg)`,
                          animationDelay: `${index * 0.12}s`, zIndex: index + 10
                        }}
                        className="absolute w-22 h-28 sm:w-26 sm:h-34 rounded-xl border-2 border-rose-400/90 p-0.5 bg-zinc-950 shadow-[0_0_25px_rgba(244,63,94,0.7)] overflow-hidden opacity-0 animate-[spiralSpawn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]"
                    >
                      <img src={CONFIG.finalScreen.photos[index % CONFIG.finalScreen.photos.length]} alt="" className="w-full h-full object-cover rounded-lg" />
                    </div>
                ))}
              </div>
            </div>
        )}

        <style>{`
        .layer-accelerate {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        .page-flip-layer {
          will-change: transform;
          transform: translateZ(0);
        }

        @keyframes pop {
          0% { transform: scale(0.6) translateZ(0); opacity: 0; filter: blur(3px); }
          15% { transform: scale(1.03) translateZ(0); opacity: 1; filter: blur(0); }
          25% { transform: scale(1) translateZ(0); opacity: 1; }
          85% { transform: scale(1) translateZ(0); opacity: 1; }
          100% { transform: scale(1.08) translateZ(0); opacity: 0; filter: blur(1px); }
        }
        @keyframes rotatePhone { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(90deg); } }

        @keyframes spiralSpawn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.1) rotate(-120deg) translateZ(0); filter: blur(8px); }
          50% { opacity: 0.5; }
          100% { opacity: 1; transform: translate(-50%, -50%) rotate(inherit) translateZ(0); filter: blur(0); }
        }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1) translateZ(0); }
          20% { transform: scale(1.08) translateZ(0); }
          40% { transform: scale(1.02) translateZ(0); }
          60% { transform: scale(1.12) translateZ(0); }
        }

        .animate-flip-next { animation: cssFlipNext 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .animate-flip-prev { animation: cssFlipPrev 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

        @keyframes cssFlipNext { 0% { transform: rotateY(0deg) translateZ(0); } 100% { transform: rotateY(-180deg) translateZ(0); } }
        @keyframes cssFlipPrev { 0% { transform: rotateY(0deg) translateZ(0); } 100% { transform: rotateY(180deg) translateZ(0); } }

        @keyframes shadowDarken { 0% { opacity: 0; } 50% { opacity: 0.3; } 100% { opacity: 0; } }
        .animate-shadow-darken { animation: shadowDarken 0.5s linear forwards; }

        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      </div>
  );
}

function MatrixRain({ color, isPaused }: { color: string; isPaused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); if (!ctx) return;

    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.5;

    const alphabet = '0123456789ANITAHAPPYLOVE❤️VLAD'.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const rainDrops: number[] = Array(columns).fill(1);
    let id: number;
    let last = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color; ctx.font = `bold ${fontSize}px monospace`;
      for (let i = 0; i < rainDrops.length; i++) {
        if (Math.random() > 0.4) {
          ctx.fillText(alphabet[Math.floor(Math.random() * alphabet.length)], i * fontSize, rainDrops[i] * fontSize);
        }
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.98) rainDrops[i] = 0;
        rainDrops[i]++;
      }
    };

    const tick = (time: number) => {
      id = requestAnimationFrame(tick);
      if (isPausedRef.current) return;
      if (time - last > 1000 / 30) { last = time; draw(); }
    };

    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 transform scale-[1.35] pointer-events-none" />;
}

function StarrySky() {
  return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
            <div key={i} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: `scale(${Math.random() * 0.6 + 0.4})` }} className="absolute w-1 h-1 bg-white rounded-full animate-pulse" />
        ))}
      </div>
  );
}