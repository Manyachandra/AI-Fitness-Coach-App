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

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Chrome needs voices to be loaded
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
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
      // Fallback to browser's built-in text-to-speech
      setUsingBrowserTTS(true);
      useBrowserTTS(text);
      setLoading(false);
      return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error generating speech:", error);
      // Fallback to browser's built-in text-to-speech
      setUsingBrowserTTS(true);
      useBrowserTTS(text);
    } finally {
      setLoading(false);
    }
  };

  const useBrowserTTS = (textToSpeak: string) => {
    // Check if browser supports Web Speech API
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Parse JSON text to make it more readable
      let readableText = textToSpeak;
      try {
        const parsed = JSON.parse(textToSpeak);
        // Convert workout plan to readable text
        if (parsed.workoutPlan) {
          readableText = `Workout Plan. `;
          if (parsed.workoutPlan.weeklySchedule) {
            parsed.workoutPlan.weeklySchedule.forEach((day: any) => {
              readableText += `${day.day}: ${day.duration}. `;
              if (day.exercises) {
                day.exercises.forEach((ex: any) => {
                  readableText += `${ex.name}. ${ex.sets} sets of ${ex.reps} reps. Rest ${ex.rest}. `;
                });
              }
            });
          }
        } else if (parsed.dietPlan) {
          readableText = `Diet Plan. `;
          if (parsed.dietPlan.dailyMealPlan) {
            const meals = parsed.dietPlan.dailyMealPlan;
            readableText += `Breakfast: ${meals.breakfast?.name || 'Not specified'}. `;
            readableText += `Lunch: ${meals.lunch?.name || 'Not specified'}. `;
            readableText += `Dinner: ${meals.dinner?.name || 'Not specified'}. `;
            if (meals.snacks) {
              meals.snacks.forEach((snack: any) => {
                readableText += `Snack: ${snack.name}. `;
              });
            }
          }
        }
      } catch (e) {
        // If not JSON, use text as is
        readableText = textToSpeak.substring(0, 5000); // Limit length
      }

      const utterance = new SpeechSynthesisUtterance(readableText);
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to use a more natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find((v) => 
        v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha')
      ) || voices.find((v) => v.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser doesn't support text-to-speech. Please use a modern browser like Chrome, Edge, or Safari.");
    }
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
        <span className="text-xs text-muted-foreground px-2">Using browser voice</span>
      )}
      {audioUrl && !usingBrowserTTS && (
        <audio controls src={audioUrl} className="flex-1 max-w-xs" />
      )}
    </div>
  );
}

