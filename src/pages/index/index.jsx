import { Route } from "@tanstack/react-router"
import rootRoute from "../root"
import { queryOptions } from "@tanstack/react-query";
import { MapsList } from "./MapsList";
import mapApi from "../../api";
import { Columns, Container, Heading, Hero, Image, Media } from "react-bulma-components";

import logo from '../../assets/logowhite.png';

const fetchPortal = async () => {
  const map = await mapApi
    .get(`portals/${window.PORTAL_KEY}/`)

  if (!map) {
    throw new NotFoundError(`Portal not found!`)
  }

  return map
}

const portalOptions = () => queryOptions({
  queryKey: ['portals'],
  queryFn: fetchPortal,
})

export function IndexPage() {
  // const query = useSuspenseQuery(portalOptions())

  return (
    <>
      <Hero color="primary" className="hero">
        <Hero.Body>
          <Container>
            <Media className="">
              <Media.Item align="left">
                <img
                  src={logo}
                  className="logo"
                />
              </Media.Item>
              <Media.Item align="center">
                <Heading weight="bold">Maps</Heading>
                <Heading renderAs="h3" size={3} subtitle>Official NINA Maps</Heading>
              </Media.Item>
            </Media>
          </Container>
        </Hero.Body>
      </Hero>
      <Container>
        <div className="py-4">
          <MapsList />
        </div>
      </Container>
    </>
  );
}

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  component: IndexPage,
  path: '/',
  loader: ({ context: { queryClient }}) => 
    queryClient.ensureQueryData(portalOptions())
})
