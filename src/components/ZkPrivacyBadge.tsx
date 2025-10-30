import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

const STORAGE_KEY = "zk_private_strategy_enabled";

export const ZkPrivacyBadge = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setEnabled(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border">
      <Badge variant={enabled ? "default" : "secondary"} className="flex items-center gap-1">
        <Shield className="w-3 h-3" />
        {enabled ? "Private Strategy (zk-stub)" : "Public Strategy"}
      </Badge>
      <Switch checked={enabled} onCheckedChange={setEnabled} />
    </div>
  );
};

export const isZkPrivateEnabled = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};


