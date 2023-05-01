import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

type Query = {
    businessID: string
}

export function getServerSideProps(ctx: GetServerSidePropsContext) : GetServerSidePropsResult<{}> {

    const {businessID} = ctx.query as Query

    if (!businessID.match(/^@/)) {
        return {
            notFound: true
        }
    }

    return {
        redirect: {
            destination: `/business/${encodeURIComponent(businessID.replace(/^@/, ""))}`,
            permanent: false
        }
    }
}

export default function Test() {
    
    const router = useRouter()
    const { businessID } = router.query as Query

    return <div>
        <Link href={`/business/${encodeURIComponent(businessID.replace(/^@/, ""))}`}>Redirect</Link>
    </div>
}