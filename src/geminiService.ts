import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WorkoutPlan } from "./types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export async function generateWorkout(profile: UserProfile): Promise<WorkoutPlan> {
  const prompt = `Generate a personalized full-body no-equipment workout plan for a user with the following profile:
    Age: ${profile.age}
    Weight: ${profile.weight}kg
    Height: ${profile.height}cm
    ${profile.cycleDay ? `Day of menstrual cycle: ${profile.cycleDay}` : ''}
    Energy level: ${profile.energyLevel}
    Available time: ${profile.availableTime} minutes

    The workout should be safe, effective for someone with a sedentary lifestyle, and require NO equipment.
    Include estimated calories burned for each exercise and the total.
    Provide specific advice based on their energy level and cycle day (if provided).
    The response must be in Polish.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalCalories: { type: Type.NUMBER },
          duration: { type: Type.NUMBER },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      repsOrDuration: { type: Type.STRING },
                      caloriesEstimate: { type: Type.NUMBER },
                    },
                    required: ["name", "description", "repsOrDuration", "caloriesEstimate"],
                  },
                },
              },
              required: ["title", "exercises"],
            },
          },
          advice: { type: Type.STRING },
        },
        required: ["totalCalories", "duration", "sections", "advice"],
      },
    },
  });

  return JSON.parse(response.text);
}
