"use client";

import { fetchStripeTriggerStatusToken } from "@/features/executions/api/execution.api";
import { executionKeys } from "@/lib/query-keys/executions";
import { useRealtimeStatusToken } from "./use-realtime-status-token";

export const useStripeTriggerStatusToken = () =>
  useRealtimeStatusToken(
    executionKeys.stripeTriggerStatusToken(),
    fetchStripeTriggerStatusToken,
  );
