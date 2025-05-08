'use server';

import { generateInitialConditions, type GenerateInitialConditionsInput, type GenerateInitialConditionsOutput } from '@/ai/flows/generate-initial-conditions';

export async function handleGenerateInitialConditions(
  input: GenerateInitialConditionsInput
): Promise<GenerateInitialConditionsOutput> {
  try {
    const result = await generateInitialConditions(input);
    return result;
  } catch (error) {
    console.error("Error generating initial conditions:", error);
    // Consider re-throwing a more specific error or returning a structured error response
    throw new Error("Failed to generate initial conditions from AI.");
  }
}
