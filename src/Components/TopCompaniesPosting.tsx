import { useContext, useEffect, useState } from "react";
import {
  getDateFromThirtyDaysPrior,
  getTodaysDate,
  getUniquePostingRowColor,
  updateFilterBodyWithJobTitle,
} from "../Helpers/Utils";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getRankingByCompany } from "../Api/api";
import { IApiRankingResponse } from "../Interfaces/ApiRankingResponse";
import { IBuckets } from "../Interfaces/Buckets";
import { defaultRankingResponse } from "../Helpers/Defaults";
import { AccessContext } from "../Helpers/AccessContext";
import { IApiFilter } from "../Interfaces/ApiFilter";

/**
 * Displays a table of the top unique company postings for a given job title.
 * @param jobTitle The selected job title.
 */
export default function TopCompaniesPosting({
  jobTitle,
}: {
  jobTitle: string;
}) {
  const [metrics, setMetrics] = useState<IApiRankingResponse>(
    defaultRankingResponse
  );
  const [largestTotalPostings, setLargestTotalPostings] = useState<number>(0);
  const [filterBody, setFilterBody] = useState<IApiFilter>({
    filter: {
      when: {
        start: getDateFromThirtyDaysPrior(),
        end: getTodaysDate(),
      },
      title_name: [jobTitle],
    },
    rank: {
      by: "unique_postings",
      extra_metrics: [
        "total_postings",
        "posting_intensity",
        "median_posting_duration",
      ],
    },
  });
  const accessToken = useContext(AccessContext);

  useEffect(() => {
    const updatedFilter = updateFilterBodyWithJobTitle(filterBody, jobTitle);
    setFilterBody(updatedFilter);

    async function getData() {
      const result = await getRankingByCompany(updatedFilter, accessToken);
      let ranking = result?.data?.ranking || defaultRankingResponse;
      const buckets: IBuckets[] =
        result?.data?.ranking?.buckets?.filter(
          (r) => r.name !== "Unclassified"
        ) || [];
      ranking.buckets = buckets;
      setLargestTotalPostings(buckets?.[0]?.unique_postings || 0);
      setMetrics(ranking || defaultRankingResponse);
    }
    getData();
  }, [jobTitle]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Top Companies Posting</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell align="right">Total/Unique</TableCell>
              <TableCell align="right">Posting Intensity</TableCell>
              <TableCell align="right">Median Posting Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics?.buckets.map((row) => (
              <TableRow
                key={row.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  ...getUniquePostingRowColor(row, largestTotalPostings),
                }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  {row.total_postings} / {row.unique_postings}
                </TableCell>
                <TableCell align="right">
                  {Math.floor(row.posting_intensity)} : 1
                </TableCell>
                <TableCell align="right">
                  {row.median_posting_duration}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
