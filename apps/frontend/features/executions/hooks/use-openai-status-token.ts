"use client";

import { fetchOpenAIStatusToken } from "@/features/executions/api/execution.api";
import { executionKeys } from "@/lib/query-keys/executions";
import { useRealtimeStatusToken } from "./use-realtime-status-token";

export const useOpenAIStatusToken = () =>
  useRealtimeStatusToken(
    executionKeys.openaiStatusToken(),
    fetchOpenAIStatusToken,
  );
