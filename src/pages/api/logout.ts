import { withSessionApiRoute } from "@/lib/session";
import { NextApiHandler } from "next";

type Response = {
    id: null
}

const handler: NextApiHandler<Response> = async (req, res) => {
    req.session.destroy()
    res.send({id: null})
}

export default withSessionApiRoute(handler)