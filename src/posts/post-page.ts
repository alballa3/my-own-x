import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import "toastify-js/src/toastify.css"
import Toastify from 'toastify-js'
import { createPost, createReply, type IComment, type IPost } from '../lib/post';
dayjs.extend(relativeTime);


// Main application class
const postContainer = document.getElementById('post-container');
const repliesContainer = document.getElementById('replies-container');
const comment = document.getElementById("comment") as HTMLTextAreaElement
const form = document.getElementById("form") as HTMLFormElement;
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const response = await fetch(`${import.meta.env.VITE_BACKEND}/post/comment`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post_id: id,
      comment: comment.value
    })
  })
  const json = await response.json()
  comment.value = ""
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
  }
  repliesContainer?.insertAdjacentHTML("afterbegin", createReply(json))
})
async function loadPost() {
  const reponse = await fetch(`${import.meta.env.VITE_BACKEND}/post/view?id=${id}`, { credentials: "include", method: "GET" })
  const post: IPost = await reponse.json();
  if (postContainer) {
    postContainer.innerHTML = createPost(post);
  }
  if (repliesContainer) {
    repliesContainer.innerHTML = post.comments.map((comment: IComment) => createReply(comment)).join("");
  }
}



// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  await loadPost()
});

