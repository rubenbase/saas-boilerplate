const typeDefs = `
  type UserProfile {
    fullName: String!
    username: String!
    email: String!
    avatar: String!
    isSignUpEmailConfirmed: Boolean!
  }

  type AuthTokens {
    accessToken: String
    refreshToken: String
  }
`;

export default typeDefs;
