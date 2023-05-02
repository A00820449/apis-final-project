import { ListItem } from "@mui/material"
import { Service } from "@prisma/client"

type CatalogItemProps = {
    service: Service
}

export default function CatalogListItem({service}: CatalogItemProps) {
    return (
    <ListItem sx={{display: "block"}}>
        <div style={{fontWeight: "bold"}}>{service.eventName}</div>
        <div>{service.description ? `Description: ${service.description}`: "No description."}</div>
    </ListItem>
    )
}