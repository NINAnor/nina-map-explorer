import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { viewerRoute } from "../viewer";
import mapApi from "../../api";
import { Card, Columns } from "react-bulma-components";

export function MapsList() {
  const { isPending, data } = useQuery({
    queryKey: ["portal-layers"],
    queryFn: () => mapApi(`portal-maps/?portal__uuid=${window.PORTAL_KEY}`),
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  console.log(data);

  return (
    <Columns multiline>
      {data.data.results.map((d) => (
        <Columns.Column
          key={d.slug}
          mobile={{ size: 12 }}
          tablet={{ size: "half" }}
          desktop={{ size: 4 }}
          widescreen={{ size: 3 }}
        >
          <Card px={2}>
            <Card.Header>
              <Card.Header.Title>{d.map.title}</Card.Header.Title>
              <Card.Header.Icon>
                {d.map.visibility === "public" ? (
                  <i className="fas fa-globe"></i>
                ) : (
                  <i className="fas fa-lock"></i>
                )}
              </Card.Header.Icon>
            </Card.Header>
            {d.map.subtitle && (
              <Card.Content>
                <p>{d.map.subtitle}</p>
              </Card.Content>
            )}
            {/* {d.map.logo && <Card.Image size="4by3" src={d.map.logo} />} */}
            <Card.Footer>
              <Card.Footer.Item>
                <Link
                  to={viewerRoute.to}
                  params={{ mapSlug: d.map.slug }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  EXPLORE
                </Link>
              </Card.Footer.Item>
            </Card.Footer>
          </Card>
        </Columns.Column>
      ))}
    </Columns>
  );
}
