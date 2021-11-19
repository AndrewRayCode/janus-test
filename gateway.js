const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");

const token = `
`.trim();

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    request.http.headers.set('Authorization', token);
  }
}

const gateway = new ApolloGateway({
  // This entire `serviceList` is optional when running in managed federation
  // mode, using Apollo Graph Manager as the source of truth.  In production,
  // using a single source of truth to compose a schema is recommended and
  // prevents composition failures at runtime using schema validation using
  // real usage-based metrics.
  serviceList: [
    { name: "old", url: "http://localhost:4001/graphql" },
    // { name: "new", url: "http://localhost:4004/graphql" }
    { name: "careapi", url: "http://localhost:50059/graphql" },
  ],

  introspectionHeaders: {
    Authorization: token
  },

  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },

  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: false,
});

(async () => {
  const server = new ApolloServer({
    gateway,

    context: ({ req }) => console.log(req.headers) || ({
      req,
      headers: {
        ...req.headers,
      },
      customHeaders: {
        headers: {
          ...req.headers,
        },
      },
    }),

    // Apollo Graph Manager (previously known as Apollo Engine)
    // When enabled and an `ENGINE_API_KEY` is set in the environment,
    // provides metrics, schema management and trace reporting.
    engine: false,

    // Subscriptions are unsupported but planned for a future Gateway version.
    subscriptions: false,
  });

  server.listen({ port: 4002 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
