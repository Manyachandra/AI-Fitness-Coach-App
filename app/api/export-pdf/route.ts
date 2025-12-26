import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import type { FitnessPlan, UserData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { plan, userData }: { plan: FitnessPlan; userData: UserData } =
      await request.json();

    // Create a temporary HTML element for PDF generation
    const htmlContent = generatePDFHTML(plan, userData);

    // For server-side, we'll create a simple PDF using jsPDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add a new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Title
    doc.setFontSize(24);
    doc.text("Your Personalized Fitness Plan", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 15;

    // User Info
    doc.setFontSize(12);
    doc.text(`Name: ${userData.name}`, margin, yPosition);
    yPosition += 7;
    doc.text(
      `Age: ${userData.age} | Gender: ${userData.gender} | Height: ${userData.height}cm | Weight: ${userData.weight}kg`,
      margin,
      yPosition
    );
    yPosition += 7;
    doc.text(
      `Goal: ${userData.fitnessGoal} | Level: ${userData.fitnessLevel} | Location: ${userData.workoutLocation}`,
      margin,
      yPosition
    );
    yPosition += 15;

    // Workout Plan
    doc.setFontSize(18);
    doc.text("Workout Plan", margin, yPosition);
    yPosition += 10;

    plan.workoutPlan.weeklySchedule.forEach((day) => {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.text(`${day.day} - ${day.duration}`, margin, yPosition);
      yPosition += 8;

      day.exercises.forEach((exercise) => {
        checkPageBreak(10);
        doc.setFontSize(11);
        doc.text(
          `• ${exercise.name}: ${exercise.sets} sets × ${exercise.reps} reps (Rest: ${exercise.rest})`,
          margin + 5,
          yPosition
        );
        yPosition += 6;
      });
      yPosition += 5;
    });

    // Diet Plan
    checkPageBreak(50);
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(18);
    doc.text("Diet Plan", margin, yPosition);
    yPosition += 10;

    const meals = plan.dietPlan.dailyMealPlan;
    doc.setFontSize(12);
    doc.text(`Breakfast: ${meals.breakfast.name} (${meals.breakfast.calories} cal)`, margin, yPosition);
    yPosition += 7;
    doc.text(`Lunch: ${meals.lunch.name} (${meals.lunch.calories} cal)`, margin, yPosition);
    yPosition += 7;
    doc.text(`Dinner: ${meals.dinner.name} (${meals.dinner.calories} cal)`, margin, yPosition);
    yPosition += 7;
    if (meals.snacks.length > 0) {
      doc.text("Snacks:", margin, yPosition);
      yPosition += 7;
      meals.snacks.forEach((snack) => {
        doc.text(`  • ${snack.name} (${snack.calories} cal)`, margin + 5, yPosition);
        yPosition += 6;
      });
    }

    // Tips
    checkPageBreak(30);
    yPosition += 10;
    doc.setFontSize(14);
    doc.text("Tips & Motivation", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    plan.motivation.forEach((tip) => {
      checkPageBreak(7);
      doc.text(`• ${tip}`, margin, yPosition);
      yPosition += 6;
    });

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="fitness-plan-${userData.name}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

function generatePDFHTML(plan: FitnessPlan, userData: UserData): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          h2 { color: #666; margin-top: 20px; }
          .exercise { margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>Your Personalized Fitness Plan</h1>
        <h2>User Information</h2>
        <p>Name: ${userData.name}</p>
        <p>Age: ${userData.age} | Gender: ${userData.gender}</p>
        <p>Height: ${userData.height}cm | Weight: ${userData.weight}kg</p>
        <p>Goal: ${userData.fitnessGoal} | Level: ${userData.fitnessLevel}</p>
        <h2>Workout Plan</h2>
        ${plan.workoutPlan.weeklySchedule
          .map(
            (day) => `
          <h3>${day.day} - ${day.duration}</h3>
          ${day.exercises
            .map(
              (ex) => `
            <div class="exercise">
              <strong>${ex.name}</strong>: ${ex.sets} sets × ${ex.reps} reps (Rest: ${ex.rest})
            </div>
          `
            )
            .join("")}
        `
          )
          .join("")}
        <h2>Diet Plan</h2>
        <p><strong>Breakfast:</strong> ${plan.dietPlan.dailyMealPlan.breakfast.name} (${plan.dietPlan.dailyMealPlan.breakfast.calories} cal)</p>
        <p><strong>Lunch:</strong> ${plan.dietPlan.dailyMealPlan.lunch.name} (${plan.dietPlan.dailyMealPlan.lunch.calories} cal)</p>
        <p><strong>Dinner:</strong> ${plan.dietPlan.dailyMealPlan.dinner.name} (${plan.dietPlan.dailyMealPlan.dinner.calories} cal)</p>
        <h2>Motivation</h2>
        ${plan.motivation.map((m) => `<p>${m}</p>`).join("")}
      </body>
    </html>
  `;
}

