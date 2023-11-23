import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useMetadata() {
  return useSWR(`/datasets/${location.hash.slice(1)}/metadata.json`, fetcher);
}
