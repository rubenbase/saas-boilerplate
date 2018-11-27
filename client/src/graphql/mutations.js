import gql from 'graphql-tag';

import { ProfileFields } from './fragments';

// we use this one for checking if user is signed in
export const SignUpUser = gql`
  mutation signUpUser(
    $recaptchaResponse: String
    $email: String!
    $password: String!
    $name: String!
  ) {
    signUpUser(
      recaptchaResponse: $recaptchaResponse
      email: $email
      password: $password
      name: $name
    ) @disableAuth {
      accessToken
      refreshToken
    }
  }
`;

export const LoginUser = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) @disableAuth {
      accessToken
      refreshToken
    }
  }
`;
export const LoginUserNoAuth = gql`
  ${ProfileFields}

  mutation loginUserNoAuth {
    profile: loginUserNoAuth @disableAuth {
      ...ProfileFields
    }
  }
`;

export const RefreshAccessToken = gql`
  mutation refreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) @disableAuth {
      accessToken
    }
  }
`;

export const ForgotPassword = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) @disableAuth
  }
`;
export const ResetPassword = gql`
  mutation forgotPassword($resetToken: String!, $newPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword)
      @disableAuth
  }
`;

export const ConfirmUserEmail = gql`
  mutation confirmUserEmail($confirmationToken: String!) {
    confirmUserEmail(confirmationToken: $confirmationToken) @disableAuth
  }
`;
