import { IFilter } from "./Filter";
import { IRank } from "./Rank";

export interface IApiFilter {
  filter: IFilter;
  metrics?: string[];
  rank?: IRank;
}
