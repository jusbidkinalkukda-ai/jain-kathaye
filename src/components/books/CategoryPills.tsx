import React from 'react';
import { CATEGORIES } from '../../data/storiesData';
import { useApp } from '../../context/AppContext';
import { BookOpen, Scroll, GraduationCap, Flame, Library } from 'lucide-react';
import { LotusSymbol } from '../common/SpiritualSymbols';

export const CategoryPills: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();

  const getCategoryIcon = (id: string, isSelected: boolean) => {
    switch (id) {
      case 'all':
        return (
          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-jain-cream text-jain-maroon'}`}>
            <Library className="w-5 h-5" />
          </div>
        );
      case 'tirthankara':
        return (
          <div className="p-1">
            <LotusSymbol className="w-6 h-6" />
          </div>
        );
      case 'pauranik':
        return (
          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
            <Scroll className="w-5 h-5" />
          </div>
        );
      case 'moral':
        return (
          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
            <BookOpen className="w-5 h-5" />
          </div>
        );
      case 'pathshala':
        return (
          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-800'}`}>
            <GraduationCap className="w-5 h-5" />
          </div>
        );
      case 'philosophy':
      default:
        return (
          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'}`}>
            <Flame className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <section className="my-4">
      {/* Title */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h2 className="text-sm sm:text-base font-bold text-jain-text flex items-center gap-1.5">
          <span>📖</span>
          <span>विषय व श्रेणियाँ (Categories)</span>
        </h2>
      </div>

      {/* Horizontal Pills list */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`snap-start shrink-0 flex items-center gap-2.5 py-2 px-3.5 rounded-2xl border transition-all duration-200 text-left ${
                isSelected
                  ? 'bg-jain-maroon text-white border-jain-maroon shadow-md scale-[1.02]'
                  : 'bg-white text-jain-text border-jain-border/80 hover:border-jain-gold/60 hover:bg-jain-cream-light shadow-xs'
              }`}
            >
              {getCategoryIcon(cat.id, isSelected)}
              <div>
                <div className="text-xs sm:text-sm font-bold leading-tight whitespace-nowrap">
                  {cat.name}
                </div>
                <div
                  className={`text-[10px] font-medium whitespace-nowrap ${
                    isSelected ? 'text-amber-100' : 'text-jain-muted'
                  }`}
                >
                  {cat.nameEn}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
