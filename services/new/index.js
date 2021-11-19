const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const careApiTypeDefs = gql`
# Interface for a member's appointments, including CaseType and Hub based
interface Appointment {
  createdAt: DateType!
  id: ID!

  # Replaced by 'provider.name'
  name: String
  providers: [ProviderType!]
  scheduledAt: DateType
  scheduledEndAt: DateType
  scheduledStartAt: DateType
}

input AppointmentSlotInput {
  scheduledEndAt: DateType!
  scheduledStartAt: DateType!
}

type CaseAppointment {
  user: UserType!
}

extend type UserType @key(fields: "id") {
  id: ID!
}

# Stub attempts to try to satisfy dependencies of CaseType
# extend type CaseAppointment implements Appointment @key(fields: "id") {
# extend type CaseAppointment @key(fields: "id") {
#   id: String @external
# }
# extend type CaseAssignmentType @key(fields: "id") {
#   id: String @external
# }
# extend type CaseLogTypeConnection @key(fields: "id") {
#   id: String @external
# }
# extend type CaseSetting @key(fields: "id") {
#   id: String @external
# }
# extend type ExpertSettingType @key(fields: "id") {
#   id: String @external
# }
# extend type ServiceInterface @key(fields: "id") {
#   id: String @external
# }
# extend type SettingsKeyInput @key(fields: "id") {
#   id: String @external
# }
# extend type CommentTypeConnection @key(fields: "id") {
#   id: String @external
# }
# extend type CaseMessagingMetadata @key(fields: "id") {
#   id: String @external
# }
# extend type Practictioner @key(fields: "id") {
#   id: String @external
# }
# enum CaseServiceTypesEnum {
#   # Claims Support
#   claims_support

#   # Clinical Guide
#   clinical_guide

#   # Opinion
#   consultation

#   # Office Visit
#   referral
# }
# scalar AnyScalar

# extend type CaseType @key(fields: "id") {
#   id: String! @external
# }

# extend type CaseType @key(fields: "id") {

type CaseType implements Interaction {
  active: Boolean
  appointments: [CaseAppointment]
  caseAssignments(role: [String]): [CaseAssignmentType]
  caseFlags: [String]
  caseLogs(
    # Returns the elements in the list that come after the specified cursor.
    after: String

    # Returns the elements in the list that come before the specified cursor.
    before: String

    # Returns the first _n_ elements from the list.
    first: Int

    # Returns the last _n_ elements from the list.
    last: Int
  ): CaseLogTypeConnection
  caseSettings: [CaseSetting]
  complete: Boolean
  condition: String
  createdAt: String!
  createdAtDate: DateType!
  description: String
  doctorType: String
  encounterTag: String

  # Settings for a case.
  expertSettings(key_names: [SettingsKeyInput]): [ExpertSettingType]
  expertSpecialties: [AnyScalar]
  firstName: String
  headerString: String
  id: String!
  idForMemberQuery: String
  memberId: String
  memberService: ServiceInterface!
  messageCenterComments(
    # Returns the elements in the list that come after the specified cursor.
    after: String

    # Returns the elements in the list that come before the specified cursor.
    before: String

    # Returns the first _n_ elements from the list.
    first: Int

    # Returns the last _n_ elements from the list.
    last: Int
  ): CommentTypeConnection
  messagingMetadata: CaseMessagingMetadata
  patient: MemberType!
  patientResponsibilityText: String
  practictioner: Practictioner
  providerName: String
  serviceDate: String
  serviceType: CaseServiceTypesEnum!
  sierraDetailsLibraryUrl: String!
  sierraDetailsUrl: String!
  stateTitle: String
  updatedAt: DateType
}

# Note: In the Jarvis, ClinicalVisit implements Interaction. We don't do that
# here because Interaction mixes Jarvis Cases and Clinical Visit cases, and we
# haven't teased that apart yet
type ClinicalVisit implements Interaction {
  active: Boolean
  allergies: String
  appointments: [HealthCloudAppointment]
  cancelled: Boolean
  chatId: ID
  complete: Boolean
  completedAt: DateType
  connectionPreference: ConnectionPreferenceEnum
  conversations: [ID!]
  createdAtDate: DateType!
  currentState: String

  # Whether or not the patient is currently feeling symptoms
  currentSymptoms: Boolean

  # Description of the current status of the interaction.
  description: String

  # The date of birth reported by the member in the intake form or recorded by the CC in the hub
  dob: String!
  encounterTag: String
  gender: String
  headerString: String
  id: String!
  isProviderReady: Boolean!
  medicalIssueDescription: String
  medications: String
  patient: MemberType!
  patientResponsibilityText: String
  phone: String
  reasonForVisit: String!
  selfDescribeGender: String
  serviceDate: String
  smsNotification: Boolean
  symptomDuration: String

  # When member would like to connect for their visit if they have 24/7 access,
  # value is one of "During Business Hours" or "ASAP"
  timePreference: String
  updatedAt: DateType
  videoId: ID
  videoMeetingStatus: VideoMeetingStatusEnum
  videoPassword: String
  videoProvider: VideoProviderEnum
  videoUrl: String
}

enum ConnectionPreferenceEnum {
  Phone
  Video
}

input CreateClinicalVisitInput {
  allergies: String
  appointmentSlot: AppointmentSlotInput

  # A unique identifier for the client performing the mutation.
  clientMutationId: String
  connectionPreference: ConnectionPreferenceEnum!
  currentState: String
  currentSymptoms: Boolean!
  description: String
  dob: String!
  gender: String!
  medications: String
  phone: String!
  reasonForVisit: String!
  requestedUserId: ID!
  selfDescribeGender: String
  smsNotification: Boolean!
  symptomDuration: String
  timePreference: String
}

# Autogenerated return type of CreateClinicalVisit
type CreateClinicalVisitPayload {
  clientMutationId: String
  clinicalVisit: ClinicalVisit
  eventId: ID
}

scalar DateType

# an object representing a member's appointment via the Hub
# type HealthCloudAppointment implements Appointment {
type HealthCloudAppointment implements Appointment {
  createdAt: DateType!
  id: ID!

  # Replaced by 'provider.name'
  name: String
  providers: [ProviderType!]!
  scheduledAt: DateType
  scheduledEndAt: DateType
  scheduledStartAt: DateType
}

# Interface for a member's interactions, including cases, clinical visits
interface Interaction {
  active: Boolean

  # A member's appointments, including CaseType and Hub based
  appointments: [Appointment]
  complete: Boolean
  createdAtDate: DateType!

  # Description of the current status of the interaction.
  description: String
  encounterTag: String
  headerString: String
  id: String!
  patient: MemberType!
  patientResponsibilityText: String
  serviceDate: String
  updatedAt: DateType
}

extend type MemberType @key(fields: "fhirPatientId") {
  fhirPatientId: String @external
}

extend type Mutation {
  helloFromCareApi: String!
  createClinicalVisitCareApi(input: CreateClinicalVisitInput!): CreateClinicalVisitPayload
  rescheduleAppointment(input: RescheduleAppointmentInput!): RescheduleAppointmentPayload
}

# this is a placeholder entity that can be removed once an actual entity is added
# necessary due to: https://github.com/99designs/gqlgen/issues/1090
type PlaceholderEntity @key(fields: "message") {
  message: String!
}

# Object type for a provider surfaced in an appointment object
type ProviderType {
  id: ID
  name: String
}

extend type Query {
  testInteractions: [Interaction]!
}

input RescheduleAppointmentInput {
  appointmentId: ID!
  clientMutationId: String
  scheduledEndAt: String!
  scheduledStartAt: String!
}

type RescheduleAppointmentPayload {
  clientMutationId: String
  success: Boolean!
}

# Valid statuses for the video meeting associated with a clinical visit
enum VideoMeetingStatusEnum {
  finished
  started
  waiting
}

# What service to use for video chat
enum VideoProviderEnum {
  Zoom
}
`;

// const typeDefs = gql`
//   extend type MemberType @key(fields: "fhirPatientId") {
//     fhirPatientId: String @external
//   }
  
//   interface Interaction {
//     id: ID!
//     member: MemberType
//     headerString: String
//   }

//   type Placehold {
//     id: ID!
//     member: MemberType
//   }


//   # extend type CaseType @key(fields: "id") @provides(fields: "serviceType") {
//   # Directive "@provides" may not be used on OBJECT.
//   # extend type CaseType @key(fields: "id") {
//   #   id: ID! @external
//     # serviceType: String! @provides("serviceType")
//     # Syntax Error
//   # }

//   type ClinicalVisit implements Interaction {
//     id: ID!
//     reasonForVisit: String!
//     member: MemberType
//     headerString: String
//   }

//   extend type Query {
//     field: Placehold
//   #   # interactions: [Interaction]
//     clinicalVisits: [ClinicalVisit]
//   }

//   # extend type Mutation {
//   #   createClinicalVisit(memberId: ID!): ClinicalVisit
//   # }
// `;

const resolvers = {
  /**
   * me.clinicalVisits moving into CareAPI
   */
  Query: {
    testInteractions() {
      return [{
        __typename: 'ClinicalVisit',
        id: 'interaction id from careapi'
      }]
    },
    field() {
      return { id: 'id from new' };
    },
    clinicalVisits() {
      return [{
        __typename: 'Cli`nicalVisit',
        id: 'ID From CareAPI clinicalVisits resolver',
        reasonForVisit: 'reasonForVisit From CareAPI clinicalVisits resolver'
      }];
    }
  },
  Placehold: {
    member(placehold) {
      return { __typename: 'MemberType', fhirPatientId: 'fake from careapi' };
    }
  },
  // MemberType: {
  //   interactions() {
  //     return [
  //       {
  //         __typename: 'ClinicalVisit',
  //         id: 'ID From CareAPI clinicalVisits resolver',
  //         reasonForVisit: 'reasonForVisit From CareAPI clinicalVisits resolver',
  //       },
  //       {
  //         __typename: 'CaseType',
  //         id: 'ID From CareAPI interactions resolver',
  //         serviceType: 'serviceType From CareAPI interactions resolver',
  //       }
  //     ]
  //   },

  //   clinicalVisits(memberFromJarvis) {
  //     console.log('got member: ', memberFromJarvis);

  //     // const clinicalVisitsFromJarvis = query('jarvis', `
  //     //   query me.clinicalVisistsBridge {
  //     //     id
  //     //     patient {
  //     //       id
  //     //     }
  //     //   }
  //     // `);

  //     // return clinicalVisitsFromJarvis.map(obj => ({
  //     //   ...obj,
  //     //   patient: { id: obj.patient.id }
  //     // }))

  //     const clinicalVisitsFromJarvis = [{
  //       __typename: 'ClinicalVisit',
  //       id: 'ID From CareAPI clinicalVisits resolver',
  //       reasonForVisit: 'reasonForVisit From CareAPI clinicalVisits resolver',
  //       member: {
  //         // Note that this memberID isn't the me { } field that we're nested
  //         // inside of, it's the member of the case.
  //         // id: clinicalVisitsFromJarvis[0].memberId
  //         id: memberFromJarvis.id
  //       }
  //     }];

  //     return clinicalVisitsFromJarvis;
  //   }
  // },

  /**
   * Mutation createClinicalVisit moving into CareAPI
   */
  // Mutation: {
  //   createClinicalVisit(_, args) {
  //     return {
  //       __typename: 'ClinicalVisit',
  //       id: 'New ClinicalVisit ID From CareAPI',
  //       reasonForVisit: 'CareAPI reasonForVisit',
  //       member: {
  //         id: args.memberId
  //       }
  //     };
  //   }
  // },
  // When the mutation is called and the member is requested, this resolver
  // powers the ClinicalVisit.member field
  ClinicalVisit: {
    member(newClinicalVisit) {
      return { __typename: 'MemberType', id: 'fake id from new' };
    }
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs: careApiTypeDefs,
      // typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4004 }).then(({ url }) => {
  console.log(`🚀 New Server ready at ${url}`);
});
