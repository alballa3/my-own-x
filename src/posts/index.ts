import { createPost, type IPost } from "../lib/post";
interface Pagination {
    page: Number,
    limit: Number,
    totalPages: Number,
    posts: IPost[]
}
let page = 1;
// Post creation functionality
const postContent = document.getElementById('postContent') as HTMLTextAreaElement | null;
const postButton = document.getElementById('postButton') as HTMLButtonElement | null;
const postsFeed = document.getElementById('postsFeed');
const showError = document.getElementById('error') as HTMLLabelElement

const end = document.createElement("br")
end.classList.add("end")
postsFeed?.insertAdjacentElement("beforeend", end)
const test = new IntersectionObserver((entries) => {
    console.log(entries)
    if (entries[0].isIntersecting) {
        page++
        loadPost(page, postsFeed as Element)

    }
})

// Enable/disable post button based on content
if (postContent && postButton) {
    postContent.addEventListener('input', function () {
        postButton.disabled = this.value.trim().length === 0;
    });
}
loadPost(page, postsFeed as Element)
test.observe(document.querySelector(".end") as Element)

async function loadPost(page: Number, postsFeed: Element) {
    const reponse = await fetch(`${import.meta.env.VITE_BACKEND}/post/all?page=${page}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });


    const json = await reponse.json() as Pagination
    json.posts.forEach((data) => {
        let html = createPost(data);
        if (postsFeed) {
            postsFeed.insertAdjacentHTML("beforeend", html); // Add to bottom
        }
    });
    postsFeed.appendChild(end); // Move `.end` to the actual bottom
}

// Handle post creation
if (postButton && postContent) {
    postButton.addEventListener('click', async function () {
        const content = postContent.value.trim();
        const reponse = await fetch(`${import.meta.env.VITE_BACKEND}/post/create`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: content }),
        });
        const json = await reponse.json()
        console.log(json);

        if (!reponse.ok) {
            showError.textContent = json.error
            return;
        }
        if (content) {
            let html = createPost(json);
            if (postsFeed) {
                postsFeed.insertAdjacentHTML('afterbegin', html);
            }
            postContent.value = '';
            postButton.disabled = true;
        }
    });
}

// Auto-resize textarea
if (postContent) {
    postContent.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

