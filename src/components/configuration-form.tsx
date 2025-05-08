'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { handleGenerateInitialConditions } from '@/app/actions';
import type { GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { DEFAULT_CONFIGURATION_DESCRIPTION } from '@/types/celestial-types';
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
