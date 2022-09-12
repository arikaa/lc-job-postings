import { useContext, useEffect, useState } from "react";
import { AccessContext } from "../Helpers/AccessContext";
import { getTotals } from "../Api/api";
import { IApiFilter } from "../Interfaces/ApiFilter";
import { IApiTotalsResponse } from "../Interfaces/ApiTotalsResponse";
import {
  getCurrentYearAndMonth,
  getCurrentYearAndPreviousMonth,
  updateFilterBodyWithJobTitle,
} from "../Helpers/Utils";
import { defaultTotal } from "../Helpers/Defaults";

/**
 * Displays an overview of the unique postings, posting intensity and median
 * duration for a selected job title, with an explanation of the data.
 * @param jobTitle The selected job title.
 */
export default function PostingOverview({ jobTitle }: { jobTitle: string }) {
  const [metrics, setMetrics] = useState<IApiTotalsResponse>(defaultTotal);
  const [filterBody, setFilterBody] = useState<IApiFilter>({
    filter: {
      when: {
        start: getCurrentYearAndPreviousMonth(),
        end: getCurrentYearAndMonth(),
      },
      title_name: [jobTitle],
    },
    metrics: [
      "posting_intensity",
      "median_posting_duration",
      "unique_postings",
    ],
  });

  const accessToken = useContext(AccessContext);

  useEffect(() => {
    const updatedFilter = updateFilterBodyWithJobTitle(filterBody, jobTitle);
    setFilterBody(updatedFilter);
    async function getData() {
      const result = await getTotals(updatedFilter, accessToken);
      let metrics = result?.data?.totals || defaultTotal;
      metrics.posting_intensity = Math.floor(metrics.posting_intensity);
      setMetrics(metrics);
    }
    getData();
  }, [jobTitle]);

  return (
    <div>
      <h4>Job Postings Overview</h4>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px lightgray solid",
          borderBottom: "1px lightgray solid",
        }}
      >
        <div
          style={{
            borderRight: "1px lightgray solid",
            textAlign: "center",
            flex: "1 1 auto",
          }}
        >
          <h1>{metrics.unique_postings}</h1>
          <h4>Unique Postings</h4>
        </div>
        <div
          style={{
            borderRight: "1px lightgray solid",
            flex: "1 1 auto",
            textAlign: "center",
          }}
        >
          <h1>{`${metrics.posting_intensity} : 1`}</h1>
          <h4>Posting Intensity</h4>
        </div>
        <div style={{ flex: "1 1 auto", textAlign: "center" }}>
          <h1>{metrics.median_posting_duration}</h1>
          <h4>Median Posting Duration</h4>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        {`These postings are from both the current and previous month. There were `}
        <span style={{ fontWeight: "bold" }}>{metrics.total_postings}</span>
        {` total job postings for your selection, of which `}
        <span style={{ fontWeight: "bold" }}>{metrics.unique_postings}</span>
        {` were unique. These numbers give us a Posting Intensity of `}
        <span
          style={{ fontWeight: "bold" }}
        >{`${metrics.posting_intensity}-to-1`}</span>
        {`, meaning that for every ${metrics.posting_intensity} postings, there is 1 unique job posting.`}
      </div>
    </div>
  );
}
