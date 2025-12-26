"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function MotivationQuote() {
  const [quote, setQuote] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch("/api/motivation-quote");
      if (response.ok) {
        const data = await response.json();
        setQuote(data.quote);
      } else {
        setQuote("Your body can do it. It's your mind you need to convince!");
      }
    } catch (error) {
      setQuote("The only bad workout is the one that didn't happen!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!loading && quote && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-pink-100 via-white to-blue-100 border-pink-200 dark:from-pink-900/20 dark:via-slate-800 dark:to-blue-900/20 dark:border-pink-800/30 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                </div>
                <p className="text-sm md:text-base font-medium italic text-center flex-1 text-gray-700 dark:text-gray-200">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

