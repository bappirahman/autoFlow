"use client";

import { fetchSlackStatusToken } from "@/features/executions/api/execution.api";
import { executionKeys } from "@/lib/query-keys/executions";
import { useRealtimeStatusToken } from "./use-realtime-status-token";

export const useSlackStatusToken = () =>
  useRealtimeStatusToken(
    executionKeys.slackStatusToken(),
    fetchSlackStatusToken,
  );
