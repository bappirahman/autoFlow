"use client";

import { fetchDiscordStatusToken } from "@/features/executions/api/execution.api";
import { executionKeys } from "@/lib/query-keys/executions";
import { useRealtimeStatusToken } from "./use-realtime-status-token";

export const useDiscordStatusToken = () =>
  useRealtimeStatusToken(
    executionKeys.discordStatusToken(),
    fetchDiscordStatusToken,
  );
