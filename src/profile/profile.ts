import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { createPost, escapeHtml, type IPost } from "../lib/post";
dayjs.extend(relativeTime);
// Types
interface User {
  id: string;
  name: string;
  bio?: string;
  created_at: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
}
export interface Profile {
  id: string;
  name: string;
  is_user: boolean;
  is_following: boolean;
  bio?: string;
  created_at: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  posts: IPost[];
}
// State
let currentUser: User | null = null;
let profileUser: User | null = null;
let userPosts: IPost[] = [];
let isFollowing = false;

// DOM elements
let profileContainer: HTMLElement | null = null;
let postsContainer: HTMLElement | null = null;
let loadingSpinner: HTMLElement | null = null;
let errorMessage: HTMLElement | null = null;

let id = new URLSearchParams(window.location.search).get("id");

async function getProfile() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND}/user/profile?id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  const json = await response.json();
  return json as Profile;
}

// Initialize the profile page
async function initProfilePage(): Promise<void> {
  try {
    // Get DOM elements
    profileContainer = document.getElementById("profile-container");
    postsContainer = document.getElementById("posts-container");
    loadingSpinner = document.getElementById("loading-spinner");
    errorMessage = document.getElementById("error-message");

    if (!profileContainer || !postsContainer) {
      console.error("Required containers not found");
      return;
    }
    await loadProfile();
  } catch (error) {
    console.error("Failed to initialize profile page:", error);
    showError("Failed to load profile");
  }
}

// Load profile data
async function loadProfile(): Promise<void> {
  try {
    showLoading(true);
    hideError();

    let profile = await getProfile();
    console.log(profile)
    profileUser = {
      id: profile.id,
      name: profile.name,
      bio: profile.bio,

      created_at: profile.created_at,
      posts_count: profile.posts_count,
      followers_count: profile.followers_count,
      following_count: profile.following_count,
    };
    userPosts = profile.posts;

    // Random follow status if not own profile
    isFollowing = profile.is_following

    renderProfile();
    renderPosts();
  } catch (error) {
    console.error("Error loading profile:", error);
    showError("Failed to load user profile");
  } finally {
    showLoading(false);
  }
}

// Render profile information
function renderProfile(): void {
  console.log(profileUser);
  if (!profileContainer || !profileUser) return;
  const safeUsername = escapeHtml(profileUser.name);
  const safeBio = escapeHtml(profileUser.bio || "");
  const userInitial = safeUsername.charAt(0).toUpperCase();
  const joinDate = dayjs(profileUser.created_at).fromNow();
  const isOwnProfile = currentUser?.id === profileUser.id;

  profileContainer.innerHTML = `
    <div class="relative">
      <!-- Cover Photo -->
      <div class="h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg"></div>
      
      <!-- Profile Info -->
      <div class="relative px-6 pb-6">
        <!-- Avatar -->
        <div class="absolute -top-12 left-6">
          <div class="w-24 h-24 bg-blue-500 rounded-full border-4 border-black flex items-center justify-center text-white font-bold text-2xl">
            ${userInitial}
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end pt-4 space-x-3">
              <button 
              id="follow-btn"
              user-id="${profileUser.id}"
              class="px-4 py-2 ${isFollowing
      ? "bg-gray-600 hover:bg-gray-700"
      : "bg-blue-500 hover:bg-blue-600"
    } text-white rounded-full font-medium transition-colors"
            >
              ${isFollowing ? "Following" : "Follow"}
            </button>
         
        </div>
        
        <!-- User Info -->
        <div class="mt-4">
          <div class="flex items-center space-x-2 mb-2">
            <h1 class="text-xl font-bold text-white">${safeUsername}</h1>
            ${isOwnProfile
      ? '<span class="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">You</span>'
      : ""
    }
          </div>
          <p class="text-gray-400 mb-2">@${safeUsername
      .toLowerCase()
      .replace(/\s+/g, "")}</p>
          <p class="text-gray-300 mb-3">${safeBio}</p>
          
          <!-- Join Date -->
          <div class="flex items-center text-gray-400 text-sm mb-3">
            <i class="fas fa-calendar-alt mr-2"></i>
            <span>Joined ${joinDate}</span>
          </div>
          
          <!-- Stats -->
          <div class="flex items-center space-x-4 text-sm">
            <div class="flex items-center space-x-1">
              <span class="font-bold text-white following-count">${profileUser.following_count
    }</span>
              <span class="text-gray-400">Following</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="font-bold text-white followers-count">${profileUser.followers_count
    }</span>
              <span class="text-gray-400">Followers</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="font-bold text-white">${profileUser.posts_count
    }</span>
              <span class="text-gray-400">Posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Posts Header -->
    <div class="border-b border-gray-800 px-6 py-3">
      <h2 class="text-lg font-semibold text-white">Posts</h2>
    </div>
  `;
}

// Render user posts
function renderPosts(): void {
  if (!postsContainer) return;

  if (userPosts.length === 0) {
    postsContainer.innerHTML = `
      <div class="text-center py-12">
        <div class="text-gray-400 text-lg mb-2">No posts yet</div>
        <div class="text-gray-500 text-sm">
          ${profileUser?.name || "This user"} hasn't posted anything yet.
        </div>
      </div>
    `;
    return;
  }

  const postsHTML = userPosts.map((post) => createPost(post)).join("");
  postsContainer.innerHTML = postsHTML;
}

// Utility functions for UI
function showLoading(show: boolean): void {
  if (loadingSpinner) {
    loadingSpinner.style.display = show ? "block" : "none";
  }
}

function showError(message: string): void {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }
}

function hideError(): void {
  if (errorMessage) {
    errorMessage.style.display = "none";
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProfilePage);
} else {
  initProfilePage();
}
