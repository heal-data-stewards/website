import axios from "axios";
import { gridColumnsTotalWidthSelector } from "@material-ui/data-grid";

export function getStrapiURL(path) {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://api.healdatafair.org"
  }${path}`;
}

// Helper to make GET requests to Strapi
export async function fetchAPI(path, options = {}) {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  const requestUrl = getStrapiURL(path);
  const response = await fetch(requestUrl, mergedOptions);

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`An error occured please try again`);
  }
  const data = await response.json();
  return data;
}

/**
 *
 * @param {object} params The router params object with slug: { slug: [<slug>] }
 * @param {string} locale The current locale specified in router.locale
 * @param {boolean} preview router isPreview value
 */
export async function getPageData(params, locale, preview) {
  const slug = params.slug.join("/");
  // Find the pages that match this slug
  const pagesData = await fetchAPI(
    `/pages?slug=${slug}&_locale=${locale}&status=published${
      preview ? "&status=draft" : ""
    }`
  );

  // Make sure we found something, otherwise return null
  if (pagesData == null || pagesData.length === 0) {
    return null;
  }

  // Return the first item since there should only be one result per slug
  return pagesData[0];
}

// Get site data from Strapi (metadata, navbar, footer...)
export async function getGlobalData(locale) {
  const global = await fetchAPI(`/global?_locale=${locale}`);
  return global;
}

// Get site data from Strapi (users)
export async function getAllUsers(locale) {
  const users = await fetchAPI(`/users`);
  return users;
}

export async function getStrapiApiPageData(slug) {
  const pageData = await getPageData({ slug: [slug] }, "en", false);
  return pageData;
}

export async function passwordReset(code, myNewPassword, myNewPasswordConfirm) {
  const path = "/auth/reset-password";
  const requestUrl = getStrapiURL(path);

  // Request API.
  const response = axios
    .post(requestUrl, {
      code: code,
      password: myNewPassword,
      passwordConfirmation: myNewPasswordConfirm,
    })
    .then((response) => {
      // Handle success.
      console.log(response);
      return response;
    })
    .catch((error) => {
      // Handle error.
      console.log("An error occurred:", error.response);
      return error.response;
    });

  return response;
}

export async function forgottenPassword(email) {
  const path = "/auth/forgot-password";
  const pwResetPath = "/admin/plugins/users-permissions/auth/reset-password";
  const requestUrl = getStrapiURL(path);
  // Request API.
  const response = axios
    .post(requestUrl, {
      email: email,
      url: pwResetPath,
    })
    .then((response) => {
      // Handle success.
      return response;
    })
    .catch((error) => {
      // Handle error.
      return error.response;
    });

  return response;
}
