import { useQueryStates } from "nuqs";
import { executionHistoryParams } from "../params";

export const useExecutionHistoryParams = () => {
  return useQueryStates(executionHistoryParams);
};
