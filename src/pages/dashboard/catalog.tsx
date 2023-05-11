import { getDashboardLayout } from "@/components/dashboardLayout";
import { UserSessionProps, getServerSidePropsUserSession } from "@/lib/session";
import { Container, List, Typography } from "@mui/material";
import { NextPageWithLayout } from "../_app";
import CatalogListItem from "@/components/catalogListItem";
import CatalogUploadForm from "@/components/catalogUploadForm";
import { useCatalog } from "@/lib/hooks";

export const getServerSideProps = getServerSidePropsUserSession

const Catalog : NextPageWithLayout<UserSessionProps> = ({}) =>  {
    const { catalog } = useCatalog()
    return (
        <Container sx={{marginTop: "1rem"}} maxWidth="sm">
            <Typography variant="h4">Your Service Catalog</Typography>
            <CatalogUploadForm/>
            <List>
                {catalog.length > 0 ?
                catalog.map((v)=>(
                <CatalogListItem service={v} key={v.id} />
                )) :
                "Empty catalog..."
                }
            </List>
        </Container>
    )
}

Catalog.getLayout = getDashboardLayout

export default Catalog