const typeDefs = `
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
`;

export default typeDefs;
