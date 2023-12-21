import useSWR from "swr";

const fetcher = (url) => fetch(url, {
  credentials: 'include'
}).then(res => res.json());

export default function useMetadata() {
  return useSWR(window.MAPS_API_URL.replace('{MAP_ID}', location.hash.slice(1)), fetcher);
}
