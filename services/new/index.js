const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type MyThing {
    id: ID
  }
  extend type Query {
    aside: MyThing
  }
`;

const resolvers = {
  Query: {
    aside() {
      return { id: 'Aside ID' };
    }
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4004 }).then(({ url }) => {
  console.log(`🚀 New Server ready at ${url}`);
});
