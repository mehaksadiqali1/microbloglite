"use strict";

// Function to create Twitter-like post cards
function makeTwitterCard(posts) {
  posts.forEach((post) => {
    let postElement = document.createElement("div");
    postElement.className = "post";

    let postAvatar = document.createElement("div");
    postAvatar.className = "post_avatar";
    let imageProfile = document.createElement("img");
    imageProfile.src = post.userImage || "";
    postAvatar.appendChild(imageProfile);

    let postBody = document.createElement("div");
    postBody.className = "post_body";

    let postHeader = document.createElement("div");
    postHeader.className = "post_header";

    let postHeaderText = document.createElement("div");
    postHeaderText.className = "post_headerText";

    let postUsername = document.createElement("h3");
    postUsername.innerText = post.name || "Anonymous";
    postHeaderText.appendChild(postUsername);

    postHeader.appendChild(postHeaderText);

    let headerDesc = document.createElement("p");
    headerDesc.innerText = post.text || "";

    postBody.appendChild(postHeader);
    postBody.appendChild(headerDesc);

    postElement.appendChild(postAvatar);
    postElement.appendChild(postBody);

    // Append the complete post to the feed
    let feed = document.querySelector(".feed"); // Ensure this element exists in your HTML
    if (feed) {
      feed.appendChild(postElement);
    } else {
      console.error("Feed container not found!");
    }
  });
}

async function createAPost(newPost, loginData) {
  try {
    const response = await fetch(
      "http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify(newPost),
      }
    );

    const data = await response.json();
    console.log("Post created successfully:", data);
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

const samplePosts = [
  {
    userImage: "https://example.com/image1.jpg",
    name: "John Doe",
    text: "This is a sample post!",
  },
  {
    userImage: "https://example.com/image2.jpg",
    name: "Jane Doe",
    text: "Hello, world!",
  },
];

const loginData = {
  token: "your_api_token_here",
};

const newPost = {
  text: "This is a new post created via API!",
};

document.addEventListener("DOMContentLoaded", () => {
  makeTwitterCard(samplePosts);
  createAPost(newPost, loginData);
});
