import "toastify-js/src/toastify.css"
import Toastify from 'toastify-js'
document.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement
    const dislike_button = target.closest(".dislike-btn")
    if (!dislike_button) return;

    const article = dislike_button.closest("article")
    const dislike_count = dislike_button.querySelector(".dislike-count") as HTMLElement
    const post_id = article?.getAttribute("data-post-id")
    if (!dislike_count) return;
    const reponse = await fetch(`${import.meta.env.VITE_BACKEND}/post/dislike`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: post_id
        })

    })
    const json = await reponse.json()
    if (!reponse.ok) {
        Toastify({
            text: json.message || json.error || "NETWORK ERROR",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover

        }).showToast()
        return;
    }
    if (dislike_button.classList.contains('dislike')) {
        dislike_button.classList.remove('dislike', 'text-red-400')
        dislike_button.classList.add('text-gray-500')
        dislike_count.textContent = (parseInt(dislike_count.textContent || '0', 10) - 1).toString()
        return
    }
    else {
        dislike_button.classList.add('dislike', 'text-blue-400')
        dislike_button.classList.remove('text-gray-500')
        dislike_count.textContent = (parseInt(dislike_count.textContent || '0', 10) + 1).toString()
    }
})  