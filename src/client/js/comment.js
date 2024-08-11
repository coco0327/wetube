const videoContainer = document.querySelector(".video-player__container");
const form = document.querySelector(".video__add-comments-form");
const commentDelete = document.querySelector(".video__comment-deleteBtn");

const addComment = (text, id) => {
  const commentList = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = " ❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  commentList.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
    textarea.value = "";
  }
};

const handleDelete = async (event) => {
  const comment = event.target.closest(".video__comment");
  const id = comment.dataset.id;

  const response = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });

  comment.remove();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

commentDelete.addEventListener("click", handleDelete);
