import { getUserFrontEnd, type UserInDB } from "./users"

(async () => {
    console.log("header.ts loaded")
    let session: UserInDB | null = null;

    try {
        session = await getUserFrontEnd();
    } catch (err) {
        console.error("Failed to get user session:", err);
    } 
    console.log(session)
    const body = document.querySelector("body") as HTMLBodyElement
    const header = document.createElement("header")
    header.id = "header"
    const nav = document.createElement("nav") as HTMLElement

    const div = document.createElement("div")
    div.className = "flex justify-between items-center w-full"
    nav.className = "flex justify-end items-center max-w-6xl mx-auto"

    // Left section: Home & Features
    const navLinks = document.createElement("div")
    navLinks.className = "flex gap-4 items-center"

    navLinks.innerHTML = `
<a href="/" class="text-white text-sm font-medium hover:text-gray-300 transition">Home</a>
<a href="/features.html" class="text-white text-sm font-medium hover:text-gray-300 transition">Features</a>
`

    // Right section: Auth or User Info
    const authControls = document.createElement("div")
    authControls.className = "flex gap-3 items-center"

    // Apply header base classes - Twitter X black theme
    header.className = "bg-black px-4 py-3 border-b border-gray-800"
    nav.append(div)
    header.append(nav)
    body.prepend(header)
    div.append(navLinks, authControls)
    console.log("div")
    if (!session) {
        const auth = `
       <a href="/auth/login.html" 
                   class="text-white no-underline px-4 py-2 rounded-full font-medium transition-all duration-200 
                          border border-gray-600 hover:bg-gray-900">
                    Log in
                </a>
                <a href="/auth/register.html" 
                   class="text-black no-underline px-4 py-2 rounded-full font-bold transition-all duration-200 
                          bg-white hover:bg-gray-200">
                    Sign up
                </a>`
        authControls.innerHTML = auth

    } else {
        const username = session.name.charAt(0).toUpperCase()
        authControls.innerHTML = `
                <div class="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-900/50 transition-colors duration-200">
                    <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        ${username}
                    </div>
                    <span class="text-white font-medium text-sm">${session.name}</span>
                </div>
                <button id="logout" 
                        class="text-white px-4 py-2 rounded-full font-medium transition-all duration-200
                               border border-gray-600 hover:bg-gray-900 hover:border-gray-500">
                    Log out
                </button>
    `
    }

    const logout = document.getElementById("logout") as HTMLButtonElement | null;
    logout?.addEventListener("click", async () => {
        try {
            logout.disabled = true;
            logout.textContent = 'Logging out...';

            const response = await fetch(`${import.meta.env.VITE_BACKEND}/auth/logout`, {
                method: "POST",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`Logout failed: ${response.status}`);
            }

            window.location.href = "/";
        } catch (error) {
            console.error('Logout failed:', error);
            logout.disabled = false;
            logout.textContent = 'Log out';
            // Consider showing a more user-friendly error message/modal here
            alert('Logout failed. Please try again.');
        }
    });
})()