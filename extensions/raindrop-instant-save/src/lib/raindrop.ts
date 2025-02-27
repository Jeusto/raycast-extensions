import fetch from "node-fetch";
import { getPreferenceValues } from "@raycast/api";
import { isValidURL } from "./utils";

const API_URL = "https://api.raindrop.io/rest/v1";

export async function addBookmark(url: string) {
  if (!isValidURL(url)) {
    throw new Error("Invalid URL");
  }

  const preferences = getPreferenceValues();
  const TOKEN = preferences["token"];

  try {
    const response = await fetch(`${API_URL}/raindrop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        link: url,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to add bookmark to Raindrop: ${error}`);
  }
}

export async function uploadFileToRaindrop(url: string) {}

export async function addBookmarkToCollection(url: string, collection: number) {
  console.log(collection);
  console.log(url);

  // if (!isValidURL(url)) {
  //   throw new Error("Invalid URL");
  // }

  const preferences = getPreferenceValues();
  const TOKEN = preferences["token"];

  try {
    const response = await fetch(`${API_URL}/raindrop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        link: url,
        collection: {
          _id: collection,
        },
        items: [
          {
            link: url,
            collectionId: collection,
          },
        ],
        pleaseParse: {},
      }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(`Failed to add bookmark to Raindrop: ${error}`);
  }
}
