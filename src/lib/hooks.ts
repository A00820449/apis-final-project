import { CheckAppointmentInput, CheckAppointmentResponse } from "@/pages/api/checkAppointment";
import { CreateAppointmentInput, CreateAppointmentResponse } from "@/pages/api/createAppointment";
import { DeleteAppointmentInput, DeleteAppointmentResponse } from "@/pages/api/deleteAppointment";
import { DeleteServiceInput, DeleteServiceResponse } from "@/pages/api/deleteService";
import { GetAppointmentsResponse } from "@/pages/api/getAppointments";
import { GetCatalogResponse } from "@/pages/api/getCatalog";
import { GetUserFullResponse } from "@/pages/api/getUserFull";
import { UpdateUserInput, UpdateUserResponse } from "@/pages/api/updateUser";
import { User, UserResponse } from "@/pages/api/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const fetcher = (url: string) => fetch(url).then(res => res.json())

const fetcherPost = async (url: string, {arg}: {arg: any}) => {
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arg)
    }).then(r => r.json())
}

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

export function useMutateUserData() {
    const {data, isMutating, error, trigger} = useSWRMutation<UpdateUserResponse, any, "/api/updateUser", UpdateUserInput>("/api/updateUser", fetcherPost)
    return {response: data, isMutating, error, trigger}
}

export function useCheckAppointment(args: CheckAppointmentInput, disable = false) {
    const {data, error, isLoading, mutate} = useSWR<CheckAppointmentResponse>(disable ? null : `/api/checkAppointment?${new URLSearchParams({json: JSON.stringify(args)})}`, fetcher, {revalidateIfStale: false, revalidateOnFocus: false, revalidateOnMount: false})

    return {found: data, error, isLoading, mutate}
}

export function useCreateAppointment() {
    const {data, isMutating, error, trigger} = useSWRMutation<CreateAppointmentResponse, any, "/api/createAppointment", CreateAppointmentInput>("/api/createAppointment", fetcherPost)

    return {response: data, isMutating, error, trigger}
}

export function useDeleteAppointment(args : DeleteAppointmentInput) {
    const {data, isMutating, error, trigger} = useSWRMutation<DeleteAppointmentResponse>(`/api/deleteAppointment?${new URLSearchParams(args)}`, fetcher)

    return {response: data, isMutating, error, trigger}
}

export function useDeleteService(args: DeleteServiceInput) {
    const {data, isMutating, error, trigger} = useSWRMutation<DeleteServiceResponse>(`/api/deleteService?${new URLSearchParams(args)}`, fetcher)

    return {response: data, isMutating, error, trigger}
}

export function useAppointments() {
    const {data, isLoading, error, mutate} = useSWR<GetAppointmentsResponse>("/api/getAppointments", fetcher)

    return {appointments: data, isLoading, error, mutate}
}