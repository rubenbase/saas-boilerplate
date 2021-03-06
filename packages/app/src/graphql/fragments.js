import gql from 'graphql-tag';

export const ProfileFields = gql`
  fragment ProfileFields on UserProfile {
    _id
    _subscription
    accountStatus
    firstName
    lastName
    nickname
    email
    avatar
    isSignUpEmailConfirmed
    isTwoFactorAuthenticationEnabled
    isInTrialPeriod
    timezone
    legal {
      type
      accepted
    }
  }
`;
