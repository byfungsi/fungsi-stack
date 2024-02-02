import jwt from "jsonwebtoken";
import {
  TAccesTokenUpdate,
  TAccessToken,
  TAccessTokenCreate,
  TAccessTokenQuery,
  ZAccessToken,
} from "@repo/validator";
import prismaClient from "../../../core/prismaClient";
import getOrThrowNotFound from "../../../utils/getOrThrowNotFound";
import ENTITIES from "../../../constants/entities";
import RESOURCES from "../../../constants/resources";
import { SIGN_KEY } from "../../../constants/apiEnvs";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import TOKEN_TYPE from "../../../constants/tokenType";
import {
  JWT_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_TIME,
} from "../../../constants/appConstants";

const createAccessToken = (createParam: TAccessTokenCreate) =>
  prismaClient.accessToken.create({
    data: createParam,
  });

const updateAccessAndRefreshTokens = (
  tokenQuery: TAccessTokenQuery,
  param: TAccesTokenUpdate,
) =>
  prismaClient.accessToken.update({
    where: {
      uniqueTokenId: tokenQuery,
    },
    data: {
      ...param,
    },
  });

const signAccessToken = (userId: string, clientId: string) =>
  jwt.sign({ userId, clientId, tokenType: TOKEN_TYPE.accessToken }, SIGN_KEY, {
    expiresIn: JWT_EXPIRATION_TIME,
  });

const signRefreshToken = (userId: string, clientId: string) =>
  jwt.sign({ userId, clientId, tokenType: TOKEN_TYPE.refreshToken }, SIGN_KEY, {
    expiresIn: JWT_REFRESH_TOKEN_TIME,
  });

const handleTokenNotFound =
  (userId: string, clientId: string) => (err: Error) => {
    if (err instanceof NotFoundError) {
      return createAccessToken({
        userId,
        clientId,
        accessToken: signAccessToken(userId, clientId),
        refreshToken: signRefreshToken(userId, clientId),
      }).then(ZAccessToken.parse);
    }
    throw err;
  };

const handleTokenExpired =
  (userId: string, clientId: string) => (err: Error) => {
    if (err instanceof jwt.TokenExpiredError) {
      return updateAccessAndRefreshTokens(
        {
          userId,
          clientId,
        },
        {
          accessToken: signAccessToken(userId, clientId),
          refreshToken: signRefreshToken(userId, clientId),
        },
      );
    }

    throw err;
  };

const verifyRefreshToken = (accessTokenData: TAccessToken) => {
  jwt.verify(accessTokenData.refreshToken, SIGN_KEY);
  return accessTokenData;
};

const verifyAccessToken = (accessTokenData: TAccessToken) => {
  jwt.verify(accessTokenData.accessToken, SIGN_KEY);
  return accessTokenData;
};

const deleteAccessTokenByUserId = (clientId: string, userId: string) =>
  prismaClient.accessToken.delete({
    where: {
      uniqueTokenId: {
        clientId,
        userId,
      },
    },
  });

const getOrCreateAccessTokenByUser = (userId: string, clientId: string) =>
  prismaClient.accessToken
    .findFirst({
      where: {
        userId,
        clientId,
      },
    })
    .then(getOrThrowNotFound(ENTITIES.accessToken, RESOURCES.database))
    .then(ZAccessToken.parse)
    .catch(handleTokenNotFound(userId, clientId))
    .then(verifyRefreshToken)
    .then(verifyAccessToken)
    .catch(handleTokenExpired(userId, clientId));

const getAccessTokenByAccessToken = (accessToken: string) =>
  prismaClient.accessToken
    .findFirst({
      where: {
        accessToken,
      },
    })
    .then(getOrThrowNotFound(ENTITIES.accessToken, RESOURCES.database))
    .then(ZAccessToken.parse);

const accessTokenService = {
  getOrCreateAccessTokenByUser,
  verifyAccessToken,
  getAccessTokenByAccessToken,
  deleteAccessTokenByUserId,
};

export default accessTokenService;
