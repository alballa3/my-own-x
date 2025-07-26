import { createPost, type IPost } from "../lib/post";
import { getUserFrontEnd, type UserInDB } from "../lib/users";

export interface Iprofile {
    name: string,
    posts: IPost[]
}

// Simple variables to store data
let currentUser: UserInDB | null = null;
let userPosts: IPost[] = [];

// Load user profile data
async function loadUserProfile() {
    try {
        currentUser = await getUserFrontEnd();
        if (currentUser) {
            updateProfileUI();
        } else {
            showLoginPrompt();
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
        showLoginPrompt();
    }
}

// Load user posts
async function loadUserPosts() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/auth/profile`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const posts = await response.json();
            console.log(posts);
            userPosts = posts.posts;
            updatePostsUI();
            updateStatsUI();
        }
    } catch (error) {
        console.error('Failed to load user posts:', error);
    }

    // Hide loading skeleton
    const loadingSkeleton = document.getElementById('postsLoadingSkeleton');
    if (loadingSkeleton) loadingSkeleton.classList.add('hidden');
}

// Update profile UI with user data
function updateProfileUI() {
    if (!currentUser) return;

    // Update user name and handle
    const userName = document.getElementById('userName');
    const userHandle = document.getElementById('userHandle');
    const avatarInitial = document.getElementById('avatarInitial');

    if (userName) userName.textContent = currentUser.name;
    if (userHandle) userHandle.textContent = `@${currentUser.name.toLowerCase().replace(/\s+/g, '')}`;
    if (avatarInitial) avatarInitial.textContent = currentUser.name.charAt(0).toUpperCase();

    // Update bio and location (placeholder data)
    const userBio = document.getElementById('userBio');
    const userLocation = document.getElementById('userLocation');

    if (userBio) {
        userBio.textContent = "Passionate about sharing thoughts and connecting with others. Welcome to my profile! 🚀";
    }
    if (userLocation) userLocation.textContent = "Somewhere on Earth 🌍";

    // Update join date
    const joinDate = document.getElementById('joinDate');
    if (joinDate) {
        const dateValue = currentUser.created_at || new Date();
        const date = new Date(dateValue.toString());
        joinDate.textContent = `Joined ${date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        })}`;
    }

    // Update follower counts (placeholder)
    const followingCount = document.getElementById('followingCount');
    const followersCount = document.getElementById('followersCount');
    if (followingCount) followingCount.textContent = 'Soon';
    if (followersCount) followersCount.textContent = 'Soon';
}

// Update posts UI
function updatePostsUI() {
    const postsFeed = document.getElementById('userPostsFeed');
    const emptyState = document.getElementById('postsEmptyState');

    if (!postsFeed) return;

    if (userPosts.length === 0) {
        postsFeed.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    // Clear and render posts
    postsFeed.innerHTML = '';
    userPosts.forEach(post => {
        postsFeed.insertAdjacentHTML('beforeend', createPost(post));
    });
}

// Update stats UI
function updateStatsUI() {
    const postsCount = document.getElementById('postsCount');
    const postCountText = userPosts.length === 1 ? '1 post' : `${userPosts.length} posts`;

    if (postsCount) postsCount.textContent = postCountText;
}

// Show login prompt
function showLoginPrompt() {
    const postsFeed = document.getElementById('userPostsFeed');
    const emptyState = document.getElementById('postsEmptyState');

    if (postsFeed && emptyState) {
        postsFeed.innerHTML = '';
        emptyState.innerHTML = `
            <div class="text-center py-20 px-6">
                <div class="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-slate-300 mb-3">Please log in</h2>
                <p class="text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
                    You need to be logged in to view your profile and posts.
                </p>
                <a href="/auth/login.html" class="inline-block bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-200">
                    Log in
                </a>
            </div>
        `;
        emptyState.classList.remove('hidden');
    }
}

// Initialize when page loads
(async () => {
    await loadUserProfile();
    await loadUserPosts();
})();