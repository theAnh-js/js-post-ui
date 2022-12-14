import {
  setBackgroundImage,
  setFieldValue,
  setTextContent,
  randomNumber,
} from "./common";
import * as yup from "yup";

const imageSource = {
  PICSUM: "picsum",
  UPLOAD: "upload",
};
function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl); //hidden field
  setBackgroundImage(document, "#postHeroImage", formValues?.imageUrl);
}

function getFormValues(form) {
  const formValues = {};

  //S1: query each input and add to values object
  //   ["title", "author", "description", "imageUrl"].forEach((name) => {
  //     const field = form.querySelector(`[name="${name}"]`);
  //     if (field) formValues[name] = field.value;
  //   });

  //S2: using form data;
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  return formValues;
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required("Please enter title"),
    author: yup
      .string()
      .required("Please enter author")
      .test(
        "at-least-two-words",
        "Please enter at least two words",
        (value) =>
          value.split(" ").filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required("Please select an image source")
      .oneOf([imageSource.PICSUM, imageSource.UPLOAD], "Invalid image source"),
    imageUrl: yup.string().when("imageSource", {
      is: imageSource.PICSUM,
      then: yup
        .string()
        .required("Please random a background image")
        .url("Please enter a valid URL"),
    }),
    image: yup.mixed().when("imageSource", {
      is: imageSource.UPLOAD,
      then: yup
        .mixed()
        .test("required", "Please select an image to upload", (file) =>
          Boolean(file?.name)
        )
        .test("max-3mb", "The image is too large(max 3mb)", (file) => {
          const fileSize = file?.size || 0;
          return fileSize <= 3 * 1024 * 1024; //3mb
        }),
    }),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, ".invalid-feedback", error);
  }
}
async function validatePostForm(form, formValues) {
  try {
    //reset previous errors
    ["title", "author", "imageUrl", "image"].forEach((name) =>
      setFieldError(form, name, "")
    );

    // start validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};
    if (error.name === "ValidationError" && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        //ignore if the field is already logged
        if (errorLog[name]) continue;

        //set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  //add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add("was-validated");
  return isValid;
}

async function validateFormField(form, formValues, name) {
  try {
    //clear previous error
    setFieldError(form, name, "");

    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFieldError(form, name, error.message);
  }

  //show validaton error (if any)
  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add("was-validated");
  }
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = "Saving...";
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = "Save";
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById("postChangeImage");
  if (!randomButton) return;

  randomButton.addEventListener("click", () => {
    //random ID,
    //build URL
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/800`;

    // set imageUrl input + background
    setFieldValue(form, '[name="imageUrl"]', imageUrl);
    setBackgroundImage(document, "#postHeroImage", imageUrl);
  });
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll("[data-id='imageSource']");
  controlList.forEach((control) => {
    // console.log(control.dataset.imageSource);
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImageSourse(form) {
  const radioList = form.querySelectorAll("[name='imageSource']");
  radioList.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      // console.log(event.target.value);
      renderImageSourceControl(form, event.target.value);
    });
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector("[name='image']");
  if (!uploadImage) return;

  uploadImage.addEventListener("change", (event) => {
    //get selected file
    // preview file;
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(document, "#postHeroImage", imageUrl);
      validateFormField(
        form,
        {
          imageSource: imageSource.UPLOAD,
          image: file,
        },
        "image"
      );
    }
  });
}

function initValidationOnChange(form) {
  ["title", "author"].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) {
      field.addEventListener("input", (event) => {
        const newValue = event.target.value;
        validateFormField(form, { [name]: newValue }, name);
      });
    }
  });
}
export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitting = false;
  setFormValues(form, defaultValues);

  //init events
  initRandomImage(form);
  initRadioImageSourse(form);
  initUploadImage(form);
  initValidationOnChange(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitting) return;
    showLoading(form);
    submitting = true;

    //get form values
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;
    // validation
    // if valid trigger submit callback
    // otherwise, show validation error
    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);

    //always hide loading no matter form is valid or not
    hideLoading(form);
    submitting = false;
  });
}
