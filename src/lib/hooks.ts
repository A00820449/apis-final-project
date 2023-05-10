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