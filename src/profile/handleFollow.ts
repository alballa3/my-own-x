import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";
const obsever = new MutationObserver((mut, obs) => {
    const button = document.getElementById("follow-btn");
    if (button) {
        const id = button.getAttribute("user-id");
        button?.addEventListener("click", async () => {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND}/user/follow?id=${id}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const json = await response.json();
            if (!response.ok) {
                Toastify({
                    text: json.message || json.error || "NETWORK ERROR",
                    duration: 3000,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                }).showToast();
                return;
            }
            button.textContent = response.status == 208 ? "Follow" : "Following";
        });
        obs.disconnect();
    }
});

obsever.observe(document.body, {
    childList: true,
    subtree: true,
});
