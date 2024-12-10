import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface VisibilitySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const VisibilitySelect = ({ value, onChange, disabled }: VisibilitySelectProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select visibility" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">Public</SelectItem>
        <SelectItem value="unlisted">Unlisted</SelectItem>
        <SelectItem value="private">Private</SelectItem>
      </SelectContent>
    </Select>
  );
};