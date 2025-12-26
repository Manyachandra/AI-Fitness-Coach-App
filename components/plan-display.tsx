"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FitnessPlan, UserData, Exercise, Meal } from "@/types";
import VoicePlayer from "@/components/voice-player";
import ImageModal from "@/components/image-modal";

interface PlanDisplayProps {
  plan: FitnessPlan;
  userData: UserData;
  onRegenerate: () => void;
  loading: boolean;
}

export default function PlanDisplay({
  plan,
  userData,
  onRegenerate,
  loading,
}: PlanDisplayProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageQuery, setImageQuery] = useState("");

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userData }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fitness-plan-${userData.name}-${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  const handleExerciseClick = (exercise: Exercise) => {
    setImageQuery(exercise.name);
    setShowImageModal(true);
  };

  const handleMealClick = (meal: Meal) => {
    setImageQuery(meal.name);
    setShowImageModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gradient-pink-blue"
        >
          Your Personalized Plan, {userData.name}! 🎯
        </motion.h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={onRegenerate} disabled={loading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workout">🏋️ Workout Plan</TabsTrigger>
          <TabsTrigger value="diet">🥗 Diet Plan</TabsTrigger>
          <TabsTrigger value="tips">💡 Tips & Motivation</TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="space-y-4">
          <VoicePlayer
            text={JSON.stringify(plan.workoutPlan, null, 2)}
            label="Workout Plan"
          />
          <div className="grid gap-4">
            {plan.workoutPlan.weeklySchedule.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:border-pink-400 dark:hover:border-pink-600 transition-all">
                  <CardHeader>
                    <CardTitle className="text-xl text-gradient-pink-blue">{day.day}</CardTitle>
                    <CardDescription>Duration: {day.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {day.exercises.map((exercise, exIndex) => (
                        <motion.div
                          key={exIndex}
                          className="p-3 border-2 border-pink-200 dark:border-pink-800/50 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 dark:hover:from-pink-900/20 dark:hover:to-blue-900/20 cursor-pointer transition-all hover:shadow-md hover:border-pink-400 dark:hover:border-pink-600"
                          onClick={() => handleExerciseClick(exercise)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold flex items-center gap-2">
                                {exercise.name}
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              </h4>
                              {exercise.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {exercise.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {exercise.sets} sets × {exercise.reps} reps
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Rest: {exercise.rest}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          {plan.workoutPlan.tips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Workout Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {plan.workoutPlan.tips.map((tip, index) => (
                    <li key={index} className="text-sm">
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="diet" className="space-y-4">
          <VoicePlayer
            text={JSON.stringify(plan.dietPlan, null, 2)}
            label="Diet Plan"
          />
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Meal Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MealSection
                  title="Breakfast"
                  meal={plan.dietPlan.dailyMealPlan.breakfast}
                  onClick={() => handleMealClick(plan.dietPlan.dailyMealPlan.breakfast)}
                />
                <MealSection
                  title="Lunch"
                  meal={plan.dietPlan.dailyMealPlan.lunch}
                  onClick={() => handleMealClick(plan.dietPlan.dailyMealPlan.lunch)}
                />
                <MealSection
                  title="Dinner"
                  meal={plan.dietPlan.dailyMealPlan.dinner}
                  onClick={() => handleMealClick(plan.dietPlan.dailyMealPlan.dinner)}
                />
                {plan.dietPlan.dailyMealPlan.snacks.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Snacks</h4>
                    <div className="space-y-2">
                      {plan.dietPlan.dailyMealPlan.snacks.map((snack, index) => (
                        <motion.div
                          key={index}
                          className="p-3 border-2 border-pink-200 dark:border-pink-800/50 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 dark:hover:from-pink-900/20 dark:hover:to-blue-900/20 cursor-pointer transition-all hover:shadow-md hover:border-pink-400 dark:hover:border-pink-600"
                          onClick={() => handleMealClick(snack)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{snack.name}</span>
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {snack.calories} cal
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {snack.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {plan.dietPlan.tips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Diet Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {plan.dietPlan.tips.map((tip, index) => (
                      <li key={index} className="text-sm">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>💪 Motivation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.motivation.map((msg, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gradient-to-r from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 rounded-lg text-sm border border-pink-200 dark:border-pink-800/50"
                  >
                    {msg}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>🌟 Lifestyle Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {plan.lifestyleTips.map((tip, index) => (
                  <li key={index} className="text-sm">
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ImageModal
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
        query={imageQuery}
      />
    </div>
  );
}

function MealSection({
  title,
  meal,
  onClick,
}: {
  title: string;
  meal: Meal;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="p-4 border-2 border-pink-200 dark:border-pink-800/50 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 dark:hover:from-pink-900/20 dark:hover:to-blue-900/20 cursor-pointer transition-all hover:shadow-md hover:border-pink-400 dark:hover:border-pink-600"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{title}: {meal.name}</h4>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium">{meal.calories} calories</span>
      </div>
      <p className="text-sm text-muted-foreground">{meal.description}</p>
    </motion.div>
  );
}

