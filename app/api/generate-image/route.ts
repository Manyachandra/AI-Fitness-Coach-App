import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Determine if it's an exercise or meal
    const isExercise = query.toLowerCase().includes("squat") ||
      query.toLowerCase().includes("push") ||
      query.toLowerCase().includes("pull") ||
      query.toLowerCase().includes("deadlift") ||
      query.toLowerCase().includes("press") ||
      query.toLowerCase().includes("curl") ||
      query.toLowerCase().includes("row") ||
      query.toLowerCase().includes("lunge") ||
      query.toLowerCase().includes("plank") ||
      query.toLowerCase().includes("crunch") ||
      query.toLowerCase().includes("exercise") ||
      query.toLowerCase().includes("workout");

    const prompt = isExercise
      ? `A professional, realistic photo of someone performing the exercise: ${query}. The image should show proper form and technique, in a gym or fitness setting. High quality, well-lit, motivational fitness photography.`
      : `A beautiful, appetizing, professional food photography image of: ${query}. The image should be high quality, well-lit, with appealing presentation. Food styling, restaurant quality photography.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

