import { getBusinessData } from "@/lib/db";
import { Container, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type Query = {
    businessID: string
}

type Props = {
    id: string
    businessID: string,
    businessName: string,
    address: string | null,
    phone: string | null,
    logoURL: string | null
}

export async function getServerSideProps({query}: GetServerSidePropsContext) : Promise<GetServerSidePropsResult<Props>> {
    const {businessID} = query as Query

    const businessData = await getBusinessData(businessID)
    
    if (businessData === null) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            id: businessData.id,
            businessID: businessData.businessID,
            businessName: businessData.businessName,
            address: businessData.address,
            phone: businessData.phoneNum,
            logoURL: businessData.logoURL
        }
    }
}

const weekdays = ["SUN", "MON", "TUE", "THU", "FRI", "SAT"]

export default function BusinessHomePage(props: Props) {
    return (
        <>
        <Typography>{props.businessName}</Typography>
        <TableContainer>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {weekdays.map((day)=> <TableCell key={day} align="center"> {day} </TableCell>)}
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
        </>
    )
}