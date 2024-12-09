import { Input } from "../ui/input";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface HashtagInputProps {
  hashtags: string[];
  onChange: (hashtags: string[]) => void;
  maxTags?: number;
}

export const HashtagInput = ({ hashtags, onChange, maxTags = 15 }: HashtagInputProps) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const tag = input.trim();
      if (tag && hashtags.length < maxTags) {
        const formattedTag = tag.startsWith("#") ? tag : `#${tag}`;
        if (!hashtags.includes(formattedTag)) {
          onChange([...hashtags, formattedTag]);
        }
        setInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(hashtags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add hashtags (press Enter or Space)"
        maxLength={30}
      />
      <div className="flex flex-wrap gap-2">
        {hashtags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full hover:bg-youtube-dark p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};