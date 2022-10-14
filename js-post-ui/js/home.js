import postApi from "./api/postApi";
import {
  initSearch,
  initPagination,
  renderPostList,
  renderPagination,
} from "./utils";

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params;
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    if (filterName === "title_like") url.searchParams.set("_page", 1);

    history.pushState({}, "", url);

    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList("postList", data);
    renderPagination("pagination", pagination);
  } catch (error) {
    console.log("failed to fetch post list", error);
  }
}

(async () => {
  try {
    // update query params;
    const url = new URL(window.location);

    if (!url.searchParams.get("_page")) url.searchParams.set("_page", 1);
    if (!url.searchParams.get("_limit")) url.searchParams.set("_limit", 9);

    history.pushState({}, "", url);
    const queryParams = url.searchParams;

    // attach click event for limits
    initPagination({
      elementId: "pagination",
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange("_page", page),
    });
    initSearch({
      elementId: "searchInput",
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange("title_like", value),
    });

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList("postList", data);
    renderPagination("pagination", pagination);
  } catch (error) {
    // show modal error message
    console.log("get all failed", error);
  }
})();

// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import debounce from "lodash.debounce";
// dayjs.extend(relativeTime);

// function createPostElement(post) {
//   if (!post) return;
//   //find and clone template
//   const postTemplate = document.getElementById("postTemplate");
//   if (!postTemplate) return;

//   const liElement = postTemplate.content.firstElementChild.cloneNode(true);
//   if (!liElement) return;

//   //update title, description, author, thumbnail

//   // const titleElement = liElement.querySelector("[data-id='title']");
//   // if (titleElement) titleElement.textContent = post.title;
//   setTextContent(liElement, "[data-id='title']", post.title);
//   setTextContent(
//     liElement,
//     "[data-id='description']",
//     truncatedText(post.description, 100)
//   );
//   setTextContent(liElement, "[data-id='author']", post.author);
//   // const descriptionElement = liElement.querySelector(
//   //   "[data-id='description']"
//   // );
//   // if (descriptionElement) descriptionElement.textContent = post.description;

//   // const authorElement = liElement.querySelector("[data-id='author']");
//   // if (authorElement) authorElement.textContent = post.author;

//   //calculate timeSpan
//   dayjs(post.updatedAt).fromNow();
//   // console.log("timeSpan", dayjs(post.updatedAt).fromNow());
//   setTextContent(
//     liElement,
//     "[data-id='timeSpan']",
//     `- ${dayjs(post.updatedAt).fromNow()}`
//   );

//   const thumbnailElement = liElement.querySelector("[data-id='thumbnail']");
//   if (thumbnailElement) {
//     thumbnailElement.src = post.imageUrl;
//     thumbnailElement.addEventListener("error", () => {
//       thumbnailElement.src =
//         "https://via.placeholder.com/1360x400?text=Thumbnail";
//     });
//   }

//   return liElement;
// }

// function renderPostList(postList) {
//   console.log({ postList });
//   if (!Array.isArray(postList)) return;

//   const ulElement = document.getElementById("postList");
//   if (!ulElement) return;
//   // clear current list
//   ulElement.textContent = "";

//   postList.forEach((post, index) => {
//     const liElement = createPostElement(post);
//     ulElement.appendChild(liElement);
//   });
// }

// function renderPagination(pagination) {
//   const ulPagination = document.getElementById("pagination");
//   if (!pagination || !ulPagination) return;
//   //calc totalPages
//   const { _page, _limit, _totalRows } = pagination;
//   const totalPages = Math.ceil(_totalRows / _limit);

//   // save page and otalPges to ulPagination
//   ulPagination.dataset.page = _page;
//   ulPagination.dataset.totalPages = totalPages;

//   // check if enable/disable  prev/next links
//   if (_page <= 1) ulPagination.firstElementChild?.classList.add("disabled");
//   else ulPagination.firstElementChild?.classList.remove("disabled");

//   if (_page >= totalPages)
//     ulPagination.lastElementChild?.classList.add("disabled");
//   else ulPagination.lastElementChild?.classList.remove("disabled");
// }

// function handlePrevClick(e) {
//   e.preventDefault();
//   console.log("pre");

//   const ulPagination = document.getElementById("pagination");
//   if (!ulPagination) return;
//   const page = Number.parseInt(ulPagination.dataset.page);
//   if (page <= 1) return;

//   handleFilterChange("_page", page - 1);
// }
// function handleNextClick(e) {
//   e.preventDefault();
//   console.log("next");

//   const ulPagination = document.getElementById("pagination");
//   const totalPages = ulPagination.dataset.totalPages;
//   if (!ulPagination) return;
//   const page = Number.parseInt(ulPagination.dataset.page) || 1;
//   if (page >= totalPages) return;

//   handleFilterChange("_page", page + 1);
// }

// function initPagination() {
//   //bind click event for prev/next link
//   const ulPagination = document.getElementById("pagination");
//   if (!ulPagination) return;

//   // add click event for prev link
//   const prevLink = ulPagination.firstElementChild?.firstElementChild;
//   if (prevLink) {
//     prevLink.addEventListener("click", handlePrevClick);
//   }

//   // add click event for next link
//   const nextLink = ulPagination.lastElementChild?.lastElementChild;
//   if (nextLink) {
//     nextLink.addEventListener("click", handleNextClick);
//   }
// }

// function initSearch() {
//   const searchInput = document.getElementById("searchInput");
//   if (!searchInput) return;

//   const queryParams = new URLSearchParams(window.location.search);
//   if (queryParams.get("title_like")) {
//     searchInput.value = queryParams.get("title_like");
//   }
//   const debounceSearch = debounce(
//     (event) => handleFilterChange("title_like", event.target.value),
//     500
//   );
//   //set default values from query params
//   searchInput.addEventListener("input", debounceSearch);
// }
