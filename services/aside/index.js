const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type SomeEmptyTypeCareAPI {
    id: ID
  }
`;

const resolvers = {
  Member: {
    name() {
      return 'New name';
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Aside Server ready at ${url}`);
});
