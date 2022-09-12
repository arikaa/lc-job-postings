import { IBuckets } from "./Buckets";

export interface IApiRankingResponse {
  buckets: IBuckets[];
  totals: {
    unique_postings: number;
  };
}
