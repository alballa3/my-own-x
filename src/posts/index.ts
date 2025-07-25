(async () => {
    interface IPost {
        user_id: string,
        post_id: string,
        post: string,
        likes: number,
        dislikes: number,
        created_at: string,
        updated_at: string,
        user?: {
            username: string,

        }
    }
    function createPost(content: IPost): void {
        const postHTML = `
    <article class="border-b border-gray-800 p-4 hover:bg-gray-950/50 transition-colors">
      <div class="flex space-x-3">
        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-lg font-bold">U</span>
        </div>
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <h3 class="font-bold">${content.user?.username}</h3>
            
            <span class="text-gray-500">${content.created_at}</span>
          </div>
          <p class="mt-1 text-white">${content.post}</p>
          <div class="flex items-center justify-between mt-3 max-w-md">
            <button class="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors group">
              <div class="p-2 rounded-full group-hover:bg-blue-900/20">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="text-sm">${content.likes}</span>
            </button>
            <button class="flex items-center space-x-2 text-gray-500 hover:text-green-400 transition-colors group">
              <div class="p-2 rounded-full group-hover:bg-green-900/20">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </div>
              <span class="text-sm">${content.dislikes}</span>
            </button>
            <button class="flex items-center space-x-2 text-gray-500 hover:text-red-400 transition-colors group like-btn">
              <div class="p-2 rounded-full group-hover:bg-red-900/20">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="text-sm like-count">0</span>
            </button>
            <button class="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors group">
              <div class="p-2 rounded-full group-hover:bg-blue-900/20">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;

        if (postsFeed) {
            postsFeed.insertAdjacentHTML('afterbegin', postHTML);
        }
    }
    // Post creation functionality
    const postContent = document.getElementById('postContent') as HTMLTextAreaElement | null;
    const postButton = document.getElementById('postButton') as HTMLButtonElement | null;
    const postsFeed = document.getElementById('postsFeed');

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
    const json = await reponse.json()
    if (Array.isArray(json)) {
        json.forEach(createPost); // render each post
    } else {
        createPost(json); // fallback if single post
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
            if (content) {
                createPost(json);
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



    // Handle like functionality
    document.addEventListener('click', function (e: Event) {
        const target = e.target as Element;
        if (target.closest('.like-btn')) {
            const likeBtn = target.closest('.like-btn') as HTMLElement;
            const likeCount = likeBtn.querySelector('.like-count') as HTMLElement;
            const currentCount = parseInt(likeCount.textContent || '0', 10);

            if (likeBtn.classList.contains('liked')) {
                likeBtn.classList.remove('liked', 'text-red-400');
                likeBtn.classList.add('text-gray-500');
                likeCount.textContent = (currentCount - 1).toString();
            } else {
                likeBtn.classList.add('liked', 'text-red-400');
                likeBtn.classList.remove('text-gray-500');
                likeCount.textContent = (currentCount + 1).toString();
            }
        }
    });
})()