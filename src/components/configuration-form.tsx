'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { handleGenerateInitialConditions } from '@/app/actions';
import type { GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { DEFAULT_CONFIGURATION_DESCRIPTION, PREDEFINED_SCENARIOS } from '@/types/celestial-types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  configurationDescription: z.string().min(10, 'Description must be at least 10 characters.'),
});

type ConfigurationFormProps = {
  onConditionsGenerated: (conditions: GenerateInitialConditionsOutput) => void;
  setIsLoadingAI: (isLoading: boolean) => void;
};

export function ConfigurationForm({ onConditionsGenerated, setIsLoadingAI }: ConfigurationFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      configurationDescription: DEFAULT_CONFIGURATION_DESCRIPTION,
    },
  });

  // Initialize selectedScenarioName based on the default description
  const [selectedScenarioName, setSelectedScenarioName] = useState<string>(() => {
    const initialDescription = form.getValues("configurationDescription");
    const initialScenario = PREDEFINED_SCENARIOS.find(s => s.description === initialDescription);
    return initialScenario ? initialScenario.name : PREDEFINED_SCENARIOS[0].name; // Fallback if no exact match
  });


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoadingAI(true);
    startTransition(async () => {
      try {
        const conditions = await handleGenerateInitialConditions(values);
        onConditionsGenerated(conditions);
        toast({
          title: "Success",
          description: "New initial conditions generated!",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to generate conditions. Please try a different description or try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingAI(false);
      }
    });
  };

  const handleScenarioChange = (scenarioName: string) => {
    const selectedScenario = PREDEFINED_SCENARIOS.find(s => s.name === scenarioName);
    if (selectedScenario) {
      form.setValue('configurationDescription', selectedScenario.description, { shouldValidate: true });
      setSelectedScenarioName(selectedScenario.name);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Pre-defined Scenario</FormLabel>
          <Select onValueChange={handleScenarioChange} value={selectedScenarioName}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a scenario" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {PREDEFINED_SCENARIOS.map((scenario) => (
                <SelectItem key={scenario.name} value={scenario.name}>
                  {scenario.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription className="text-xs">
            Selecting a scenario will populate the description below. You can still edit it.
          </FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="configurationDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orbital Configuration Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the desired orbital configuration (e.g., 'A stable figure-eight orbit for three equal-mass bodies.')"
                  {...field}
                  rows={5}
                  className="bg-muted/50 focus:bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Initial Conditions
        </Button>
      </form>
    </Form>
  );
}
