import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export interface IPost {
  user_id: string;
  post_id: string;
  post: string;
  likes: number;
  comments: IComment[];
  dislikes: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    is_liked: boolean;
    is_dislike?: boolean;
  };
}

export interface IComment {
  user_id: string;
  username: string;
  comment: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

export function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function createPost(content: IPost) {
  const safePostId = escapeHtml(content.post_id);
  const safeUsername = content.user?.username
    ? escapeHtml(content.user.username)
    : "Unknown";
  const safeUsernameInitial =
    safeUsername !== "Unknown"
      ? escapeHtml(content.user!.username[0] || "?")
      : "?";
  const safePost = escapeHtml(content.post);
  const isLiked = content.user?.is_liked || false;
  const is_disliked = content.user?.is_dislike || false;
  const postHTML = `
    <article class="border-b border-gray-800 p-4 hover:bg-gray-950/50 transition-colors" data-post-id="${safePostId}">

      <div class="flex space-x-3">
        <a href="href="/profile?id=${
          content.user_id
        }" class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-lg font-bold">${safeUsernameInitial}</span>
        </a>
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <a href="/profile?id=${
              content.user_id
            }" class="font-bold text-white">${safeUsername}</a>
            <span class="text-gray-500 text-sm">${dayjs(
              content.created_at
            ).fromNow()}</span>
          </div>
         
        <a 
            href="/post?id=${safePostId}" 
            class="block mt-1 text-white hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="View post by ${content.user?.username}"
          >
            <p class="whitespace-pre-wrap break-words">${safePost}</p>
          </a>

          <div class="flex items-center gap-4 mt-3 text-sm text-gray-400">
            <!-- Like -->
            <button class="flex items-center gap-1 hover:text-red-400 transition like-btn ${
              isLiked ? "text-red-400 liked" : ""
            }" data-action="like">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
              </svg>
              <span class="like-count">${content.likes}</span>
            </button>
    
            <!-- Dislike -->
            <button class="flex items-center gap-1 hover:text-blue-400 transition dislike-btn ${
              is_disliked ? "text-blue-400 dislike" : ""
            }" data-action="dislike">
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

export function createReply(reply: IComment): string {
  const safeUsername = reply.username ? escapeHtml(reply.username) : "Unknown";
  const safeUsernameInitial =
    safeUsername !== "Unknown" ? escapeHtml(reply.username[0] || "?") : "?";
  const safeReply = escapeHtml(reply.comment);

  return `
    <article class="border-b border-gray-800 px-4 py-3 hover:bg-gray-950/30 transition-colors">
      <div class="flex items-start space-x-3">
        <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          ${safeUsernameInitial}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 mb-1">
            <h3 class="font-bold text-white hover:underline cursor-pointer">${safeUsername}</h3>
            <span class="text-gray-500">@${safeUsername.toLowerCase()}</span>
            <span class="text-gray-500">·</span>
            <span class="text-gray-500 text-sm">${dayjs(
              reply.created_at
            ).fromNow()}</span>
          </div>
          <div class="mb-3">
            <p class="text-white leading-relaxed">${safeReply}</p>
          </div>
          <div class="flex items-center justify-between max-w-md">
            <button class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-900 text-gray-500 hover:text-twitter-blue transition-colors group">
              <i class="far fa-comment text-sm"></i>
              <span class="text-sm">0</span>
            </button>
            <button class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-900 text-gray-500 hover:text-twitter-green transition-colors group">
              <i class="fas fa-retweet text-sm"></i>
              <span class="text-sm">0</span>
            </button>
            <button class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-900 text-gray-500 hover:text-twitter-red transition-colors group">
              <i class="far fa-heart text-sm"></i>
              <span class="text-sm">${reply.likes}</span>
            </button>
            <button class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-900 text-gray-500 hover:text-blue-400 transition-colors group">
              <i class="fas fa-thumbs-down text-sm"></i>
              <span class="text-sm">${reply.dislikes}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}
