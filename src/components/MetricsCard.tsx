import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

export const MetricsCard = ({ title, value, subtitle, icon, trend }: MetricsCardProps) => {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-success" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getValueColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-destructive";
    return "text-foreground";
  };

  return (
    <Card className="glass-card p-6 hover:glow-primary transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        {getTrendIcon()}
      </div>
      <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
      <p className={`text-3xl font-bold mb-1 ${getValueColor()}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </Card>
  );
};
