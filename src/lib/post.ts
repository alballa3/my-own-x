import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export interface IPost {
  user_id: string;
  post_id: string;
  post: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
  };
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
export function createPost(content: IPost) {
  const safePostId = escapeHtml(content.post_id);
  const safeUsername = content.user?.username ? escapeHtml(content.user.username) : "Unknown";
  const safeUsernameInitial = safeUsername !== "Unknown"
    ? escapeHtml(content.user!.username[0] || "?")
    : "?";
  const safePost = escapeHtml(content.post);

  const postHTML = `
  <article class="border-b border-gray-800 p-4 hover:bg-gray-950/50 transition-colors" data-post-id="${safePostId}">
    <div class="flex space-x-3">
      <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-lg font-bold">${safeUsernameInitial}</span>
      </div>
      <div class="flex-1">
        <div class="flex items-center space-x-2">
          <h3 class="font-bold text-white">${safeUsername}</h3>
          <span class="text-gray-500 text-sm">${dayjs(content.created_at).fromNow()}</span>
        </div>
        <p class="mt-1 text-white">${safePost}</p>
        
        <div class="flex items-center gap-4 mt-3 text-sm text-gray-400">
          <!-- Like -->
          <button class="flex items-center gap-1 hover:text-red-400 transition like-btn" data-action="like">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            <span class="like-count">${content.likes}</span>
          </button>
  
          <!-- Dislike -->
          <button class="flex items-center gap-1 hover:text-blue-400 transition dislike-btn" data-action="dislike">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a1 1 0 01-1-1v-4H6a1 1 0 01-.894-1.447l4-8A1 1 0 0110 3h4a1 1 0 011 1v10a1 1 0 01-1 1h-2v3a1 1 0 01-1 1z" />
            </svg>
            <span class="dislike-count">${content.dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  </article>
    `;
  return postHTML;
}