import React from "react";
import "./App.css";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { useQuery, ApolloProvider } from "@apollo/react-hooks";
import gql from "graphql-tag";

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: "/.netlify/functions/graphql"
    })
  ]),
  cache: new InMemoryCache()
});

const QUERY = gql`
  query Authors {
    allAuthors {
      id
      name
      married
    }
  }
`;

interface Author {
  id: number;
  name: string;
  married: boolean;
}

const Authors = () => {
  const { data, loading, error } = useQuery(QUERY);

  if (loading) return <p>loading data ...</p>;
  if (error) return <h2>Error: ${error}</h2>;

  return (
    <>
      <h1>Authors</h1>
      <ul>
        {data.allAuthors.map((author: Author, index: number) => (
          <li key={index}>
            <span>{author.id}</span>
            <span>{author.name}</span>
            <span>{author.married}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Authors />
    </ApolloProvider>
  );
};

export default App;
