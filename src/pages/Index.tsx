import { useState, useRef, useEffect } from "react";
import { CameraView } from "@/components/CameraView";
import { ControlButtons } from "@/components/ControlButtons";
import { NarrationDisplay } from "@/components/NarrationDisplay";
import { HistoryPanel, NarrationItem } from "@/components/HistoryPanel";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentNarration, setCurrentNarration] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<NarrationItem[]>([]);
  const cameraRef = useRef<{ captureImage: () => void }>(null);
  const { speak, toggle, isPlaying } = useSpeechSynthesis();
  const { isListening, transcript, startListening } = useSpeechRecognition();
  const { toast } = useToast();

  // Process voice command when transcript is available
  useEffect(() => {
    if (transcript) {
      handleVoiceCommand(transcript);
    }
  }, [transcript]);

  const addToHistory = (text: string, mode: "describe" | "read" | "voice") => {
    const newItem: NarrationItem = {
      id: Date.now().toString(),
      text,
      mode,
      timestamp: new Date(),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const handleImageCapture = async (imageData: string, mode: "describe" | "read") => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("process-image", {
        body: { imageData, mode },
      });

      if (error) throw error;

      if (data?.success) {
        setCurrentNarration(data.narration);
        speak(data.narration);
        addToHistory(data.narration, mode);
      } else {
        throw new Error(data?.error || "Failed to process image");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      const errorMessage = "Sorry, I couldn't process the image. Please try again.";
      setCurrentNarration(errorMessage);
      speak(errorMessage);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceCommand = async (voiceText: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("process-voice", {
        body: { voiceText },
      });

      if (error) throw error;

      if (data?.success) {
        setCurrentNarration(data.response);
        speak(data.response);
        addToHistory(data.response, "voice");
      } else {
        throw new Error(data?.error || "Failed to process voice command");
      }
    } catch (error) {
      console.error("Error processing voice command:", error);
      const errorMessage = "Sorry, I couldn't understand that. Please try again.";
      setCurrentNarration(errorMessage);
      speak(errorMessage);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDescribeScene = () => {
    // Trigger camera capture
    const video = document.querySelector("video");
    const canvas = document.createElement("canvas");
    
    if (video && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        handleImageCapture(imageData, "describe");
      }
    }
  };

  const handleReadText = () => {
    // Trigger camera capture
    const video = document.querySelector("video");
    const canvas = document.createElement("canvas");
    
    if (video && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        handleImageCapture(imageData, "read");
      }
    }
  };

  const handleVoiceCommandButton = () => {
    if (!isListening) {
      startListening();
      speak("I'm listening. What can I help you with?");
    }
  };

  const handleHistoryItemSelect = (item: NarrationItem) => {
    setCurrentNarration(item.text);
    speak(item.text);
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "History cleared",
      description: "All narrations have been removed from history.",
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Camera Feed */}
      <CameraView
        onCapture={() => {}}
        isProcessing={isProcessing}
      />

      {/* Narration Display */}
      <NarrationDisplay
        text={currentNarration}
        isPlaying={isPlaying}
        onToggleAudio={toggle}
      />

      {/* History Panel */}
      <HistoryPanel
        items={history}
        onClear={handleClearHistory}
        onItemSelect={handleHistoryItemSelect}
      />

      {/* Control Buttons */}
      <ControlButtons
        onDescribeScene={handleDescribeScene}
        onReadText={handleReadText}
        onVoiceCommand={handleVoiceCommandButton}
        isProcessing={isProcessing}
        isListening={isListening}
      />

      {/* App Title */}
      <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold">VisionMate</h1>
        <p className="text-xs opacity-90">AI Accessibility Companion</p>
      </div>
    </div>
  );
};

export default Index;
