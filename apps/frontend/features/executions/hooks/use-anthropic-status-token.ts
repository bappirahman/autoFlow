"use client";

import { fetchAnthropicStatusToken } from "@/features/executions/api/execution.api";
import { executionKeys } from "@/lib/query-keys/executions";
import { useRealtimeStatusToken } from "./use-realtime-status-token";

export const useAnthropicStatusToken = () =>
  useRealtimeStatusToken(
    executionKeys.anthropicStatusToken(),
    fetchAnthropicStatusToken,
  );
