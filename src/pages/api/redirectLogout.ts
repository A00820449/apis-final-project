import { withSessionApiRoute } from "@/lib/session";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    req.session.destroy()
    res.redirect("/")
}

export default withSessionApiRoute(handler)