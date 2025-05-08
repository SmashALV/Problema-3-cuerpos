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
  prompt: `You are an expert in generating initial conditions for three-body simulations.

  Based on the following description of the desired orbital configuration, generate suitable initial conditions (masses, positions, and velocities) for three bodies.

  Description: {{{configurationDescription}}}

  Provide the output as a JSON object matching the specified schema, with appropriate values for each parameter to achieve the described configuration.
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
