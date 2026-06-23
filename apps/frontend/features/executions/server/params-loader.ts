import { createLoader } from "nuqs/server";
import { executionHistoryParams } from "../params";

export const executionHistoryParamsLoader = createLoader(
  executionHistoryParams,
);
