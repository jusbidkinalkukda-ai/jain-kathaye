import React, { useState } from 'react';
import {
  Heart,
  Headphones,
  Play,
  Pause,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpiritualSymbolIcon } from '../components/common/SpiritualSymbols';

export const ReaderView: React.FC = () => {
  const {
    selectedBookId,
    selectedChapterNumber,
    openReader,
    closeReader,
    isFavorite,
    toggleFavorite,
    fontSize,
    setFontSize,
    readerLanguage,
    setReaderLanguage,
    audio,
    playAudio,
    pauseAudio,
    resumeAudio,
    isBookmarked,
    toggleBookmark,
    getBookById,
    allBooks,
  } = useApp();

  const [copyNotification, setCopyNotification] = useState(false);

  const book =
    (selectedBookId ? getBookById(selectedBookId) : null) ||
    allBooks.find((b) => b.id === selectedBookId) ||
    allBooks[0];

  if (!book) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-6 text-center">
        <div>
          <h3 className="font-bold text-lg text-jain-text">कथा उपलब्ध नहीं है</h3>
          <button
            onClick={closeReader}
            className="mt-4 px-4 py-2 bg-jain-maroon text-white font-bold rounded-xl text-sm"
          >
            वापस जाएं
          </button>
        </div>
      </div>
    );
  }

  const chapter =
    book.chapters.find((c) => c.chapterNumber === selectedChapterNumber) ||
    book.chapters[0] || {
      id: `ch-${book.id}-1`,
      chapterNumber: 1,
      title: book.title,
      titleEn: book.titleEn,
      summary: book.description,
      content: [book.description],
      moral: 'सत्य और अहिंसा ही परम धर्म है।',
      audioText: book.description,
      readingTimeMinutes: 2,
    };

  const favorite = isFavorite(book.id);
  const bookmarked = isBookmarked(book.id, chapter.id);

  // Audio status for current chapter
  const isCurrentAudioPlaying =
    audio.isPlaying &&
    audio.bookId === book.id &&
    audio.chapterNumber === chapter.chapterNumber;

  const handleAudioToggle = () => {
    if (isCurrentAudioPlaying) {
      pauseAudio();
    } else if (audio.bookId === book.id && audio.chapterNumber === chapter.chapterNumber) {
      resumeAudio();
    } else {
      playAudio(book.id, chapter.chapterNumber, chapter.audioText || chapter.content.join(' '));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${chapter.title} - ${book.title}`,
        text: `${chapter.summary}\n\nजैन कथाएँ वाचनालय पर पढ़ें:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `"${chapter.title}" - ${book.title}\n${window.location.href}`
      );
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2500);
    }
  };

  // Font size classes
  const fontClasses = {
    normal: 'text-sm sm:text-base leading-relaxed sm:leading-loose',
    large: 'text-base sm:text-lg leading-loose',
    xlarge: 'text-lg sm:text-xl leading-loose',
  };

  const handlePrevChapter = () => {
    if (chapter.chapterNumber > 1) {
      openReader(book.id, chapter.chapterNumber - 1);
    }
  };

  const handleNextChapter = () => {
    if (chapter.chapterNumber < book.chapters.length) {
      openReader(book.id, chapter.chapterNumber + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] pb-24 text-jain-text">
      {/* Top Header Bar matching Screenshot 2 */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-jain-border/80 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Close button (✕ बंद करें) */}
          <button
            onClick={closeReader}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-jain-maroon hover:bg-jain-cream px-3 py-1.5 rounded-full border border-jain-border transition-all active:scale-95"
          >
            <span className="text-sm">✕</span>
            <span>बंद करें</span>
          </button>

          {/* Book Title Header */}
          <h2 className="font-bold text-xs sm:text-base text-jain-text truncate max-w-[200px] sm:max-w-md text-center">
            {book.title}
          </h2>

          {/* Favorite Heart Button */}
          <button
            onClick={() => toggleFavorite(book.id)}
            className="w-9 h-9 rounded-full bg-jain-cream hover:bg-amber-100 flex items-center justify-center border border-jain-border transition-transform active:scale-90"
            title={favorite ? "पसंदीदा से हटाएं" : "पसंदीदा में जोड़ें"}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                favorite ? 'text-red-600 fill-red-600' : 'text-jain-muted'
              }`}
            />
          </button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-4">
        {/* Book Overview Banner Card (Maroon card matching Screenshot 2) */}
        <div className="bg-gradient-to-r from-jain-maroon to-[#731812] text-white rounded-3xl p-4 sm:p-5 shadow-jain-card flex items-center gap-4 sm:gap-5 border border-white/15">
          {/* Left Mini Book Cover */}
          <div className="shrink-0 w-20 h-28 sm:w-24 sm:h-32 rounded-2xl bg-gradient-to-b from-[#A42920] to-[#5C100B] border border-white/20 p-2 flex flex-col justify-between items-center shadow-md relative overflow-hidden">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
            <span className="relative z-10 bg-black/40 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/10">
              {book.badgeTag}
            </span>
            <div className="relative z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <SpiritualSymbolIcon symbol={book.symbol} className="w-6 h-6 text-amber-200" />
            </div>
            <span className="relative z-10 text-[9px] text-amber-200 text-center font-bold">
              {book.chapters.length} कथाएं
            </span>
          </div>

          {/* Right Book Meta */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-white line-clamp-2">
              {book.title}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200 font-medium mt-0.5 truncate">
              {book.titleEn}
            </p>
            <p className="text-[11px] sm:text-xs text-white/80 mt-1 truncate">
              ✍️ {book.author}
            </p>

            {/* Tags row if available */}
            {book.tags && book.tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {book.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/30 border border-white/10 text-amber-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Views Metric Pill */}
            <div className="flex items-center gap-2 mt-3 flex-wrap text-[10px] sm:text-xs text-white/90">
              <span className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-lg border border-white/10">
                <Eye className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {book.views !== undefined && book.views !== null
                    ? typeof book.views === 'number'
                      ? `${book.views} views`
                      : `${book.views}`
                    : (book.readersCount || '1.5k readers')}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Optional Header Illustration Artwork from API */}
        {book.headerImages && book.headerImages.length > 0 && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-jain-border shadow-xs max-h-56 sm:max-h-72">
            <img
              src={book.headerImages[0]}
              alt={`${book.title} Art`}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.parentElement!.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Chapters List (अध्याय सूची) Pills matching Screenshot 2 */}
        <div className="mt-5">
          <div className="text-xs sm:text-sm font-bold text-jain-text mb-2.5">
            अध्याय सूची (Chapters):
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {book.chapters.map((ch) => {
              const isActive = ch.chapterNumber === chapter.chapterNumber;
              return (
                <button
                  key={ch.id}
                  onClick={() => openReader(book.id, ch.chapterNumber)}
                  className={`snap-start shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-jain-maroon text-white shadow-md'
                      : 'bg-white text-jain-text border border-jain-border hover:bg-jain-cream'
                  }`}
                >
                  अध्याय {ch.chapterNumber}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Narration Box (Matching Screenshot 2) */}
        <div className="mt-4 bg-gradient-to-r from-[#EFF6FF] via-[#F8FAFC] to-[#EFF6FF] rounded-2xl p-3.5 sm:p-4 border border-[#BFDBFE] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-blue-200 flex items-center justify-center text-blue-700">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>ऑडियो कथा वाचन</span>
                {isCurrentAudioPlaying && (
                  <span className="flex items-center gap-0.5">
                    <span className="w-1 bg-blue-600 rounded-full sound-bar-1 inline-block h-3" />
                    <span className="w-1 bg-blue-600 rounded-full sound-bar-2 inline-block h-4" />
                    <span className="w-1 bg-blue-600 rounded-full sound-bar-3 inline-block h-2" />
                    <span className="w-1 bg-blue-600 rounded-full sound-bar-4 inline-block h-3" />
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {isCurrentAudioPlaying ? "कथा वाचन जारी है..." : "कथा सुनने हेतु प्ले करें"}
              </p>
            </div>
          </div>

          {/* Listen Button (▶ सुनें / ⏸ विराम) */}
          <button
            onClick={handleAudioToggle}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95 ${
              isCurrentAudioPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#2563EB] hover:bg-blue-700 text-white'
            }`}
          >
            {isCurrentAudioPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>विराम</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>सुनें</span>
              </>
            )}
          </button>
        </div>

        {/* Story Section Header with Title & Controls matching Screenshot 2 */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-jain-border">
          <h3 className="text-base sm:text-lg font-bold text-jain-maroon">
            {readerLanguage === 'hi' ? chapter.title : chapter.titleEn}
          </h3>

          {/* Reader toolbar: Font size zoom & Language toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Language Toggle */}
            {chapter.contentEn && (
              <button
                onClick={() => setReaderLanguage(readerLanguage === 'hi' ? 'en' : 'hi')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-jain-border text-xs font-semibold text-jain-text hover:bg-jain-cream transition-colors"
                title="भाषा बदलें"
              >
                <Globe className="w-3.5 h-3.5 text-jain-maroon" />
                <span>{readerLanguage === 'hi' ? 'English' : 'हिन्दी'}</span>
              </button>
            )}

            {/* Font Size Buttons [ A- ] [ A+ ] */}
            <div className="flex items-center bg-white rounded-lg border border-jain-border p-0.5 text-xs text-jain-muted">
              <span className="px-1.5 text-[11px] font-medium">फ़ॉन्ट:</span>
              <button
                onClick={() => {
                  if (fontSize === 'xlarge') setFontSize('large');
                  else if (fontSize === 'large') setFontSize('normal');
                }}
                disabled={fontSize === 'normal'}
                className="px-2 py-0.5 font-bold hover:text-jain-maroon disabled:opacity-40"
              >
                A-
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => {
                  if (fontSize === 'normal') setFontSize('large');
                  else if (fontSize === 'large') setFontSize('xlarge');
                }}
                disabled={fontSize === 'xlarge'}
                className="px-2 py-0.5 font-bold hover:text-jain-maroon disabled:opacity-40"
              >
                A+
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(book.id, chapter.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                bookmarked
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-white border-jain-border text-jain-muted hover:bg-jain-cream'
              }`}
              title={bookmarked ? "बुकमार्क हटाएं" : "बुकमार्क जोड़ें"}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-600' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white border border-jain-border text-jain-muted hover:text-jain-maroon hover:bg-jain-cream transition-colors"
              title="साझा करें"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copyNotification && (
          <div className="mt-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3 py-1.5 rounded-lg text-center font-medium animate-fade-in">
            ✓ लिंक कॉपी हो गया है!
          </div>
        )}

        {/* Summary Callout Box (📌 सारांश matching Screenshot 2) */}
        <div className="mt-4 bg-[#FFF9E6] border-l-4 border-[#E7B83D] rounded-2xl p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-start gap-2">
            <span className="text-base">📌</span>
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#92600D]">
                सारांश:{' '}
              </span>
              <span className="text-xs sm:text-sm text-[#5C4312] font-medium leading-relaxed">
                {readerLanguage === 'hi' ? chapter.summary : (chapter.summaryEn || chapter.summary)}
              </span>
            </div>
          </div>
        </div>

        {/* Story Text Paragraphs */}
        <div className={`mt-5 space-y-4 ${fontClasses[fontSize]}`}>
          {(readerLanguage === 'hi' ? chapter.content : (chapter.contentEn || chapter.content)).map(
            (para, idx) => (
              <p key={idx} className="text-jain-text font-normal text-justify">
                {para}
              </p>
            )
          )}
        </div>

        {/* Moral & Values Callout Box (🪷 कथा से शिक्षा व संस्कार matching Screenshot 2) */}
        <div className="mt-6 bg-[#FFF8EC] border border-[#E7B83D] rounded-3xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-xl sm:text-2xl">🪷</span>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-jain-maroon mb-1">
                कथा से शिक्षा व संस्कार
              </h4>
              <p className="text-xs sm:text-sm text-jain-text font-medium italic leading-relaxed">
                "{readerLanguage === 'hi' ? chapter.moral : (chapter.moralEn || chapter.moral)}"
              </p>
            </div>
          </div>
        </div>

        {/* Optional Footer Artwork from API */}
        {book.footerImages && book.footerImages.length > 0 && (
          <div className="mt-6 pt-3 border-t border-jain-border flex items-center justify-center">
            <img
              src={book.footerImages[0]}
              alt={`${book.title} Decorative Footer`}
              className="max-h-24 object-contain mx-auto opacity-90"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Bottom Chapter Navigation Bar */}
        <div className="mt-8 pt-4 border-t border-jain-border flex items-center justify-between gap-3">
          <button
            onClick={handlePrevChapter}
            disabled={chapter.chapterNumber === 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-jain-border bg-white text-xs sm:text-sm font-bold text-jain-text hover:bg-jain-cream disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>पिछला अध्याय</span>
          </button>

          <span className="text-xs font-semibold text-jain-muted">
            {chapter.chapterNumber} / {book.chapters.length}
          </span>

          <button
            onClick={handleNextChapter}
            disabled={chapter.chapterNumber === book.chapters.length}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-jain-maroon text-white text-xs sm:text-sm font-bold hover:bg-jain-maroon-dark disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
          >
            <span>अगला अध्याय</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
