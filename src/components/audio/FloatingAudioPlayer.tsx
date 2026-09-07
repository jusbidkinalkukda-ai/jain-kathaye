import { Play, Pause, X, Headphones } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BOOKS } from '../../data/storiesData';

export const FloatingAudioPlayer: React.FC = () => {
  const { audio, pauseAudio, resumeAudio, stopAudio, setAudioSpeed, openReader, selectedBookId } = useApp();

  if (!audio.isPlaying && !audio.text) return null;

  const currentBook = BOOKS.find((b) => b.id === audio.bookId);
  const currentChapter = currentBook?.chapters.find((c) => c.chapterNumber === audio.chapterNumber);

  // If reader is already open for this exact book and chapter, we don't need the floating player
  if (selectedBookId === audio.bookId) return null;

  const nextSpeed = () => {
    if (audio.speed === 1) setAudioSpeed(1.25);
    else if (audio.speed === 1.25) setAudioSpeed(0.8);
    else setAudioSpeed(1);
  };

  return (
    <div className="fixed bottom-16 md:bottom-5 right-3 left-3 md:left-auto md:right-6 md:w-96 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-jain-gold/50 shadow-jain-elevated p-3 text-jain-text animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        {/* Book Info */}
        <div
          onClick={() => {
            if (audio.bookId && audio.chapterNumber) {
              openReader(audio.bookId, audio.chapterNumber);
            }
          }}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-jain-text truncate">
              {currentChapter?.title || currentBook?.title || 'ऑडियो वाचन'}
            </h4>
            <p className="text-[10px] text-jain-muted truncate">
              अध्याय {audio.chapterNumber} • {audio.isPlaying ? 'वाचन जारी है' : 'विराम'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={nextSpeed}
            className="text-[10px] font-bold px-2 py-1 rounded-md bg-jain-cream text-jain-maroon border border-jain-border"
            title="गति बदलें"
          >
            {audio.speed}x
          </button>

          <button
            onClick={() => (audio.isPlaying ? pauseAudio() : resumeAudio())}
            className="w-8 h-8 rounded-full bg-jain-maroon hover:bg-jain-maroon-dark text-white flex items-center justify-center transition-all shadow-xs"
          >
            {audio.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={stopAudio}
            className="w-7 h-7 rounded-full text-jain-muted hover:text-red-600 flex items-center justify-center transition-colors"
            title="बंद करें"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
