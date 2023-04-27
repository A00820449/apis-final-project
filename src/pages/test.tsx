import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type TestProps = {
    timestamp: number
}

export function getServerSideProps(ctx: GetServerSidePropsContext) : GetServerSidePropsResult<TestProps> {
    console.log("request from IP:", ctx.req.socket.remoteAddress)
    return {
        props: {
            timestamp: Date.now()
        }
    }
}

export default function Test(props: TestProps) {
    const d = new Date(props.timestamp)
    return <div>
        Server date: {d.toISOString()}
    </div>
}