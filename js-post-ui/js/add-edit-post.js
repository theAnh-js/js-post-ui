import postApi from "./api/postApi";
import { initPostForm, toast } from "./utils";

function removeUnusedField(formValues) {
  const payload = { ...formValues };

  if (payload.imageSource === "upload") {
    delete payload.imageUrl;
  } else {
    delete payload.image;
  }

  delete payload.imageSource;

  if (!payload.id) delete payload.id;
  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();
  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }
  return formData;
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedField(formValues);
    const formData = jsonToFormData(payload);
    // throw new Error("error from testing");
    // //check add/edit mode
    // let savePost = null;
    // if (formValues.id) {
    //   savePost = await postApi.update(formValues);
    // } else {
    //   savePost = await postApi.add(formValues);
    // }

    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);
    // call API
    // show success message
    toast.success("Save post successfully!");

    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    console.log("failed to save post", error);
    toast.error(`Error: ${error.message}`);
  }
}
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get("id");
    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: "",
          description: "",
          author: "",
          imageUrl: "",
        };
    // console.log("postid: " + postId);
    // console.log("mode", postId ? "edit" : "add");
    // console.log("defaultValues:", defaultValues);

    initPostForm({
      formId: "postForm",
      defaultValues,
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log("failed to fetch post details: " + error);
  }
})();
