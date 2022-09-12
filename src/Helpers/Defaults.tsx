import { IApiRankingResponse } from "../Interfaces/ApiRankingResponse";
import { IApiTimeseriesResponse } from "../Interfaces/ApiTimeseriesResponse";
import { IApiTotalsResponse } from "../Interfaces/ApiTotalsResponse";

export const defaultRankingResponse: IApiRankingResponse = {
  buckets: [
    {
      median_posting_duration: 0,
      name: "",
      posting_intensity: 0,
      total_postings: 0,
      unique_postings: 0,
    },
  ],
  totals: {
    unique_postings: 0,
  },
};

export const defaultTimeseries: IApiTimeseriesResponse = {
  totals: [] as string[],
  day: [] as string[],
  unique_postings: [] as string[],
};

export const defaultJobTitle = "Software Developers";

export const defaultTotal: IApiTotalsResponse = {
  posting_intensity: 0,
  unique_postings: 0,
  median_posting_duration: 0,
  total_postings: 0,
};
