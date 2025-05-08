'use client';

import React, { useState, useTransition, useMemo } from 'react';
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
import { useLanguage } from '@/contexts/language-context';
import { getTranslatedText, getTranslatedScenarioName } from '@/lib/translations';

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
  const { language } = useLanguage();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      configurationDescription: DEFAULT_CONFIGURATION_DESCRIPTION,
    },
  });

  const translatedScenarios = useMemo(() => PREDEFINED_SCENARIOS.map(scenario => ({
    ...scenario,
    translatedName: getTranslatedScenarioName(scenario.name, language),
  })), [language]);

  const [selectedScenarioName, setSelectedScenarioName] = useState<string>(() => {
    const initialDescription = form.getValues("configurationDescription");
    const initialScenario = PREDEFINED_SCENARIOS.find(s => s.description === initialDescription);
    return initialScenario ? initialScenario.name : PREDEFINED_SCENARIOS[0].name; 
  });


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoadingAI(true);
    startTransition(async () => {
      try {
        const conditions = await handleGenerateInitialConditions(values);
        onConditionsGenerated(conditions);
        toast({
          title: getTranslatedText('success', language),
          description: getTranslatedText('newConditionsGenerated', language),
        });
      } catch (error) {
        console.error(error);
        toast({
          title: getTranslatedText('error', language),
          description: getTranslatedText('failedToGenerateConditions', language),
          variant: "destructive",
        });
      } finally {
        setIsLoadingAI(false);
      }
    });
  };

  const handleScenarioChange = (originalScenarioName: string) => {
    const selectedScenario = PREDEFINED_SCENARIOS.find(s => s.name === originalScenarioName);
    if (selectedScenario) {
      form.setValue('configurationDescription', selectedScenario.description, { shouldValidate: true });
      setSelectedScenarioName(selectedScenario.name);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>{getTranslatedText('predefinedScenario', language)}</FormLabel>
          <Select 
            onValueChange={handleScenarioChange} 
            value={selectedScenarioName}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={getTranslatedText('selectScenario', language)} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {translatedScenarios.map((scenario) => (
                <SelectItem key={scenario.name} value={scenario.name}>
                  {scenario.translatedName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription className="text-xs">
            {getTranslatedText('scenarioDescriptionHint', language)}
          </FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="configurationDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getTranslatedText('orbitalConfigurationDescription', language)}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={getTranslatedText('orbitalConfigurationDescriptionPlaceholder', language)}
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
          {isPending ? getTranslatedText('loading', language) : getTranslatedText('generateInitialConditions', language)}
        </Button>
      </form>
    </Form>
  );
}
