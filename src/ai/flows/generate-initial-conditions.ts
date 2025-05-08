'use server';
/**
 * @fileOverview Generates initial conditions for the three-body problem simulation using AI.
 *
 * - generateInitialConditions - A function that generates initial conditions for the three-body problem simulation.
 * - GenerateInitialConditionsInput - The input type for the generateInitialConditions function.
 * - GenerateInitialConditionsOutput - The return type for the generateInitialConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialConditionsInputSchema = z.object({
  configurationDescription: z
    .string()
    .describe(
      'A description of the desired orbital configuration for the three-body problem, including desired orbital shapes, speeds, and relative positions.'
    ),
});
export type GenerateInitialConditionsInput = z.infer<
  typeof GenerateInitialConditionsInputSchema
>;

const GenerateInitialConditionsOutputSchema = z.object({
  body1: z.object({
    mass: z.number().describe('The mass of the first body.'),
    positionX: z.number().describe('The initial X position of the first body.'),
    positionY: z.number().describe('The initial Y position of the first body.'),
    velocityX: z.number().describe('The initial X velocity of the first body.'),
    velocityY: z.number().describe('The initial Y velocity of the first body.'),
  }),
  body2: z.object({
    mass: z.number().describe('The mass of the second body.'),
    positionX: z.number().describe('The initial X position of the second body.'),
    positionY: z.number().describe('The initial Y position of the second body.'),
    velocityX: z.number().describe('The initial X velocity of the second body.'),
    velocityY: z.number().describe('The initial Y velocity of the second body.'),
  }),
  body3: z.object({
    mass: z.number().describe('The mass of the third body.'),
    positionX: z.number().describe('The initial X position of the third body.'),
    positionY: z.number().describe('The initial Y position of the third body.'),
    velocityX: z.number().describe('The initial X velocity of the third body.'),
    velocityY: z.number().describe('The initial Y velocity of the third body.'),
  }),
});
export type GenerateInitialConditionsOutput = z.infer<
  typeof GenerateInitialConditionsOutputSchema
>;

export async function generateInitialConditions(
  input: GenerateInitialConditionsInput
): Promise<GenerateInitialConditionsOutput> {
  return generateInitialConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialConditionsPrompt',
  input: {schema: GenerateInitialConditionsInputSchema},
  output: {schema: GenerateInitialConditionsOutputSchema},
  prompt: `You are an expert in generating initial conditions for three-body simulations. Your goal is to create scenarios that are visually clear and engaging. This often means ensuring bodies are not excessively close at the start and have ample room to move, making their individual paths and interactions distinct.

  Based on the following description of the desired orbital configuration, generate suitable initial conditions (masses, positions, and velocities) for three bodies.
  Consider a coordinate system where the typical visible area might range from -500 to 500 units on each axis, though some scenarios might naturally extend beyond this. Aim for initial positions and velocities that result in interesting and clearly visible orbits. Ensure adequate separation between bodies (e.g., distances of 50-200 units or more, depending on the scenario and relative masses) to make their individual paths clear from the outset, unless the scenario explicitly calls for very close initial proximity (e.g., for immediate chaotic interaction or a very tight binary).

  Description: {{{configurationDescription}}}

  Provide the output as a JSON object matching the specified schema, with appropriate values for each parameter to achieve the described configuration. Ensure values are numeric and not strings.
  For example, if aiming for a system where Body2 orbits Body1, and Body3 orbits Body1 further out:
  - Body1 (star): mass (e.g., 1000), position (0,0), velocity (0,0)
  - Body2 (inner planet): mass (e.g., 10), position (e.g., 150, 0), velocity (e.g., 0, 2.5) for a counter-clockwise orbit.
  - Body3 (outer planet): mass (e.g., 5), position (e.g., -300, 0), velocity (e.g., 0, -1.8) for a clockwise orbit further out.
  Adjust values to fit the specific scenario description.
  `,
});

const generateInitialConditionsFlow = ai.defineFlow(
  {
    name: 'generateInitialConditionsFlow',
    inputSchema: GenerateInitialConditionsInputSchema,
    outputSchema: GenerateInitialConditionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

