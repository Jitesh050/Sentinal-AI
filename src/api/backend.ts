import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export async function crawlWebsite(url: string) {
  const form = new FormData();
  form.append('url', url);
  const res = await axios.post(`${API_BASE}/crawl`, form);
  return res.data;
}

export async function predictVulnerability(file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await axios.post(`${API_BASE}/predict`, form);
  return res.data;
}

export async function getNetworkGraph(endpoints: string[], connections: [string, string][]) {
  const res = await axios.post(`${API_BASE}/network/graph`, { endpoints, connections });
  return res.data;
}

export async function getAttackPaths(start: string, end: string) {
  const form = new FormData();
  form.append('start', start);
  form.append('end', end);
  const res = await axios.post(`${API_BASE}/network/paths`, form);
  return res.data;
}

export async function pushAlert(alertData: any) {
  const res = await axios.post(`${API_BASE}/alert`, alertData);
  return res.data;
}
