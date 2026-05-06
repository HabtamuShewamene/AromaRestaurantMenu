import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder = "Search menu..." }: SearchBarProps) {
  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-zinc-800 bg-zinc-900 py-3 pr-4 pl-12 outline-none transition-all focus:border-gold-500"
      />
    </div>
  );
}
