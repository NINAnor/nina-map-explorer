import { Route } from "@tanstack/react-router";
import rootRoute from "../root";
import { queryOptions } from "@tanstack/react-query";
import { MapsList } from "./MapsList";
import mapApi from "../../api";
import {
  Container,
  Heading,
  Hero,
  Media,
  Message,
} from "react-bulma-components";

import logo from "../../assets/logowhite.png";
import { NotFoundError } from "../../lib/utils";

const fetchPortal = async () => {
  const map = await mapApi.get(`portals/${window.PORTAL_KEY}/`);

  if (!map) {
    throw new NotFoundError(`Portal not found!`);
  }

  return map;
};

const portalOptions = () =>
  queryOptions({
    queryKey: ["portals"],
    queryFn: fetchPortal,
  });

function IndexHero() {
  return (
    <Hero color="primary" className="hero">
      <Hero.Body>
        <Container>
          <Media className="">
            <Media.Item align="left">
              <img src={logo} className="logo" />
            </Media.Item>
            <Media.Item align="center">
              <Heading weight="bold">Maps</Heading>
              <Heading renderAs="h3" size={3} subtitle>
                Official NINA Maps
              </Heading>
            </Media.Item>
          </Media>
        </Container>
      </Hero.Body>
    </Hero>
  );
}

function IndexErrorComponent({ error }) {
  let message = error.message;
  if (error instanceof NotFoundError) {
    message = "Unable to load maps";
  } else if (error.message === "Network Error") {
    message =
      "Unable to load maps, there was a network error while connecting to the maps server.";
  }

  return (
    <>
      <IndexHero />
      <Container>
        <div className="py-4">
          <Message color="danger">
            <Message.Header>There was en error</Message.Header>
            <Message.Body>{message}</Message.Body>
          </Message>
        </div>
      </Container>
    </>
  );
}

export function IndexPage() {
  return (
    <>
      <IndexHero />
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
  path: "/",
  errorComponent: IndexErrorComponent,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(portalOptions()),
});
