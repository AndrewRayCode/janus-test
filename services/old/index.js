const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Member @key(fields: "id") {
    id: ID!
    name: String
  }

  extend type Query {
    me: Member
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    }
  },
  Member: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
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

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Old Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  }
];
