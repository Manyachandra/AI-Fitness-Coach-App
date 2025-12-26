import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a motivational fitness coach. Generate a short, inspiring fitness quote (maximum 15 words). Respond with only the quote, no additional text.",
        },
        {
          role: "user",
          content: "Generate a daily fitness motivation quote",
        },
      ],
      temperature: 0.9,
      max_tokens: 50,
    });

    const quote =
      completion.choices[0]?.message?.content?.trim() ||
      "Your body can do it. It's your mind you need to convince!";

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Error generating quote:", error);
    return NextResponse.json(
      {
        quote: "The only bad workout is the one that didn't happen!",
      },
      { status: 200 }
    );
  }
}




