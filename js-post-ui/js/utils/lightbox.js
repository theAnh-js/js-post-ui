function showModal(modalElement) {
  if (!window.bootstrap) return;

  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function registerLightbox({
  modalId,
  imgSelector,
  prevSelector,
  nextSelector,
}) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  //check if this modal is registered or Not
  if (Boolean(modalElement.dataset.registered)) return;

  // selectors
  const imageElement = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imageElement || !prevButton || !nextButton) return;

  //lightbox var
  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src;
  }

  document.addEventListener("click", (event) => {
    const { target } = event;
    if (target.tagName !== "IMG" || !target.dataset.album) return;

    imgList = document.querySelectorAll(
      `img[data-album="${target.dataset.album}"]`
    );
    currentIndex = [...imgList].findIndex((x) => x === target);
    console.log({ target, currentIndex, imgList });

    showImageAtIndex(currentIndex);
    showModal(modalElement);
  });

  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImageAtIndex(currentIndex);
  });

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    showImageAtIndex(currentIndex);
  });

  // mart this modal is already registered
  modalElement.dataset.registered = "true";
}
