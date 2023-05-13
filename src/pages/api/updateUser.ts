import { updateUser } from "@/lib/db";
import { withSessionApiRoute } from "@/lib/session";
import { NextApiHandler } from "next";
import { z } from "zod";

const inputSchema = z.object({
    businessName: z.string().nonempty().optional(),
    stringopenHour: z.number().optional(),
    openMinute: z.number().optional(),
    closeHour: z.number().optional(),
    closeMinute: z.number().optional(),
    openSunday: z.boolean().optional(),
    openMonday: z.boolean().optional(),
    openTuesday: z.boolean().optional(),
    openWednesday: z.boolean().optional(),
    openThursday: z.boolean().optional(),
    openFriday: z.boolean().optional(),
    openSaturday: z.boolean().optional(),
    phoneNum: z.union([z.string().nonempty(), z.null()]).optional(),
    address: z.union([z.string().nonempty(), z.null()]).optional()
})

export type UpdateUserInput = z.infer<typeof inputSchema>

export type UpdateUserResponse = {ok: true, message?: string} | {ok: false, message: string}

const handler: NextApiHandler<UpdateUserResponse> = async (req, res) => {
    const id = req.session.user_id
    if (!id) {
        return res.status(400).json({ok: false, message: "unauthorized request"})
    }

    const input = inputSchema.safeParse(req.body)

    if (!input.success) {
        return res.status(400).json({ok: false, message: "invalid request"})
    }

    try {
        await updateUser(id, input.data)
        res.json({ok: true})
    }
    catch(e) {
        let msg = "server error"
        if (e instanceof Error) {
            msg = e.message || msg
        }
        res.status(500).json({ok: false, message: msg})
    }
}

export default withSessionApiRoute(handler)