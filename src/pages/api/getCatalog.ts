import { getUserCatalog } from "@/lib/db";
import { withSessionApiRoute } from "@/lib/session";
import { Service } from "@prisma/client";
import { NextApiHandler } from "next";

export type GetCatalogResponse = Service[]

const handler : NextApiHandler<GetCatalogResponse> = async (req, res) => {
    const id = req.session.user_id || ""
    try {
        const cat = await getUserCatalog(id)
        res.json(cat)
    }
    catch(e) {
        res.json([])
        console.error(e)
    }
}

export default withSessionApiRoute(handler)