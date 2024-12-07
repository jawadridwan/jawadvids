import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  className?: string;
}

export const MetricCard = ({ title, value, change, positive, className }: MetricCardProps) => {
  return (
    <div className={cn("bg-youtube-dark p-6 rounded-xl animate-fade-in", className)}>
      <h3 className="text-youtube-gray mb-2 text-sm">{title}</h3>
      <div className="flex items-end gap-3">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className={cn("text-sm", positive ? "text-green-500" : "text-youtube-red")}>
          {change}
        </span>
      </div>
    </div>
  );
};