import { Box, ListItem } from "@mui/material"
import { Service } from "@prisma/client"

type CatalogItemProps = {
    service: Service
}

export default function CatalogListItem({service}: CatalogItemProps) {
    return (
    <ListItem>
        <Box>{service.eventName}</Box>
        <Box>{service.description}</Box>
    </ListItem>
    )
}