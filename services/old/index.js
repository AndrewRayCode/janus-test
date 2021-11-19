const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type MemberType @key(fields: "fhirPatientId") {
    fhirPatientId: String
  }

  type UserType @key(fields: "id") {
    id: ID!
    member: MemberType!
  }

  extend type Query {
    me: UserType
  }
`;

const resolvers = {
  /**
   * me.clinicalVisits moving into CareAPI
   */
  Query: {
    me() {
      return {
        id: '0017A00000VAQcxQAH',
        name: 'me name',
        member:  {
          fhirPatientId: '0017A00000VAQcxQAH',
          name: 'me name'
        }
      }
    }
  },
  MemberType: {
    interactions() {
      return [
        {
          __typename: 'ClinicalVisit',
          id: 'ID From Jarvis clinicalVisits resolver',
          reasonForVisit: 'reasonForVisit From Jarvis clinicalVisits resolver',
        },
        {
          __typename: 'CaseType',
          id: 'ID From Jarvis interactions resolver',
          serviceType: 'serviceType From Jarvis interactions resolver',
        }
      ]
    },

    // Phase 0: Jarvis handles clincalVisits
    clinicalVisits() {
      return [{
        __typename: 'ClinicalVisit',
        id: 'ID From Jarvis clinicalVisits resolver',
        reasonForVisit: 'reasonForVisit From Jarvis clinicalVisits resolver',
        // member: { // WRONG!
        //   id: '1'
        // }
      }];
    },

    // Phase 1: Jarvis resovles reference from careAPI
    __resolveReference(object) {
      console.log('JARVIS: member reference resolver', object);
      return {
        id: 'ID From Jarvis reference resolver',
        dob: 'Name from Jarvis reference resolver',
        memberId: 'Name from Jarvis reference resolver',
        firstName: 'Name from Jarvis reference resolver',
        lastName: 'Name from Jarvis reference resolver',
        availableServices: [{ uri: 'urhi' }],
      };
    },
  },

  /**
   * Mutation createClinicalVisit moving into CareAPI
   */
  Mutation: {
    createClinicalVisit() {
      return {
        __typename: 'ClinicalVisit',
        id: 'New ID From Jarvis',
        reasonForVisit: 'Jarvis reasonForVisit'
      };
    }
  },
  /**
   * (Phase 0) When Jarvis owns Clinical Visits, this field
   * is called
   */
  ClinicalVisit: {
    member(data) {
      console.log('JARVIS: resolve member', data);
      return {
        name: 'ID from Jarvis member() resolver',
        id: 'ID from Jarvis member() resolver'
      };
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

/**
 * For a top level clinical visits field, the setup works where we
 * can define the clinical visit type across both boundaries and mark
 * member as an entity and not load it in
 *
 * For the mutation case, it seems to work the same way, so I think
 * we're ok there.
 *
 * For the clinicalVisit field on member
 */
