import { createPost, type IPost } from "../lib/post";

(async () => {
    // Post creation functionality
    const postContent = document.getElementById('postContent') as HTMLTextAreaElement | null;
    const postButton = document.getElementById('postButton') as HTMLButtonElement | null;
    const postsFeed = document.getElementById('postsFeed');
    const showError = document.getElementById('error') as HTMLLabelElement
    // Enable/disable post button based on content
    if (postContent && postButton) {
        postContent.addEventListener('input', function () {
            postButton.disabled = this.value.trim().length === 0;
        });
    }
    const reponse = await fetch(`${import.meta.env.VITE_BACKEND}/post/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await reponse.json() as IPost[]
    if (Array.isArray(json)) {
        json.forEach((data) => {
            let html = createPost(data);
            if (postsFeed) {
                postsFeed.insertAdjacentHTML('afterbegin', html);
            }
        }); // render each post
    } else {
        let html = createPost(json);
        if (postsFeed) {
            postsFeed.insertAdjacentHTML('afterbegin', html);
        }
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
})()