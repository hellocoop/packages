import { useRouter } from "next/navigation";
import { logoutApiRoute } from "../lib/config";

export const logOutRoute = logoutApiRoute

export function logOut() {
    const { push } = useRouter()
    push(logoutApiRoute)
}