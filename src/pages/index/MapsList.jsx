import { Link, Route } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query";
import { viewerRoute } from "../viewer";
import mapApi from "../../api";

export function MapsList() {

  const { isPending, error, data } = useQuery({
    queryKey: ['portal-layers'],
    queryFn: () =>
      mapApi(`portals/${window.PORTAL_KEY}/maps/`),
  })

  if (isPending) {
    return <p>Loading...</p>
  }

  return (
    <ul>
      {data.data.map(d => (
        <li key={d.slug}>
          <Link to={viewerRoute.to} params={{ mapSlug: d.slug }}>
            {d.title} {d.visibility === 'public' ? <i className="fas fa-globe"></i> : <i className="fas fa-lock"></i>}
          </Link>
        </li>
      ))}
    </ul>
  );
} 
