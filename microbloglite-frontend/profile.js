"use strict";
//const apiBaseURL = "http://localhost:5005";


const tweetForm = document.getElementById("tweetForm");
const tweetTextInput = document.getElementById("tweetText");
const postList = document.getElementById("postList");

const authToken = getLoginData().token;

tweetForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tweetText = tweetTextInput.value.trim();

  if (!tweetText) {
    alert("Please enter some text to post.");
    return;
  }

  const newPost = {
    text: tweetText,
  };

  const response = await createPost(newPost);
  const post = await response.json();
  window.location.reload();
  tweetTextInput.value = "";
});

async function createPost(postData) {
  const response = await fetch(`${apiBaseURL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(postData),
  });

  return response;
}

async function getPosts() {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const response = await fetch(
    "http://localhost:5005/api/posts?limit=100&offset=0",
    options
  );
  const posts = await response.json();
  console.log("posts", posts);
  return posts;
}

async function getFullName(user) {
  const currentUser = getLoginData();
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${currentUser.token}`,
    },
  };

  const response = await fetch(
    `${apiBaseURL}/api/users/${user.username}`,
    options
  );

  const data = await response.json();
  return data.fullName;
}

async function createPostCard(post) {
  const fullName = await getFullName(post);

  // Create the outer post div
  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  // Create the avatar section
  const avatarDiv = document.createElement("div");
  avatarDiv.classList.add("post_avatar");
  const avatarImg = document.createElement("img");
  avatarImg.src =
  "https://static.vecteezy.com/system/resources/previews/034/779/514/original/winter-coat-icon-simple-illustration-free-vector.jpg";
  avatarImg.alt = "Avatar";
  avatarDiv.appendChild(avatarImg);

  // Create the post body
  const postBodyDiv = document.createElement("div");
  postBodyDiv.classList.add("post_body");

  // Create the post header section
  const postHeaderDiv = document.createElement("div");
  postHeaderDiv.classList.add("post_header");

  // Header Text (username and special)
  const postHeaderTextDiv = document.createElement("div");
  postHeaderTextDiv.classList.add("post_headerText");
  const headerH3 = document.createElement("h3");

  headerH3.textContent = fullName || post.username; // Fallback to username if fullName is null
  const postHeaderSpecialSpan = document.createElement("span");
  postHeaderSpecialSpan.classList.add("postHeaderSpecial");
  postHeaderSpecialSpan.textContent = ` @${post.username}`;
  headerH3.appendChild(postHeaderSpecialSpan);
  postHeaderTextDiv.appendChild(headerH3);

  // Header Description (post text)
  const postHeaderDescriptionDiv = document.createElement("div");
  postHeaderDescriptionDiv.classList.add("post_headerDescription");
  const descriptionP = document.createElement("p");
  descriptionP.textContent = post.text;
  postHeaderDescriptionDiv.appendChild(descriptionP);

  postHeaderDiv.appendChild(postHeaderTextDiv);
  postHeaderDiv.appendChild(postHeaderDescriptionDiv);

  // Footer
  const postFooterDiv = document.createElement("div");
  postFooterDiv.classList.add("post_footer");

  const commentIcon = document.createElement("i");
  commentIcon.classList.add("uil", "uil-thumbs-up");
  const repeatIcon = document.createElement("i");
  repeatIcon.classList.add("uil", "uil-thumbs-down");
  const heartIcon = document.createElement("i");
  heartIcon.classList.add("uil", "uil-heart");
  const shareIcon = document.createElement("i");
  shareIcon.classList.add("uil", "uil-share-alt");

  if (post.username === getLoginData().username) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      handleDeletePost(post._id);
    });
    postFooterDiv.appendChild(deleteButton);
  }

  postFooterDiv.appendChild(commentIcon);
  postFooterDiv.appendChild(repeatIcon);
  postFooterDiv.appendChild(heartIcon);
  postFooterDiv.appendChild(shareIcon);

  // Append everything together
  postBodyDiv.appendChild(postHeaderDiv);
  postBodyDiv.appendChild(postFooterDiv);
  postDiv.appendChild(avatarDiv);
  postDiv.appendChild(postBodyDiv);

  return postDiv;
}

async function populatePostCards(posts) {
  postList.innerHTML = "";
  for (const post of posts) {
    const postCard = await createPostCard(post);
    postList.appendChild(postCard);
  }
}

function handleDeletePost(postId) {
  const loginData = getLoginData();

  console.log("handle delete post was called");
  fetch(`${apiBaseURL}/api/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete the post.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Post deleted successfully:", data);
      window.location.reload();
    })
    .catch((error) => console.error("Error deleting post:", error));
}

async function initializePage() {
  const posts = await getPosts();
  await populatePostCards(posts);
}

initializePage();
