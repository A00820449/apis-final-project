import { useDeleteService } from "@/lib/hooks"
import { Button, ListItem } from "@mui/material"
import { Service } from "@prisma/client"
import { Delete as DeleteIcon } from "@mui/icons-material"

type CatalogItemProps = {
    service: Service
}

export default function CatalogListItem({service}: CatalogItemProps) {
    const { trigger, isMutating } = useDeleteService({serviceID: service.id})
    return (
    <ListItem sx={{display: "block", backgroundColor: "rgba(0,0,0,0.1)", margin: "1rem 0", borderRadius: "5px", padding: "1rem"}}>
        <div style={{fontWeight: "bold"}}>{service.eventName}</div>
        <div style={{margin: "1rem 0"}}>{service.description ? `Description: ${service.description}`: "No description."}</div>
        <Button variant="contained" color="error">
            <DeleteIcon/>
        </Button>
    </ListItem>
    )
}