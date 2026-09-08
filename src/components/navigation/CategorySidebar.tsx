import React, { useState } from 'react';
import { ChevronRight, ChevronDown, BookOpen, Layers, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Book } from '../../types';

interface CategorySidebarProps {
  onStorySelect?: (storyId: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ onStorySelect }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    allCategories,
    allBooks,
    openReader,
  } = useApp();

  // State to control tree expansion (matching the breadcrumb hierarchy in screenshot)
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    education: true,
    material: true,
    stories: true,
  });

  const toggleParent = (key: string) => {
    setExpandedParents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Get stories for current category or all stories for sidebar display
  const currentCategoryStories = (
    selectedCategory === 'all'
      ? allBooks
      : allBooks.filter(
          (b) =>
            b.categoryId === selectedCategory ||
            (b.tags && b.tags.includes(selectedCategory))
        )
  );

  const handleStoryClick = (book: Book) => {
    if (onStorySelect) {
      onStorySelect(book.id);
    } else {
      openReader(book.id);
    }
  };

  return (
    <aside className="w-full bg-white/95 backdrop-blur-xs rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-xs select-none">
      {/* Top Header */}
      <div className="pb-3 mb-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-jain-maroon" />
          <span>Categories (श्रेणियाँ)</span>
        </h3>
        <span className="text-[10px] text-gray-600 font-medium">
          {allCategories.length} विषय
        </span>
      </div>

      {/* Main Hierarchical Tree (Directly matching screenshot) */}
      <div className="text-xs font-medium space-y-1">
        {/* Level 1: Education */}
        <div
          onClick={() => toggleParent('education')}
          className="flex items-center justify-between py-1.5 px-2 rounded-lg text-gray-700 hover:text-jain-maroon hover:bg-jain-cream cursor-pointer transition-colors"
        >
          <span className="font-semibold">Education</span>
          {expandedParents.education ? (
            <ChevronDown className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          )}
        </div>

        {expandedParents.education && (
          <div className="pl-2.5 border-l border-gray-200 space-y-1">
            {/* Level 2: For Teachers/Parents */}
            <div className="flex items-center justify-between py-1 px-2 text-gray-600 hover:text-[#8F2018] cursor-pointer transition-colors">
              <span>For Teachers/Parents</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </div>

            {/* Level 2: Jain Education Material */}
            <div
              onClick={() => toggleParent('material')}
              className="flex items-center justify-between py-1 px-2 text-gray-700 hover:text-[#8F2018] cursor-pointer transition-colors font-semibold"
            >
              <span>Jain Education Material</span>
              {expandedParents.material ? (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
            </div>

            {expandedParents.material && (
              <div className="pl-2.5 border-l border-gray-200 space-y-1">
                {/* Level 3: Beginner Level */}
                <div
                  onClick={() => setSelectedCategory('pathshala')}
                  className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedCategory === 'pathshala'
                      ? 'text-[#8F2018] font-bold bg-jain-cream/70 border-r-2 border-[#8F2018]'
                      : 'text-gray-600 hover:text-[#8F2018]'
                  }`}
                >
                  <span>Beginner Level</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </div>

                {/* Level 3: Elementary Level */}
                <div
                  onClick={() => setSelectedCategory('moral')}
                  className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedCategory === 'moral'
                      ? 'text-[#8F2018] font-bold bg-jain-cream/70 border-r-2 border-[#8F2018]'
                      : 'text-gray-600 hover:text-[#8F2018]'
                  }`}
                >
                  <span>Elementry Level</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </div>

                {/* Level 3: Jain Stories (Active in screenshot with orange indicator!) */}
                <div
                  onClick={() => {
                    setSelectedCategory('all');
                    toggleParent('stories');
                  }}
                  className={`flex items-center justify-between py-1.5 px-2 rounded cursor-pointer transition-all ${
                    selectedCategory === 'all' || selectedCategory === 'tirthankara' || selectedCategory === 'pauranik'
                      ? 'text-[#8F2018] font-bold bg-jain-cream border-r-3 border-[#8F2018]'
                      : 'text-gray-700 hover:text-[#8F2018]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#8F2018]" />
                    <span>Jain Stories &gt;</span>
                  </div>
                </div>

                {/* Level 4: List of Individual Stories (Indented uppercase list from screenshot) */}
                {expandedParents.stories && (
                  <div className="pl-3 py-1 space-y-0.5 border-l-2 border-jain-gold/40">
                    {currentCategoryStories.slice(0, 16).map((book) => {
                      // Format story title as uppercase short label (e.g. AIMUTTA MUNI)
                      const titleEnUpper = (book.titleEn || book.title)
                        .replace(/\(.*?\)/g, '')
                        .replace(/-/g, ' ')
                        .trim()
                        .toUpperCase();

                      return (
                        <div
                          key={book.id}
                          onClick={() => handleStoryClick(book)}
                          className="py-1 px-2 rounded text-[11px] font-semibold text-gray-600 hover:text-[#8F2018] hover:bg-jain-cream cursor-pointer transition-all flex items-center justify-between group"
                          title={`${book.title} - पढ़ें`}
                        >
                          <span className="truncate max-w-[170px] group-hover:translate-x-0.5 transition-transform">
                            {titleEnUpper}
                          </span>
                          <span className="text-[9px] opacity-0 group-hover:opacity-100 text-[#8F2018] transition-opacity font-bold">
                            ➔
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Categories Section for Direct Quick Filtering */}
        <div className="pt-3 mt-3 border-t border-gray-100">
          <div className="text-[10px] uppercase tracking-wider font-bold text-gray-600 mb-1.5 px-2">
            विषय अनुसार खोजें (All Topics)
          </div>
          {allCategories
            .filter((cat) => cat.id !== 'all' && (cat.bookCount ?? 0) > 0)
            .map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left py-1.5 px-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-jain-cream text-jain-maroon font-bold border-r-2 border-jain-maroon'
                    : 'text-gray-600 hover:text-jain-maroon hover:bg-jain-cream-light'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-xs">📖</span>
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-[10px] text-gray-600 font-normal shrink-0">
                  ({cat.bookCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
