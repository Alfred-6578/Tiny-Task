import { useState } from "react";

interface TagSelectorProps {
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  maxTags?: number;
  label?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  allTags,
  selectedTags,
  setSelectedTags,
  maxTags = 5,
  label = "Select Skills",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const availableTags = allTags.filter(tag => !selectedTags.includes(tag));

  const addTag = (tag: string) => {
    if (selectedTags.length >= maxTags) return;
    setSelectedTags([...selectedTags, tag]);
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="relative w-full">
      {label && <p className="font-medium max-tny:text-sm">{label}</p>}

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2 mt-1">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm "
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-blue-500 hover:text-red-500 cursor-pointer"
              type="button"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Dropdown toggle */}
      <button
        onClick={() => selectedTags.length < maxTags && setDropdownOpen(!dropdownOpen)}
        type="button"
        className="w-full border text-gray-400 text-sm border-gray-300 rounded-md px-4 py-2 text-left bg-white hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {selectedTags.length >= maxTags
          ? "Max tags selected"
          : "Select a tag..."}
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && availableTags.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-40 overflow-auto bg-white border border-gray-300 rounded-md shadow-sm">
          {availableTags.map((tag) => (
            <li
              key={tag}
              onClick={() => {
                addTag(tag);
                setDropdownOpen(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm capitalize"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
