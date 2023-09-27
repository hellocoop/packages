import { useRouter } from "next/navigation";

export const logOutRoute = "/api/hellocoop?logout=true";

export function logOut() {
    const { push } = useRouter()
    push(logOutRoute)
}