import "toastify-js/src/toastify.css"
import Toastify from 'toastify-js'
document.addEventListener('click', async (e) => {
    const target = e.target as Element
    const like_button = target.closest('.like-btn') as HTMLButtonElement
    if (!like_button) return
    const article = like_button.closest("article")
    const post_id = article?.getAttribute("data-post-id")
    const like_count = like_button.querySelector('.like-count') as HTMLSpanElement
    const response = await fetch(`${import.meta.env.VITE_BACKEND}/post/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: post_id
        })

    })
    const json = await response.json()
    if (!response.ok) {
        Toastify({
            text: json.message || json.error || "NETWORK ERROR",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }).showToast()
        return;
    }    if (like_button.classList.contains('liked')) {
        like_button.classList.remove('liked', 'text-red-400')
        like_button.classList.add('text-gray-500')
        like_count.textContent = (parseInt(like_count.textContent || '0', 10) - 1).toString()
        return
    }
    else {
        like_button.classList.add('liked', 'text-red-400')
        like_button.classList.remove('text-gray-500')
        like_count.textContent = (parseInt(like_count.textContent || '0', 10) + 1).toString()
    }

})