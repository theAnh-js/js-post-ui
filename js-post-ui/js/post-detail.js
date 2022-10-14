import dayjs from "dayjs";
import postApi from "./api/postApi";
import { setTextContent, registerLightbox } from "./utils";
function renderPostDetail(post) {
  if (!post) return;
  //render title
  //render description
  //render author
  //render updateAt

  setTextContent(document, "#postDetailTitle", post.title);
  setTextContent(document, "#postDetailDescription", post.description);
  setTextContent(document, "#postDetailAuthor", post.author);
  setTextContent(
    document,
    "#postDetailTimeSpan",
    dayjs(post.updatedAt).format("DD/MM/YYYY HH:mm")
  );

  //render hero image(imageUrl)
  const heroImage = document.getElementById("postHeroImage");
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;
    heroImage.addEventListener("error", () => {
      heroImage.src = "https://via.placeholder.com/1360x400?text=Thumbnail";
    });
  }
  //render edit page link
  const editPageLink = document.getElementById("goToEditPageLink");
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = "<i class='fa fa-edit'> </i>Edit Post";
  }
}
(async () => {
  registerLightbox({
    modalId: "lightbox",
    imgSelector: 'img[data-id="lightboxImg"',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });
  try {
    //get post id from URL
    //fetch post detail API
    //render post detail

    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get("id");
    if (!postId) {
      console.log("Not Found Post Detail!");
    }

    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log("failed to fetch post detail", error);
  }
})();
