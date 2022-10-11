import axiosClient from "./api/axiosClient";
import postApi from "./api/postApi";

async function main() {
  // const response = await axiosClient.get("/posts");]
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    };
    const data = await postApi.getAll(queryParams);
    console.log(data);
  } catch (error) {
    // show modal error message
    console.log("get all failed", error);
  }
}
main();
