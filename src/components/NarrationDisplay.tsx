import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NarrationDisplayProps {
  text: string;
  isPlaying: boolean;
  onToggleAudio: () => void;
}

export const NarrationDisplay = ({
  text,
  isPlaying,
  onToggleAudio,
}: NarrationDisplayProps) => {
  if (!text) return null;

  return (
    <Card className="absolute top-4 left-4 right-4 z-10 bg-[hsl(var(--narration-bg))] border-2 border-primary shadow-lg">
      <div className="p-4 flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAudio}
          className="flex-shrink-0"
          aria-label={isPlaying ? "Stop audio" : "Play audio"}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-primary animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-foreground leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </Card>
  );
};
