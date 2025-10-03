import { Eye, FileText, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ControlButtonsProps {
  onDescribeScene: () => void;
  onReadText: () => void;
  onVoiceCommand: () => void;
  isProcessing: boolean;
  isListening: boolean;
}

export const ControlButtons = ({
  onDescribeScene,
  onReadText,
  onVoiceCommand,
  isProcessing,
  isListening,
}: ControlButtonsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="action"
            size="xl"
            onClick={onDescribeScene}
            disabled={isProcessing}
            className="flex flex-col gap-2 h-24"
            aria-label="Describe scene"
          >
            <Eye className="w-8 h-8" />
            <span className="text-sm font-semibold">Describe Scene</span>
          </Button>

          <Button
            variant="action"
            size="xl"
            onClick={onReadText}
            disabled={isProcessing}
            className="flex flex-col gap-2 h-24"
            aria-label="Read text"
          >
            <FileText className="w-8 h-8" />
            <span className="text-sm font-semibold">Read Text</span>
          </Button>

          <Button
            variant={isListening ? "success" : "action"}
            size="xl"
            onClick={onVoiceCommand}
            disabled={isProcessing}
            className="flex flex-col gap-2 h-24"
            aria-label="Voice command"
          >
            <Mic className={`w-8 h-8 ${isListening ? "animate-pulse" : ""}`} />
            <span className="text-sm font-semibold">
              {isListening ? "Listening..." : "Voice"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
