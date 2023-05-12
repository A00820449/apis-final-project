import { GetCatalogResponse } from "@/pages/api/getCatalog";
import { GetUserFullResponse } from "@/pages/api/getUserFull";
import { User, UserResponse } from "@/pages/api/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json())

const defaultUser : User = {id: "", businessID: "", businessName: "", isAdmin: false}

export function useUser(redirectIfNotFound: boolean = true) {
    const {data, error, isLoading, mutate} = useSWR<UserResponse>("/api/user", fetcher)
    const router = useRouter()

    useEffect(()=>{
        if (!redirectIfNotFound) {return}

        if (isLoading) {return}

        if (error || !data || data.id === null) {
            router.push("/api/redirectLogout")
        }

    },[data, isLoading, error, redirectIfNotFound, router])

    let user : User

    if (!data || data.id === null) {
        user = {...defaultUser}
    }
    else {
        user = data
    }
    
    return {user, error, isLoading, mutate}
}

export function useCatalog() {
    const {data, error, isLoading, mutate} = useSWR<GetCatalogResponse>("/api/getCatalog", fetcher)

    let catalog: GetCatalogResponse = []
    if (data) {
        catalog = data
    }

    return {catalog, error, isLoading, mutate}
}

const defaultUserData = {id: "", businessID: "", businessName: "", phoneNum: null, address: null, logoURL: null, dateJoined: new Date(), openHour: 0, openMinute: 0, closeHour: 0, closeMinute: 0, openSunday: false, openMonday: false, openTuesday: false, openWednesday: false, openThursday: false, openFriday: false, openSaturday: false, maxWeeks: 0, minutePeriod: 0, isAdmin: false}

export function useUserFull() {
    const {data, error, isLoading, mutate} = useSWR<GetUserFullResponse>("/api/getUserFull", fetcher)

    return {user: data, isLoading, error, mutate}
}