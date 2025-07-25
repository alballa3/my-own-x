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