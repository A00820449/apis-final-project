import { getDashboardLayout } from "@/components/dashboardLayout";
import { UserSessionProps, withSessionSsr } from "@/lib/session";
import { Container, List, Typography } from "@mui/material";
import { NextPageWithLayout } from "../_app";
import { GetServerSidePropsResult } from "next";
import { getUserCatalog, getUserData } from "@/lib/db";
import { User } from "../api/user";
import { Service } from "@prisma/client";
import CatalogListItem from "@/components/catalogListItem";
import CatalogUploadForm from "@/components/catalogUploadForm";

type CatalogProps = {
    user: User,
    catalog: Service[]
}

export const getServerSideProps = withSessionSsr(async ({req}) : Promise<GetServerSidePropsResult<CatalogProps>> =>{

    if (!req.session.user_id) {
      console.log("NOT LOGGED IN, REDIRECTING")
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }
  
    const user = await getUserData(req.session.user_id)
    
    if (!user) {
        req.session.destroy()
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }
  
    const catalog = await getUserCatalog(req.session.user_id)

    return {
        props: {
            user: user,
            catalog: catalog
        }
    }
  })

const Catalog : NextPageWithLayout<CatalogProps> = ({user, catalog}) =>  {

    return (
        <Container sx={{marginTop: "1rem"}}>
            <Typography variant="h4">Your Service Catalog</Typography>
            <CatalogUploadForm/>
            <List>
                {catalog.length > 0 ?
                catalog.map((v)=>(
                <CatalogListItem service={v} />
                )) :
                "Empty catalog..."
                }
            </List>
        </Container>
    )
}

Catalog.getLayout = getDashboardLayout

export default Catalog