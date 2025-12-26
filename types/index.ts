export interface UserData {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  height: number; // in cm
  weight: number; // in kg
  fitnessGoal: "Weight Loss" | "Muscle Gain" | "Endurance" | "General Fitness" | "Flexibility";
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced";
  workoutLocation: "Home" | "Gym" | "Outdoor";
  dietaryPreferences: "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Keto";
  medicalHistory?: string;
  stressLevel?: "Low" | "Medium" | "High";
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string | number; // Can be "10-15" or a number
  rest: string;
  description?: string;
}

export interface WorkoutDay {
  day: string;
  exercises: Exercise[];
  duration: string;
}

export interface Meal {
  name: string;
  calories: number;
  description: string;
}

export interface DailyMealPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

export interface FitnessPlan {
  workoutPlan: {
    weeklySchedule: WorkoutDay[];
    tips: string[];
  };
  dietPlan: {
    dailyMealPlan: DailyMealPlan;
    tips: string[];
  };
  motivation: string[];
  lifestyleTips: string[];
}

