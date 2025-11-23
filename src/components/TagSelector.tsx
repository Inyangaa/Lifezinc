interface TagSelectorProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const availableTags = [
  { label: 'Work', value: 'work' },
  { label: 'Family', value: 'family' },
  { label: 'Relationship', value: 'relationship' },
  { label: 'Health', value: 'health' },
  { label: 'Finances', value: 'finances' },
  { label: 'Personal Growth', value: 'personal-growth' },
  { label: 'Creativity', value: 'creativity' },
  { label: 'Social', value: 'social' },
];

export function TagSelector({ selectedTags, onTagToggle }: TagSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900">
        What's this about? (Select all that apply)
      </label>
      <div className="grid grid-cols-2 gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag.value}
            onClick={() => onTagToggle(tag.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedTags.includes(tag.value)
                ? 'bg-emerald-600 text-white border-2 border-emerald-600'
                : 'bg-gray-100 text-gray-900 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}
