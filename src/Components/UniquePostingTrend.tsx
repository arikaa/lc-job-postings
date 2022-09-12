import { useContext, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AccessContext } from "../Helpers/AccessContext";
import { getMostRecentJobPostingActivity } from "../Api/api";
import { IApiFilter } from "../Interfaces/ApiFilter";
import { IApiTimeseriesResponse } from "../Interfaces/ApiTimeseriesResponse";
import { IGraphData } from "../Interfaces/GraphData";
import {
  getDateFromThirtyDaysPrior,
  getDateFromThirtyDaysPriorOfLastYear,
  getTodaysDate,
  getTodaysDateOfLastYear,
  updateFilterBodyWithJobTitle,
} from "../Helpers/Utils";

/**
 * Displays a line graph of the last thirty days for the current year
 * and for the past year as a comparison.
 * @param jobTitle The selected job title.
 */
export default function UniquePostingTrend({ jobTitle }: { jobTitle: string }) {
  const [data, setData] = useState<IGraphData[]>([]);
  const [filterBody, setFilterBody] = useState<IApiFilter>({
    filter: {
      when: {
        start: getDateFromThirtyDaysPrior(),
        end: getTodaysDate(),
      },
      title_name: [jobTitle],
    },
    metrics: ["unique_postings"],
  });
  const accessToken = useContext(AccessContext);

  useEffect(() => {
    const updatedFilter = updateFilterBodyWithJobTitle(filterBody, jobTitle);
    setFilterBody(updatedFilter);
    async function getData() {
      const currentYear = await getMostRecentJobPostingActivity(
        updatedFilter,
        accessToken
      );
      const lastYear = await getMostRecentJobPostingActivity(
        {
          ...updatedFilter,
          filter: {
            ...updatedFilter.filter,
            when: {
              start: getDateFromThirtyDaysPriorOfLastYear(),
              end: getTodaysDateOfLastYear(),
            },
          },
        },
        accessToken
      );
      if (!currentYear?.data?.timeseries || !lastYear?.data?.timeseries) {
        return;
      }
      transformData(currentYear?.data?.timeseries, lastYear?.data?.timeseries);
    }
    getData();
  }, [jobTitle]);

  function transformData(
    currentYear: IApiTimeseriesResponse,
    previousYear: IApiTimeseriesResponse
  ) {
    let graphData: IGraphData[] = [];
    for (let i = 0; i < currentYear.day.length; i++) {
      graphData = [
        ...graphData,
        {
          name: currentYear.day[i].slice(5),
          currentYear: parseInt(currentYear.unique_postings?.[i] || "0"),
          previousYear: parseInt(previousYear.unique_postings?.[i] || "0"),
        },
      ];
    }
    setData(graphData);
  }

  return (
    <div style={{ height: 500 }}>
      <h3>Unique Posting Trends</h3>
      <div style={{ marginBottom: 20, marginTop: 20 }}>
        This view displays the most recent 30 days of job postings activity to
        show near-term trends.
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          width={500}
          height={500}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="currentYear"
            name="Current Year Trends"
            stroke="#8884d8"
          />
          <Line
            type="monotone"
            dataKey="previousYear"
            name="Previous Year Trends"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
