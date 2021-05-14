const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type MemberType @key(fields: "id") {
    id: ID! @external
    clinicalVisits: [ClinicalVisit]
    interactions: [Interaction]
  }

  interface Interaction {
    id: ID!
    member: MemberType
  }

  # extend type CaseType @key(fields: "id") @provides(fields: "serviceType") {
  # Directive "@provides" may not be used on OBJECT.
  # extend type CaseType @key(fields: "id") {
  #   id: ID! @external
    # serviceType: String! @provides("serviceType")
    # Syntax Error
  # }

  type ClinicalVisit implements Interaction {
  # type ClinicalVisit {
    id: ID!
    reasonForVisit: String!
    member: MemberType
  }

  extend type Query {
    # interactions: [Interaction]
    clinicalVisits: [ClinicalVisit]
  }

  extend type Mutation {
    createClinicalVisit(memberId: ID!): ClinicalVisit
  }
`;

const resolvers = {
  /**
   * me.clinicalVisits moving into CareAPI
   */
  MemberType: {
    interactions() {
      return [
        {
          __typename: 'ClinicalVisit',
          id: 'ID From CareAPI clinicalVisits resolver',
          reasonForVisit: 'reasonForVisit From CareAPI clinicalVisits resolver',
        },
        {
          __typename: 'CaseType',
          id: 'ID From CareAPI interactions resolver',
          serviceType: 'serviceType From CareAPI interactions resolver',
        }
      ]
    },

    clinicalVisits(memberFromJarvis) {
      console.log('got member: ', memberFromJarvis);

      // const clinicalVisitsFromJarvis = query('jarvis', `
      //   query me.clinicalVisistsBridge {
      //     id
      //     patient {
      //       id
      //     }
      //   }
      // `);

      // return clinicalVisitsFromJarvis.map(obj => ({
      //   ...obj,
      //   patient: { id: obj.patient.id }
      // }))

      const clinicalVisitsFromJarvis = [{
        __typename: 'ClinicalVisit',
        id: 'ID From CareAPI clinicalVisits resolver',
        reasonForVisit: 'reasonForVisit From CareAPI clinicalVisits resolver',
        member: {
          // Note that this memberID isn't the me { } field that we're nested
          // inside of, it's the member of the case.
          // id: clinicalVisitsFromJarvis[0].memberId
          id: memberFromJarvis.id
        }
      }];

      return clinicalVisitsFromJarvis;
    }
  },

  /**
   * Mutation createClinicalVisit moving into CareAPI
   */
  Mutation: {
    createClinicalVisit(_, args) {
      return {
        __typename: 'ClinicalVisit',
        id: 'New ClinicalVisit ID From CareAPI',
        reasonForVisit: 'CareAPI reasonForVisit',
        member: {
          id: args.memberId
        }
      };
    }
  },
  // When the mutation is called and the member is requested, this resolver
  // powers the ClinicalVisit.member field
  ClinicalVisit: {
    patient(newClinicalVisit) {
      return { __typename: 'MemberType', id: newClinicalVisit.member.id };
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
