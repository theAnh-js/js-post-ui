import postApi from "./api/postApi";
import { initPostForm, toast } from "./utils";

async function handlePostFormSubmit(formValues) {
  console.log("submit from parent", formValues);

  try {
    // throw new Error("error from testing");
    // //check add/edit mode
    // let savePost = null;
    // if (formValues.id) {
    //   savePost = await postApi.update(formValues);
    // } else {
    //   savePost = await postApi.add(formValues);
    // }

    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);
    // call API
    // show success message
    // redirect to detail page
    toast.success("Save post successfully!");
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
