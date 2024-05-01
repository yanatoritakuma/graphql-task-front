import { useEffect, useState } from "react"

 

export const useAuth = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodeJWT = (token: string): { [key: string]: any } | null => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Failed to decode JWT token:", error);
            return null;
        }
    }

    const [authInfo,setAuthInfo] = useState<{
        checked:boolean
        isAuthenticated:boolean
    }>({
        checked: false,
        isAuthenticated: false
    })

    useEffect(() => {
        const token = localStorage.getItem("token")

        try {
            if (token){
                const decodeToken = decodeJWT(token)
                if (decodeToken?.exp * 1000 < Date.now()){
                    localStorage.removeItem("token")
                    setAuthInfo({checked:true,isAuthenticated:false})
                } else{
                    setAuthInfo({checked:true,isAuthenticated:true})
                }
            } else{
                setAuthInfo({checked:true,isAuthenticated:false})
            }
        } catch (error) {
            setAuthInfo({checked:true,isAuthenticated:false})
        }
    },[])

    return authInfo
}

