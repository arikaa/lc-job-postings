import { IApiRankingResponse } from "./ApiRankingResponse";
import { IApiTimeseriesResponse } from "./ApiTimeseriesResponse";
import { IApiTotalsResponse } from "./ApiTotalsResponse";

export interface IApiResponse {
  data: {
    totals?: IApiTotalsResponse;
    timeseries?: IApiTimeseriesResponse;
    ranking?: IApiRankingResponse;
  };
}
