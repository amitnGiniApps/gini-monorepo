const configurationVariables = {
  URL: process.env.BASE_URL,
  ISSUER_BASE_URL: process.env.ISSUER_BASE_URL,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
  AWS_DYNAMO_DB:process.env.AWS_DYNAMO_DB,
};



export const configuration = () => {
  return configurationVariables;
};
