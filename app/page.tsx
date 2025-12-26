"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UserForm from "@/components/user-form";
import PlanDisplay from "@/components/plan-display";
import MotivationQuote from "@/components/motivation-quote";
import { ThemeToggle } from "@/components/theme-toggle";
import type { UserData, FitnessPlan } from "@/types";

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [loading, setLoading] = useState(false);

  // Load saved plan from localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem("fitnessPlan");
    const savedUserData = localStorage.getItem("userData");
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    }
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const handleFormSubmit = async (data: UserData) => {
    setUserData(data);
    setLoading(true);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate plan");
      }

      const generatedPlan = await response.json();
      setPlan(generatedPlan);
      localStorage.setItem("fitnessPlan", JSON.stringify(generatedPlan));
      localStorage.setItem("userData", JSON.stringify(data));
    } catch (error: any) {
      console.error("Error generating plan:", error);
      const errorMessage = error?.message || "Failed to generate plan. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (userData) {
      handleFormSubmit(userData);
    }
  };

  const handleStartOver = () => {
    setPlan(null);
    setUserData(null);
    localStorage.removeItem("fitnessPlan");
    localStorage.removeItem("userData");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gradient-pink-blue"
          >
            💪 AI Fitness Coach
          </motion.h1>
          <ThemeToggle />
        </div>

        <MotivationQuote />

        {!plan ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <UserForm onSubmit={handleFormSubmit} loading={loading} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleStartOver}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Start Over
              </button>
            </div>
            <PlanDisplay
              plan={plan}
              userData={userData!}
              onRegenerate={handleRegenerate}
              loading={loading}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}

