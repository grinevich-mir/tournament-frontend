const awsconfig = {
  Auth: {
    region: process.env.VUE_APP_AWS_REGION,
    userPoolId: process.env.VUE_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID,
  },
  oauth: {
    domain: process.env.VUE_APP_AUTH_DOMAIN,
    scope: [
      'email',
      'openid',
      'profile',
      'aws.cognito.signin.user.admin',
    ],
    redirectSignIn: process.env.VUE_APP_AUTH_CALLBACK_URL,
    redirectSignOut: process.env.VUE_APP_AUTH_CALLBACK_URL,
    responseType: 'code',
  },
};

export default awsconfig;
