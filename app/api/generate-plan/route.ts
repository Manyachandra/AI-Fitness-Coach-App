import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { UserData, FitnessPlan } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const userData: UserData = await request.json();

    // Check if API key is configured - if not, use demo mode
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
      console.log("Using demo mode - generating plan without API key");
      const demoPlan = generateDemoPlan(userData);
      return NextResponse.json(demoPlan);
    }

    const prompt = `You are an expert fitness coach and nutritionist. Create a comprehensive, personalized fitness and diet plan for the following person:

Name: ${userData.name}
Age: ${userData.age}
Gender: ${userData.gender}
Height: ${userData.height} cm
Weight: ${userData.weight} kg
Fitness Goal: ${userData.fitnessGoal}
Fitness Level: ${userData.fitnessLevel}
Workout Location: ${userData.workoutLocation}
Dietary Preferences: ${userData.dietaryPreferences}
${userData.stressLevel ? `Stress Level: ${userData.stressLevel}` : ""}
${userData.medicalHistory ? `Medical History: ${userData.medicalHistory}` : ""}

Please generate a detailed plan in the following JSON format (respond ONLY with valid JSON, no markdown):

{
  "workoutPlan": {
    "weeklySchedule": [
      {
        "day": "Monday",
        "duration": "45-60 minutes",
        "exercises": [
          {
            "name": "Exercise Name",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "description": "Brief description of the exercise"
          }
        ]
      }
    ],
    "tips": ["Tip 1", "Tip 2", "Tip 3"]
  },
  "dietPlan": {
    "dailyMealPlan": {
      "breakfast": {
        "name": "Meal Name",
        "calories": 400,
        "description": "Detailed meal description"
      },
      "lunch": {
        "name": "Meal Name",
        "calories": 600,
        "description": "Detailed meal description"
      },
      "dinner": {
        "name": "Meal Name",
        "calories": 500,
        "description": "Detailed meal description"
      },
      "snacks": [
        {
          "name": "Snack Name",
          "calories": 150,
          "description": "Snack description"
        }
      ]
    },
    "tips": ["Diet tip 1", "Diet tip 2", "Diet tip 3"]
  },
  "motivation": [
    "Motivational message 1",
    "Motivational message 2",
    "Motivational message 3"
  ],
  "lifestyleTips": [
    "Lifestyle tip 1",
    "Lifestyle tip 2",
    "Lifestyle tip 3"
  ]
}

Important guidelines:
- Create a 7-day workout schedule (Monday through Sunday)
- Ensure exercises are appropriate for ${userData.workoutLocation} setting
- Adjust intensity based on ${userData.fitnessLevel} level
- All meals must be ${userData.dietaryPreferences} compatible
- Consider the goal: ${userData.fitnessGoal}
- Make it realistic and achievable
- Include proper rest days
- Provide specific, actionable advice`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert fitness coach and nutritionist. Always respond with valid JSON only, no markdown formatting.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    let plan: FitnessPlan;

    try {
      plan = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      console.error("JSON parse error:", parseError);
      plan = generateFallbackPlan(userData);
    }

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("Error generating plan:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to generate plan";
    if (error?.status === 401 || error?.message?.includes("API key")) {
      errorMessage = "Invalid OpenAI API key. Please check your .env.local file.";
    } else if (error?.status === 429) {
      errorMessage = "OpenAI API rate limit exceeded. Please try again later.";
    } else if (error?.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

function generateDemoPlan(userData: UserData): FitnessPlan {
  // Generate personalized plan based on user data
  const isHome = userData.workoutLocation === "Home";
  const isBeginner = userData.fitnessLevel === "Beginner";
  const isWeightLoss = userData.fitnessGoal === "Weight Loss";
  
  // Calculate BMI for personalized recommendations
  const heightInMeters = userData.height / 100;
  const bmi = userData.weight / (heightInMeters * heightInMeters);
  
  // Exercise selection based on location and level
  const homeExercises = [
    { name: "Bodyweight Squats", sets: isBeginner ? 3 : 4, reps: isBeginner ? "10-12" : "15-20", rest: "45 seconds", description: "Stand with feet shoulder-width apart, lower down as if sitting in a chair" },
    { name: "Push-ups", sets: isBeginner ? 2 : 3, reps: isBeginner ? "5-8" : "10-15", rest: "60 seconds", description: "Keep your body straight, lower chest to ground and push back up" },
    { name: "Plank", sets: 3, reps: isBeginner ? "20-30 seconds" : "45-60 seconds", rest: "30 seconds", description: "Hold your body in a straight line, engaging your core" },
    { name: "Lunges", sets: isBeginner ? 2 : 3, reps: isBeginner ? "8-10 each leg" : "12-15 each leg", rest: "45 seconds", description: "Step forward into a lunge position, alternate legs" },
    { name: "Mountain Climbers", sets: 2, reps: isBeginner ? "10-15 each leg" : "20-30 each leg", rest: "30 seconds", description: "In plank position, alternate bringing knees to chest" },
  ];
  
  const gymExercises = [
    { name: "Barbell Squats", sets: isBeginner ? 3 : 4, reps: isBeginner ? "8-10" : "10-12", rest: "90 seconds", description: "Compound movement targeting legs and glutes" },
    { name: "Bench Press", sets: isBeginner ? 3 : 4, reps: isBeginner ? "6-8" : "8-10", rest: "90 seconds", description: "Upper body strength exercise for chest and arms" },
    { name: "Deadlifts", sets: isBeginner ? 3 : 4, reps: isBeginner ? "5-6" : "6-8", rest: "120 seconds", description: "Full body compound movement" },
    { name: "Overhead Press", sets: 3, reps: isBeginner ? "6-8" : "8-10", rest: "60 seconds", description: "Shoulder and upper body strength" },
    { name: "Pull-ups or Lat Pulldowns", sets: 3, reps: isBeginner ? "5-8" : "8-12", rest: "60 seconds", description: "Back and bicep strength" },
  ];
  
  const outdoorExercises = [
    { name: "Running/Jogging", sets: 1, reps: isBeginner ? "15-20 minutes" : "25-30 minutes", rest: "5 minutes", description: "Cardiovascular endurance training" },
    { name: "Burpees", sets: isBeginner ? 2 : 3, reps: isBeginner ? "5-8" : "10-15", rest: "60 seconds", description: "Full body explosive movement" },
    { name: "Jump Squats", sets: 3, reps: isBeginner ? "8-10" : "12-15", rest: "45 seconds", description: "Plyometric exercise for power" },
    { name: "Walking Lunges", sets: 2, reps: isBeginner ? "10 each leg" : "15 each leg", rest: "45 seconds", description: "Dynamic lower body exercise" },
  ];
  
  const exercises = isHome ? homeExercises : userData.workoutLocation === "Gym" ? gymExercises : outdoorExercises;
  
  // Meal plan based on dietary preferences
  const vegMeals = {
    breakfast: { name: "Oatmeal with Fruits and Nuts", calories: isWeightLoss ? 350 : 450, description: "1 cup cooked oats, mixed berries, almonds, and a drizzle of honey" },
    lunch: { name: "Quinoa Salad with Vegetables", calories: isWeightLoss ? 500 : 600, description: "Quinoa, mixed vegetables, chickpeas, olive oil dressing" },
    dinner: { name: "Grilled Tofu with Steamed Vegetables", calories: isWeightLoss ? 450 : 550, description: "Marinated tofu, broccoli, carrots, brown rice" },
    snacks: [
      { name: "Greek Yogurt with Berries", calories: 150, description: "Protein-rich snack" },
      { name: "Mixed Nuts", calories: 200, description: "Handful of almonds and walnuts" },
    ],
  };
  
  const nonVegMeals = {
    breakfast: { name: "Scrambled Eggs with Whole Grain Toast", calories: isWeightLoss ? 400 : 500, description: "3 eggs, whole grain bread, avocado" },
    lunch: { name: "Grilled Chicken Salad", calories: isWeightLoss ? 550 : 650, description: "Grilled chicken breast, mixed greens, vegetables, olive oil" },
    dinner: { name: "Baked Salmon with Sweet Potato", calories: isWeightLoss ? 500 : 600, description: "Salmon fillet, roasted sweet potato, steamed broccoli" },
    snacks: [
      { name: "Protein Shake", calories: 200, description: "Whey protein with water or milk" },
      { name: "Hard Boiled Eggs", calories: 140, description: "2 hard boiled eggs" },
    ],
  };
  
  const veganMeals = {
    breakfast: { name: "Smoothie Bowl", calories: isWeightLoss ? 350 : 450, description: "Blended fruits, plant-based protein, granola, chia seeds" },
    lunch: { name: "Lentil Curry with Brown Rice", calories: isWeightLoss ? 500 : 600, description: "Lentils, vegetables, spices, brown rice" },
    dinner: { name: "Stir-fried Vegetables with Tempeh", calories: isWeightLoss ? 450 : 550, description: "Mixed vegetables, tempeh, quinoa" },
    snacks: [
      { name: "Hummus with Veggies", calories: 150, description: "Chickpea hummus with carrot sticks" },
      { name: "Trail Mix", calories: 200, description: "Nuts, seeds, dried fruits" },
    ],
  };
  
  const ketoMeals = {
    breakfast: { name: "Keto Scrambled Eggs with Avocado", calories: 450, description: "3 eggs, butter, avocado, spinach" },
    lunch: { name: "Grilled Chicken Caesar Salad (No Croutons)", calories: 550, description: "Chicken, romaine lettuce, parmesan, keto-friendly dressing" },
    dinner: { name: "Pan-seared Steak with Cauliflower Rice", calories: 600, description: "Ribeye steak, cauliflower rice, butter" },
    snacks: [
      { name: "Cheese and Nuts", calories: 200, description: "Cheese cubes with almonds" },
      { name: "Keto Fat Bombs", calories: 150, description: "Coconut oil, nut butter, cocoa powder" },
    ],
  };
  
  const meals = userData.dietaryPreferences === "Vegetarian" ? vegMeals :
                userData.dietaryPreferences === "Non-Vegetarian" ? nonVegMeals :
                userData.dietaryPreferences === "Vegan" ? veganMeals : ketoMeals;
  
  // Weekly schedule
  const weeklySchedule = [
    { day: "Monday", duration: isBeginner ? "30-40 minutes" : "45-60 minutes", exercises: exercises.slice(0, 3) },
    { day: "Tuesday", duration: isBeginner ? "20-30 minutes" : "30-45 minutes", exercises: isWeightLoss ? [
      { name: "Cardio (Running/Walking)", sets: 1, reps: isBeginner ? "20 minutes" : "30 minutes", rest: "5 minutes", description: "Moderate intensity cardio" },
      { name: "Stretching", sets: 1, reps: "10 minutes", rest: "None", description: "Full body stretching routine" },
    ] : exercises.slice(3, 5) },
    { day: "Wednesday", duration: isBeginner ? "30-40 minutes" : "45-60 minutes", exercises: exercises.slice(0, 3) },
    { day: "Thursday", duration: isBeginner ? "20-30 minutes" : "30-45 minutes", exercises: isWeightLoss ? [
      { name: "Yoga or Pilates", sets: 1, reps: isBeginner ? "25 minutes" : "35 minutes", rest: "5 minutes", description: "Flexibility and core strength" },
    ] : exercises.slice(2, 4) },
    { day: "Friday", duration: isBeginner ? "30-40 minutes" : "45-60 minutes", exercises: exercises.slice(0, 3) },
    { day: "Saturday", duration: isBeginner ? "30-40 minutes" : "45-60 minutes", exercises: exercises.slice(1, 4) },
    { day: "Sunday", duration: "Rest Day", exercises: [
      { name: "Light Stretching or Walk", sets: 1, reps: "20-30 minutes", rest: "None", description: "Active recovery day" },
    ] },
  ];
  
  return {
    workoutPlan: {
      weeklySchedule,
      tips: [
        "Start each workout with a 5-10 minute warm-up",
        "Stay hydrated - drink water before, during, and after workouts",
        "Listen to your body and rest when needed",
        "Focus on proper form over speed or weight",
        isWeightLoss ? "Combine strength training with cardio for best results" : "Progressive overload is key to building strength",
      ],
    },
    dietPlan: {
      dailyMealPlan: meals,
      tips: [
        `Aim for ${isWeightLoss ? "calorie deficit" : "calorie surplus"} based on your goal`,
        "Eat protein with every meal to support muscle recovery",
        "Stay hydrated - aim for 8-10 glasses of water daily",
        "Plan your meals ahead to stay on track",
        userData.dietaryPreferences === "Keto" ? "Monitor your carb intake to stay in ketosis" : "Include a variety of fruits and vegetables",
      ],
    },
    motivation: [
      `Hey ${userData.name}! You've taken the first step towards your ${userData.fitnessGoal} goal - that's amazing!`,
      "Consistency beats perfection. Small daily actions lead to big results.",
      "Your body can do it. It's your mind you need to convince!",
      `Remember: Progress takes time. Trust the process and stay committed to your ${userData.fitnessLevel} level plan.`,
    ],
    lifestyleTips: [
      "Aim for 7-9 hours of quality sleep each night for optimal recovery",
      userData.stressLevel === "High" ? "Practice stress management: try meditation, deep breathing, or yoga" : "Maintain a balanced lifestyle",
      "Track your progress weekly - take photos and measurements",
      "Find a workout buddy or join a community for accountability",
      "Celebrate small wins along the way - every step counts!",
    ],
  };
}

function generateFallbackPlan(userData: UserData): FitnessPlan {
  return generateDemoPlan(userData);
}

