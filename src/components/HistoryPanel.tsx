import { History, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export interface NarrationItem {
  id: string;
  text: string;
  mode: "describe" | "read" | "voice";
  timestamp: Date;
}

interface HistoryPanelProps {
  items: NarrationItem[];
  onClear: () => void;
  onItemSelect: (item: NarrationItem) => void;
}

export const HistoryPanel = ({ items, onClear, onItemSelect }: HistoryPanelProps) => {
  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "describe":
        return "Scene Description";
      case "read":
        return "Text Reading";
      case "voice":
        return "Voice Command";
      default:
        return "Unknown";
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-20 shadow-lg"
          aria-label="View history"
        >
          <History className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>History</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                aria-label="Clear history"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No history yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your narrations will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="p-3 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onItemSelect(item)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-primary">
                      {getModeLabel(item.mode)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-3">
                    {item.text}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
