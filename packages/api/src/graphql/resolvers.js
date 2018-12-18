const safeGet = require('lodash.get');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { ApolloError, UserInputError } = require('apollo-server-koa');

const { WEBSITE_CONTACT_FORM } = require('../constants/notifications');
const { assertRefreshTokenPayload } = require('../utils/asserts');
const { validateRecaptchaResponse } = require('../utils/recaptcha');

// We set our own JWT iat to avoid Clock skew issue: @URL: https://en.wikipedia.org/wiki/Clock_skew
const createAccessToken = ({ JWT_SECRET, data }) =>
  jwt.sign(
    {
      iat: parseInt((Date.now() / 1000).toFixed(0), 10),
      ...data,
      type: 'access',
    },
    JWT_SECRET,
    { expiresIn: 60 * 1 },
  );
const createRefreshToken = ({ JWT_SECRET, data }) =>
  jwt.sign(
    {
      iat: parseInt((Date.now() / 1000).toFixed(0), 10),
      ...data,
      type: 'refresh',
    },
    JWT_SECRET,
    { expiresIn: '30 days' },
  );

const assertUser = async user => {
  if (!safeGet(user, '_id')) {
    throw new ApolloError('Authentication required', 'UNAUTHENTICATED');
  }
};

module.exports = ({ config: { JWT_SECRET }, db }) => ({
  Query: {
    userProfile: async (_, __, { user }) => {
      await assertUser(user);

      const profile = await db.getUserProfile(user._id, true);

      return {
        ...profile,
      };
    },
  },
  Mutation: {
    signUpUser: async (_, { recaptchaResponse, email, password, fullName }) => {
      const paramsValidationErrors = {};

      if (validator.isEmpty(recaptchaResponse)) {
        throw new ApolloError(
          'Our security system could not determine if the request was made by a human. Try it again.',
          'INVALID_CAPTCHA',
        );
      }
      if (!validator.isEmail(email)) {
        paramsValidationErrors.email = 'Email is not valid';
      }
      if (validator.isEmpty(password)) {
        paramsValidationErrors.password = 'Password must be set';
      }
      if (validator.isEmpty(fullName)) {
        paramsValidationErrors.fullName = "What's your name?";
      }
      if (!validator.isLength(fullName, { min: 2, max: undefined })) {
        paramsValidationErrors.fullName = 'Too short!';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError('Failed to sign up due to validation errors', {
          validationErrors: paramsValidationErrors,
        });
      }

      const isRecaptchaValid = await validateRecaptchaResponse(
        recaptchaResponse,
      );

      if (!isRecaptchaValid) {
        throw new ApolloError(
          'Our security system could not determine if the request was made by a human. Try it again.',
          'INVALID_CAPTCHA',
        );
      }

      try {
        const user = await db.signUpUser(email, password, fullName);

        const accessToken = createAccessToken({
          JWT_SECRET,
          data: {
            _id: user._id,
          },
        });
        const refreshToken = createRefreshToken({
          JWT_SECRET,
          data: {
            _id: user._id,
          },
        });

        return { accessToken, refreshToken };
      } catch (e) {
        if (e.name === 'ValidationError') {
          const userValidationErrors = {};

          Object.entries(e.errors).forEach(([key, value]) => {
            userValidationErrors[key] = value.message;
          });

          return new UserInputError(
            'Failed to sign up due to validation errors',
            { validationErrors: userValidationErrors },
          );
        }

        throw e;
      }
    },
    loginUser: async (_, { email, password }) => {
      const paramsValidationErrors = {};
      const logInErr = new ApolloError(
        'Invalid credentials',
        'INVALID_LOGIN_CREDENTIALS',
      );

      if (!validator.isEmail(email)) {
        paramsValidationErrors.email = 'Email is not valid';
      }
      if (validator.isEmpty(password)) {
        paramsValidationErrors.password = 'Need password';
      }
      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError('Failed to log in due to validation errors', {
          validationErrors: paramsValidationErrors,
        });
      }

      try {
        const user = await db.getUserByEmail(email);
        if (!user) throw logInErr;

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) throw logInErr;

        const accessToken = createAccessToken({
          JWT_SECRET,
          data: {
            _id: user._id,
          },
        });
        const refreshToken = createRefreshToken({
          JWT_SECRET,
          data: {
            _id: user._id,
          },
        });

        return { accessToken, refreshToken };
      } catch (e) {
        throw logInErr;
      }
    },
    loginUserNoAuth: async (_, __, { user }) => {
      const err = new ApolloError('Cannot log in user', 'INVALID_LOGIN');

      if (!user) {
        throw err;
      }

      try {
        return db.loginUser(user._id);
      } catch (e) {
        throw err;
      }
    },
    refreshAccessToken: async (_, { refreshToken }) => {
      let decodedJWT;
      try {
        decodedJWT = jwt.verify(refreshToken, JWT_SECRET);
        assertRefreshTokenPayload(decodedJWT);
      } catch (e) {
        throw new ApolloError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      }

      const challengeStatus = await db.authChallenge(
        decodedJWT._id,
        decodedJWT.iat,
      );
      if (!challengeStatus) {
        throw new ApolloError(
          'User did not pass auth challenge',
          'INVALID_REFRESH_TOKEN',
        );
      }

      const accessToken = createAccessToken({
        JWT_SECRET,
        data: {
          _id: decodedJWT._id,
        },
      });

      return { accessToken };
    },
    forgotPassword: async (_, { email }) => {
      if (!validator.isEmail(email)) {
        throw new UserInputError(
          'Failed to process forgot password request due to validation errors',
          {
            validationErrors: { email: 'Invalid email' },
          },
        );
      }

      const user = await db.getUserByEmail(email);
      if (!user) throw new ApolloError('User does not exists', '');

      db.forgotPasswordRequest(user._id);

      return true;
    },
    resetPassword: async (_, { resetToken, newPassword }) => {
      const paramsValidationErrors = {};

      if (validator.isEmpty(resetToken)) {
        paramsValidationErrors.resetToken = 'Provided reset token is not valid';
      }
      if (validator.isEmpty(newPassword)) {
        paramsValidationErrors.newPassword = 'Invalid password';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError(
          'Failed to reset password due to validation errors',
          {
            validationErrors: paramsValidationErrors,
          },
        );
      }

      try {
        await db.resetPasswordRequest(resetToken, newPassword);
      } catch (e) {
        switch (e.message) {
          case 'INVALID_PASSWORD_RESET_TOKEN':
            throw new ApolloError(
              'Password reset link is invalid or expired',
              'INVALID_PASSWORD_RESET_TOKEN',
            );
          default:
            throw e;
        }
      }

      return true;
    },
    confirmUserEmail: async (_, { confirmationToken }) => {
      const invalidTokenErr = new ApolloError(
        'This confirmation link is invalid or has already been used',
        'UNABLE_EMAIL_CONFIRMATION',
      );

      if (validator.isEmpty(confirmationToken)) {
        throw invalidTokenErr;
      }

      try {
        await db.confirmUserEmail(confirmationToken);
      } catch (e) {
        switch (e.message) {
          case 'UNABLE_EMAIL_CONFIRMATION':
            throw invalidTokenErr;
          case 'CANDIDATE_EMAIL_TAKEN':
            throw new ApolloError(
              'Oops! the email address you choosen was used by another user before you. Please try it again.',
              'UNABLE_EMAIL_CONFIRMATION',
            );
          default:
            throw e;
        }
      }

      return true;
    },
    contact: async (
      _,
      { recaptchaResponse, name, email, subject, message },
    ) => {
      const paramsValidationErrors = {};

      if (validator.isEmpty(recaptchaResponse)) {
        throw new ApolloError(
          'Captcha is required to continue',
          'INVALID_CAPTCHA',
        );
      }
      if (
        validator.isEmpty(name) ||
        !validator.isLength(name, { min: 2, max: undefined })
      ) {
        paramsValidationErrors.name = 'Name is not valid';
      }
      if (!validator.isEmail(email)) {
        paramsValidationErrors.email = 'Email is not valid';
      }
      if (validator.isEmpty(subject)) {
        paramsValidationErrors.subject = 'Subject is not valid';
      }
      if (
        validator.isEmpty(message) ||
        !validator.isLength(message, { min: 10, max: undefined })
      ) {
        paramsValidationErrors.message = 'Message is not valid';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError(
          'Failed to send contact request due validation errors',
          {
            validationErrors: paramsValidationErrors,
          },
        );
      }

      const isRecaptchaValid = await validateRecaptchaResponse(
        recaptchaResponse,
      );

      if (!isRecaptchaValid) {
        throw new ApolloError(
          'Our security system could not determine if the request was made by a human. Try it again.',
          'INVALID_CAPTCHA',
        );
      }

      await db.notify(null, WEBSITE_CONTACT_FORM, {
        name,
        email,
        subject,
        message,
      });

      return true;
    },
    changeUserPassword: async (_, { oldPassword, newPassword }, { user }) => {
      await assertUser(user);

      const paramsValidationErrors = {};

      if (validator.isEmpty(oldPassword)) {
        paramsValidationErrors.oldPassword = 'Invalid old password';
      }
      if (validator.isEmpty(newPassword)) {
        paramsValidationErrors.newPassword = 'Invalid password';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError(
          'Failed to change password due to validation errors',
          {
            validationErrors: paramsValidationErrors,
          },
        );
      }

      try {
        await db.changeUserPassword(user._id, oldPassword, newPassword);
      } catch (e) {
        switch (e.message) {
          case 'INVALID_OLD_PASSWORD':
            throw new UserInputError(
              'Failed to change password due to validation errors',
              {
                validationErrors: {
                  oldPassword:
                    'Password does not match your current account password',
                },
              },
            );
          default:
            throw e;
        }
      }

      const accessToken = createAccessToken({
        JWT_SECRET,
        data: {
          _id: user._id,
        },
      });
      const refreshToken = createRefreshToken({
        JWT_SECRET,
        data: {
          _id: user._id,
        },
      });

      return { accessToken, refreshToken };
    },
    changeUserEmail: async (_, { password, email }, { user }) => {
      await assertUser(user);

      const userInputError = errors =>
        new UserInputError('Failed to change email due to validation errors', {
          validationErrors: errors,
        });

      const paramsValidationErrors = {};

      if (validator.isEmpty(password)) {
        paramsValidationErrors.password = 'Password required';
      }
      if (!validator.isEmail(email)) {
        paramsValidationErrors.email = 'Invalid email';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw userInputError(paramsValidationErrors);
      }

      const emailAlreadyTaken = await db.existsUserWithEmail(email);
      if (emailAlreadyTaken) {
        throw userInputError({
          email: 'Email already in use by another user',
        });
      }
      const passwordMatches = await db.compareUserPassword(user._id, email);
      if (passwordMatches) {
        throw userInputError({
          password: 'Password does not match your current account password',
        });
      }

      await db.changeUserEmail(user._id, email);

      return true;
    },
    updateUserProfile: async (_, { profile }, { user }) => {
      await assertUser(user);

      const { nickname } = profile;

      const userInputError = errors =>
        new UserInputError(
          'Failed to update user profile due to validation errors',
          {
            validationErrors: errors,
          },
        );
      const paramsValidationErrors = {};

      if (
        typeof nickname !== 'string' ||
        !nickname ||
        !/^[A-Za-z0-9_]{2,16}$/.test(nickname)
      ) {
        paramsValidationErrors.nickname =
          'Nickname must be between 2 and 16 characters and only contains letters, numbers and underscores.';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw userInputError(paramsValidationErrors);
      }

      return db.updateUserProfile(user._id, profile);
    },
    updateUserPersonalDetails: async (_, { profile }, { user }) => {
      await assertUser(user);

      const { fullName } = profile;

      const userInputError = errors =>
        new UserInputError(
          'Failed to update user personal details due to validation errors',
          {
            validationErrors: errors,
          },
        );
      const paramsValidationErrors = {};

      if (
        typeof fullName !== 'string' ||
        !fullName ||
        !/^[^0-9_]{2,48}$/.test(fullName)
      ) {
        paramsValidationErrors.fullName =
          'Full Name must be between 2 and 48 characters and not contain numbers or underscores.';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw userInputError(paramsValidationErrors);
      }

      return db.updateUserPersonalDetails(user._id, profile);
    },
  },
});
