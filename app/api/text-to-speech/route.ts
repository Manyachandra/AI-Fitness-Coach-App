import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { text, voice } = await request.json();

    if (!process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY === "your_elevenlabs_api_key_here") {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured. Using browser text-to-speech instead." },
        { status: 500 }
      );
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice || "21m00Tcm4TlvDq8ikWAM"}`,
      {
        text: text.substring(0, 5000), // Limit text length
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": response.data.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}

