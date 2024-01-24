import { Link, Route } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query";
import { viewerRoute } from "../viewer";
import mapApi from "../../api";
import { Card, Columns } from "react-bulma-components";

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
    <Columns multiline>
      {data.data.map(d => (
        <Columns.Column key={d.slug} mobile={{ size: 12 }} tablet={{ size: 'half'}} desktop={{ size: 4 }} widescreen={{ size: 3 }}>
            <Card px={2}>
              <Card.Header>
                <Card.Header.Title>{d.title}</Card.Header.Title>
                <Card.Header.Icon>{d.visibility === 'public' ? <i className="fas fa-globe"></i> : <i className="fas fa-lock"></i>}</Card.Header.Icon>
              </Card.Header>
              {d.short_description && (
                <Card.Content>
                  <p>{d.short_description}</p>
                </Card.Content>
              )}
              {d.cover && (
                <Card.Image
                  size="4by3"
                  src={d.cover}
                />
              )}
              <Card.Footer>
                <Card.Footer.Item>
                  <Link to={viewerRoute.to} params={{ mapSlug: d.slug }} target="_blank" rel="noopener noreferrer">Explore</Link>
                </Card.Footer.Item>
              </Card.Footer>
            </Card>             
        </Columns.Column>
      ))}
    </Columns>
  );
} 
