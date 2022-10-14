import { setTextContent, truncatedText } from "./common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function createPostElement(post) {
  if (!post) return;
  //find and clone template
  const postTemplate = document.getElementById("postTemplate");
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  //update title, description, author, thumbnail

  // const titleElement = liElement.querySelector("[data-id='title']");
  // if (titleElement) titleElement.textContent = post.title;
  setTextContent(liElement, "[data-id='title']", post.title);
  setTextContent(
    liElement,
    "[data-id='description']",
    truncatedText(post.description, 100)
  );
  setTextContent(liElement, "[data-id='author']", post.author);
  // const descriptionElement = liElement.querySelector(
  //   "[data-id='description']"
  // );
  // if (descriptionElement) descriptionElement.textContent = post.description;

  // const authorElement = liElement.querySelector("[data-id='author']");
  // if (authorElement) authorElement.textContent = post.author;

  //calculate timeSpan
  dayjs(post.updatedAt).fromNow();
  // console.log("timeSpan", dayjs(post.updatedAt).fromNow());
  setTextContent(
    liElement,
    "[data-id='timeSpan']",
    `- ${dayjs(post.updatedAt).fromNow()}`
  );

  const thumbnailElement = liElement.querySelector("[data-id='thumbnail']");
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;
    thumbnailElement.addEventListener("error", () => {
      thumbnailElement.src =
        "https://via.placeholder.com/1360x400?text=Thumbnail";
    });
  }

  const divElement = liElement.firstElementChild;
  if (divElement) {
    divElement.addEventListener("click", (event) => {
      // if event is triggered from menu ---> ignore
      const menu = liElement.querySelector('[data-id="menu"]');
      if (menu && menu.contains(event.target)) return;
      // redirect to url
      window.location.assign(`/post-detail.html?id=${post.id}`);
    });
  }
  // add click event for edit button
  const editButton = liElement.querySelector('[data-id="edit"]');
  if (editButton) {
    editButton.addEventListener("click", (e) => {
      // prevent event bubbling to parent
      // e.stopPropagation();
      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }
  return liElement;
}

export function renderPostList(elementId, postList) {
  console.log({ postList });
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;
  // clear current list
  ulElement.textContent = "";

  postList.forEach((post, index) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
