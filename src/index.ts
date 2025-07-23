export async function getUserFrontEnd() {
    const reponse = await fetch(`${import.meta.env.VITE_BACKEND}/auth/session`, {
        method: "GET",
        credentials: "include"
    })
    const json = await reponse.json()
    return json || false
}

const logout = document.getElementById("logout") as HTMLButtonElement
console.log(logout)
logout.addEventListener("click", () => {
    fetch(`${import.meta.env.VITE_BACKEND}/auth/logout`, {
        method: "GET",
        credentials: "include"
    }).then(() => {
        window.location.href = "/"
    })
})
getUserFrontEnd().then((e) => {

    console.log(e)
})