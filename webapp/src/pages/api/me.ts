import {
  getAccessToken,
  getSession,
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    // 1. Get Access Token (for calling APIs)
    const { accessToken } = await getAccessToken(req, res, {
      audience: "https://task-six",
      scope: "openid profile email",
    } as any);

    // 2. Get ID Token (and user claims) from the session
    const session = await getSession(req, res);
    const idToken = session?.idToken;
    const user = session?.user;

    res.status(200).json({
      accessToken,
      idToken,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
