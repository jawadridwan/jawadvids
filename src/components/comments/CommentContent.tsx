import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";

interface CommentContentProps {
  username: string | null;
  avatarUrl: string | null;
  createdAt: string;
  content: string;
  isEditing: boolean;
  editContent: string;
  onEditContentChange: (content: string) => void;
}

export const CommentContent = ({
  username,
  avatarUrl,
  createdAt,
  content,
  isEditing,
  editContent,
  onEditContentChange,
}: CommentContentProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback>{username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{username || 'Anonymous'}</p>
          <p className="text-sm text-youtube-gray">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      {isEditing ? (
        <Textarea
          value={editContent}
          onChange={(e) => onEditContentChange(e.target.value)}
          className="w-full mt-2"
        />
      ) : (
        <p className="text-youtube-gray">{content}</p>
      )}
    </div>
  );
};