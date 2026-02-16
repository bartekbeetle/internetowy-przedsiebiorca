"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  slug: string;
  usageCount?: number;
}

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  maxTags?: number;
}

export function TagInput({
  selectedTags,
  onTagsChange,
  maxTags = 5,
}: TagInputProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tags?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const tags = await res.json();
          const filtered = tags.filter(
            (t: Tag) => !selectedTags.some((s) => s.id === t.id)
          );
          setSuggestions(filtered);
          setShowDropdown(true);
        }
      } catch {
        // silent
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, selectedTags]);

  function addTag(tag: Tag) {
    if (selectedTags.length >= maxTags) return;
    onTagsChange([...selectedTags, tag]);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  function removeTag(tagId: string) {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30"
          >
            #{tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="hover:text-white transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {selectedTags.length < maxTags && (
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setSuggestions.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder={`Dodaj tag (${selectedTags.length}/${maxTags})...`}
          className="w-full h-9 px-3 rounded-lg border border-slate-600 bg-brand-primary text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      )}

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-brand-secondary border border-slate-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addTag(tag)}
              className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>#{tag.name}</span>
              {tag.usageCount !== undefined && (
                <span className="text-xs text-slate-500">
                  {tag.usageCount} postow
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
