import { useMemo } from "react";

// Define model types
export type Model = {
  name: string;
  id: string;
  provider: string;
  img: string;
};

export type Company = {
  name: string;
  img: string;
  models: Model[];
};

// Group models by company
export const modelsByCompany: Company[] = [
  {
    name: "OpenAI",
    img: "/openai.svg",
    models: [
      // GPT-4.1 Family
      {
        name: "4.1",
        id: "gpt-4.1",
        provider: "openai",
        img: "/openai.svg",
      },
      {
        name: "4.1 Mini",
        id: "gpt-4.1-mini",
        provider: "openai",
        img: "/openai.svg",
      },
      {
        name: "4.1 Nano",
        id: "gpt-4.1-nano",
        provider: "openai",
        img: "/openai.svg",
      },
      // GPT-4.0 Family
      {
        name: "4o Mini",
        id: "gpt-4o-mini",
        provider: "openai",
        img: "/openai.svg",
      },
      {
        name: "4o",
        id: "gpt-4o",
        provider: "openai",
        img: "/openai.svg",
      },
      // O-Series Reasoning Models
      {
        name: "o3 Mini",
        id: "o3-mini",
        provider: "openai",
        img: "/openai.svg",
      },
      {
        name: "o3",
        id: "o3",
        provider: "openai",
        img: "/openai.svg",
      },
      {
        name: "o4 Mini",
        id: "o4-mini",
        provider: "openai",
        img: "/openai.svg",
      },
    ],
  },
  {
    name: "Google",
    img: "/gemini.svg",
    models: [
      {
        name: "Gemini 2.5 Pro",
        id: "google/gemini-2.5-pro-preview-03-25",
        provider: "openrouter",
        img: "/gemini.svg",
      },
      {
        name: "Gemini 2.0 Flash",
        id: "google/gemini-2.0-flash-001",
        provider: "openrouter",
        img: "/gemini.svg",
      },
      {
        name: "Gemini 2.0 Flash Lite",
        id: "google/gemini-2.0-flash-lite-001",
        provider: "openrouter",
        img: "/gemini.svg",
      },
      {
        name: "Gemini 2.0 Flash",
        id: "gemini-2.0-flash",
        provider: "gemini",
        img: "/gemini.svg",
      },
    ],
  },
  {
    name: "Anthropic",
    img: "/anthropic.svg",
    models: [
      {
        name: "Claude 4 Sonnet",
        id: "anthropic/claude-sonnet-4",
        provider: "openrouter",
        img: "/anthropic.svg",
      },
      {
        name: "Claude 3.7",
        id: "anthropic/claude-3.7-sonnet",
        provider: "openrouter",
        img: "/anthropic.svg",
      },
      {
        name: "Claude 3.5",
        id: "anthropic/claude-3.5-sonnet",
        provider: "openrouter",
        img: "/anthropic.svg",
      },
    ],
  },
  {
    name: "X.AI",
    img: "/x-ai.svg",
    models: [
      {
        name: "Grok 3",
        id: "x-ai/grok-3-beta",
        provider: "openrouter",
        img: "/x-ai.svg",
      },
      {
        name: "Grok 3 Mini",
        id: "x-ai/grok-3-mini-beta",
        provider: "openrouter",
        img: "/x-ai.svg",
      },
    ],
  },
  {
    name: "Qwen",
    img: "/qwen.png",
    models: [
      {
        name: "Qwen 3 Mini",
        id: "qwen/qwen3-235b-a22b",
        provider: "openrouter",
        img: "/qwen.png",
      },
    ],
  },
  {
    name: "DeepSeek",
    img: "/deepseek.svg",
    models: [
      {
        name: "DeepSeek V3",
        id: "deepseek/deepseek-chat-v3-0324",
        provider: "openrouter",
        img: "/deepseek.svg",
      },
      {
        name: "DeepSeek R1 Distil Llama",
        id: "deepseek/deepseek-r1-distill-llama-70b",
        provider: "openrouter",
        img: "/deepseek.svg",
      },
    ],
  },
  {
    name: "Perplexity",
    img: "/perplexity.png",
    models: [
      {
        name: "Sonar Reasoning Pro",
        id: "perplexity/sonar-reasoning-pro",
        provider: "openrouter",
        img: "/perplexity.png",
      },
      {
        name: "Sonar Deep Research",
        id: "perplexity/sonar-deep-research",
        provider: "openrouter",
        img: "/perplexity.png",
      },
    ],
  },
  {
    name: "Meta",
    img: "/meta.png",
    models: [
      {
        name: "Llama 3 8B",
        id: "llama-3.1-8b-instant",
        provider: "groq",
        img: "/meta.png",
      },
      {
        name: "Llama 4 Scout",
        id: "meta-llama/llama-4-scout-17b-16e-instruct",
        provider: "groq",
        img: "/meta.png",
      },
    ],
  },
];

// Create a flattened list of all models for backwards compatibility
export const models: Record<string, Model> = {};
modelsByCompany.forEach((company) => {
  company.models.forEach((model) => {
    const displayName = `${company.name} ${model.name}`;
    models[displayName] = model;
  });
});

// Hook to get all models - memoized for performance
export function useModels() {
  return useMemo(() => {
    return {
      byCompany: modelsByCompany,
      all: models,
      // Helper function to get a flat list of all models
      getAllModels: () => Object.values(models),
    };
  }, []);
}
