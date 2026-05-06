type FilterBarProps = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
};

export default function FilterBar({ categories, activeCategory, onSelect }: FilterBarProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`whitespace-nowrap rounded-full px-6 py-2 font-medium transition-all ${
            category === activeCategory
              ? "bg-gold-600 text-black"
              : "border border-zinc-800 bg-zinc-900 hover:border-gold-500/50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
