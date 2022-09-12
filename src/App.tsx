import { AppBar, Autocomplete, LinearProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { AccessContext } from "./Helpers/AccessContext";
import { getAuthToken, getJobTitles } from "./Api/api";
import PostingOverview from "./Components/PostingOverview";
import TopCityPosting from "./Components/TopCityPosting";
import TopCompaniesPosting from "./Components/TopCompaniesPosting";
import UniquePostingTrend from "./Components/UniquePostingTrend";
import { defaultJobTitle } from "./Helpers/Defaults";

/**
 * The view of the application, where all the components are displayed.
 * An input in this view controls the selected job title.
 */
function App() {
  const [jobTitle, setJobTitle] = useState<string>(defaultJobTitle);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    async function getAccessToken() {
      const accessToken = await getAuthToken();
      setAccessToken(accessToken);
    }
    getAccessToken();
  }, [jobTitle]);

  useEffect(() => {
    async function getData() {
      const result = await getJobTitles(accessToken);
      const titles = result?.data?.map((i) => i.name);
      setJobTitles(titles);
    }
    if (!accessToken) return;
    getData();
  }, [accessToken]);

  return (
    <>
      <AppBar component="nav" position="fixed">
        <h5 style={{ marginLeft: 20 }}> Lightcast Job Postings</h5>
      </AppBar>
      {accessToken ? (
        <AccessContext.Provider value={accessToken}>
          <div style={{ marginTop: 80 }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={jobTitles}
              sx={{ width: 300 }}
              onChange={(e, value) => setJobTitle(value || defaultJobTitle)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="outlined-basic"
                  label="Job Titles"
                  variant="outlined"
                />
              )}
            />
            <h1>{`Job Posting Competition: ${jobTitle}`}</h1>
            <PostingOverview jobTitle={jobTitle} />
            <UniquePostingTrend jobTitle={jobTitle} />
            <TopCompaniesPosting jobTitle={jobTitle} />
            <TopCityPosting jobTitle={jobTitle} />
          </div>
        </AccessContext.Provider>
      ) : (
        <div style={{ paddingTop: 100 }}>
          <LinearProgress />
        </div>
      )}
    </>
  );
}

export default App;
