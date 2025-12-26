"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoicePlayerProps {
  text: string;
  label: string;
}

export default function VoicePlayer({ text, label }: VoicePlayerProps) {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voice, setVoice] = useState("21m00Tcm4TlvDq8ikWAM");
  const [usingBrowserTTS, setUsingBrowserTTS] = useState(false);

  // Load voices on mount
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => window.speechSynthesis.getVoices();
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handlePlay = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) {
        setUsingBrowserTTS(true);
        speakWithBrowserTTS(text);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error generating speech:", error);
      setUsingBrowserTTS(true);
      speakWithBrowserTTS(text);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Normal helper function (NOT a hook)
  const speakWithBrowserTTS = (textToSpeak: string) => {
    if (!("speechSynthesis" in window)) {
      alert(
        "Your browser doesn't support text-to-speech. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    window.speechSynthesis.cancel();

    let readableText = textToSpeak;

    try {
      const parsed = JSON.parse(textToSpeak);

      if (parsed.workoutPlan?.weeklySchedule) {
        readableText = "Workout Plan. ";
        parsed.workoutPlan.weeklySchedule.forEach((day: any) => {
          readableText += `${day.day}: ${day.duration}. `;
          day.exercises?.forEach((ex: any) => {
            readableText += `${ex.name}. ${ex.sets} sets of ${ex.reps} reps. Rest ${ex.rest}. `;
          });
        });
      } else if (parsed.dietPlan?.dailyMealPlan) {
        const meals = parsed.dietPlan.dailyMealPlan;
        readableText = `Diet Plan. Breakfast: ${meals.breakfast?.name ?? "Not specified"}. `;
        readableText += `Lunch: ${meals.lunch?.name ?? "Not specified"}. `;
        readableText += `Dinner: ${meals.dinner?.name ?? "Not specified"}. `;
        meals.snacks?.forEach((snack: any) => {
          readableText += `Snack: ${snack.name}. `;
        });
      }
    } catch {
      readableText = textToSpeak.substring(0, 5000);
    }

    const utterance = new SpeechSynthesisUtterance(readableText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(v =>
        v.name.includes("Female") ||
        v.name.includes("Zira") ||
        v.name.includes("Samantha")
      ) ?? voices.find(v => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
      <Button
        onClick={handlePlay}
        disabled={loading}
        variant="outline"
        size="sm"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Volume2 className="h-4 w-4 mr-2" />
        )}
        Listen to {label}
      </Button>

      {!usingBrowserTTS && (
        <Select value={voice} onValueChange={setVoice}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="21m00Tcm4TlvDq8ikWAM">Rachel (Default)</SelectItem>
            <SelectItem value="pNInz6obpgDQGcFmaJgB">Adam</SelectItem>
            <SelectItem value="EXAVITQu4vr4xnSDxMaL">Bella</SelectItem>
            <SelectItem value="ErXwobaYiN019PkySvjV">Antoni</SelectItem>
          </SelectContent>
        </Select>
      )}

      {usingBrowserTTS && (
        <span className="text-xs text-muted-foreground px-2">
          Using browser voice
        </span>
      )}

      {audioUrl && !usingBrowserTTS && (
        <audio controls src={audioUrl} className="flex-1 max-w-xs" />
      )}
    </div>
  );
}
