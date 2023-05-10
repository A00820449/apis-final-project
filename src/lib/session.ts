import type { IronSessionOptions } from 'iron-session'
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next'

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'iron-session-cookie',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}


export const withSessionApiRoute = (handler: NextApiHandler) => {
    return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown },>(
  handler: (context: GetServerSidePropsContext,) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionOptions);
}


export const getServerSidePropsUserSession = withSessionSsr(async ({req}) : Promise<GetServerSidePropsResult<UserSessionProps>> =>{

  if (!req.session.user_id) {
    console.log("NOT LOGGED IN, REDIRECTING")
      return {
          redirect: {
              permanent: false,
              destination: "/login"
          }
      }
  }

  return {
      props: {
          user_id: req.session.user_id
      }
  }
})

export type UserSessionProps = {user_id: string}

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    user_id?: string
  }
}