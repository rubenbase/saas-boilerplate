import gql from 'graphql-tag';

export const ProfileFields = gql`
  fragment ProfileFields on UserProfile {
    _id
    _subscription
    fullName
    nickname
    email
    avatar
    isSignUpEmailConfirmed
    isTwoFactorAuthenticationEnabled
    isInTrialPeriod
    trialPeriodStartedAt
    legal {
      type
      accepted
    }
  }
`;
