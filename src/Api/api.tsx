import { IApiFilter } from "../Interfaces/ApiFilter";
import { IApiResponse } from "../Interfaces/ApiResponse";
import { IApiTaxonomyResponse } from "../Interfaces/ApiTaxonomyResponse";

export async function getAuthToken(): Promise<string> {
  const body = new URLSearchParams();
  body.append("client_id", "arika.pischel");
  body.append("client_secret", "ktYLA1FE");
  body.append("grant_type", "client_credentials");
  body.append("scope", "postings:us");
  console.log("urlsearch param: ", body.toString());

  const formData = new FormData();
  formData.append("client_id", "arika.pischel");
  formData.append("client_secret", "ktYLA1FE");
  formData.append("grant_type", "client_credentials");
  formData.append("scope", "postings:us");
  formData.forEach((key, value) => {
    console.log(key, value);
  });

  return await fetch("https://auth.emsicloud.com/connect/token", {
    method: "POST",
    headers: {
      ContentType: "application/x-www-form-urlencoded",
    },
    body,
  })
    .then(async (response) => (await response.json())?.access_token)
    .catch((err) => console.error(err));
}

export async function getTotals(
  body: IApiFilter,
  accessToken: string
): Promise<IApiResponse> {
  return await fetch("https://emsiservices.com/jpa/totals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

export async function getMostRecentJobPostingActivity(
  body: IApiFilter,
  accessToken: string
): Promise<IApiResponse> {
  return await fetch("https://emsiservices.com/jpa/timeseries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

export async function getRankingByCompany(
  body: IApiFilter,
  accessToken: string
): Promise<IApiResponse> {
  return await fetch("https://emsiservices.com/jpa/rankings/company_name", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

export async function getRankingByCity(
  body: IApiFilter,
  accessToken: string
): Promise<IApiResponse> {
  return await fetch("https://emsiservices.com/jpa/rankings/city_name", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

export async function getJobTitles(
  accessToken: string
): Promise<IApiTaxonomyResponse> {
  return await fetch("https://emsiservices.com/jpa/taxonomies/title", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
}
