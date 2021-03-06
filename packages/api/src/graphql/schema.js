const { gql } = require('apollo-server-koa');

module.exports = gql`
  type AuthTokens {
    accessToken: String
    refreshToken: String
  }
  type UserProfile {
    _id: String
    _subscription: String
    accountStatus: String
    firstName: String
    lastName: String
    nickname: String
    email: String
    avatar: String
    isSignUpEmailConfirmed: Boolean
    isTwoFactorAuthenticationEnabled: Boolean
    isInTrialPeriod: Boolean
    timezone: String
    legal: [LegalAgreement]
  }
  type UserPaymentReceipts {
    saleGross: String
    receiptURL: String
    receivedAt: String
  }
  type Plan {
    _id: String
    _paddleProductId: Int
    name: String
    description: String
    features: [String]
    price: Float
    tier: Int
    billingInterval: String
  }
  type Subscription {
    _id: String
    _plan: Plan
    status: String
    accessUntil: String
    paymentStatus: String
    unitPrice: Float
    updateURL: String
    cancelURL: String
    nextBillDateAt: String
  }
  type LegalAgreement {
    type: LegalAgreementType!
    accepted: String!
  }
  type TwoFactorAuthentication {
    secret: String!
    qrcode: String!
  }
  type FreshdeskSSO {
    url: String!
  }

  enum LegalAgreementType {
    TERMS_AND_CONDITIONS
    PRIVACY_POLICY
    MARKETING_INFO
  }

  input LegalAgreementInput {
    type: LegalAgreementType!
    accepted: String!
  }
  input UserProfileInput {
    nickname: String!
  }
  input UserPersonalDetailsInput {
    firstName: String!
    lastName: String!
  }
  input UserNotificationsPreferencesInput {
    notifications: [LegalAgreementInput]!
  }
  input UserPreferencesInput {
    timezone: String!
  }

  type Query {
    userProfile: UserProfile
    userSubscription: Subscription
    userPaymentReceipts: [UserPaymentReceipts]
    activeSubscriptionPlans: [Plan]
    getFreshdeskSSO: FreshdeskSSO
  }
  type Mutation {
    signUpUser(
      recaptchaResponse: String
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      timezone: String
    ): AuthTokens
    loginUser(email: String!, password: String!, token: String): AuthTokens
    loginUserNoAuth: UserProfile
    refreshAccessToken(refreshToken: String!): AuthTokens
    forgotPassword(email: String!): Boolean
    resetPassword(resetToken: String!, newPassword: String!): Boolean
    confirmUserEmail(confirmationToken: String!): Boolean
    changeUserPassword(oldPassword: String!, newPassword: String!): AuthTokens
    changeUserEmail(password: String!, email: String!): Boolean
    updateUserProfile(profile: UserProfileInput!): UserProfile
    updateUserPersonalDetails(profile: UserPersonalDetailsInput!): UserProfile
    updateUserNotificationsPreferences(
      notifications: UserNotificationsPreferencesInput!
    ): UserProfile
    updateUserPreferences(preferences: UserPreferencesInput!): UserProfile
    chageUserSubscriptionPlan(planId: String!): Boolean
    requestEnable2FA: TwoFactorAuthentication
    confirmEnable2FA(password: String!, token: String!): Boolean
    disable2FA(token: String!): Boolean
  }
`;
