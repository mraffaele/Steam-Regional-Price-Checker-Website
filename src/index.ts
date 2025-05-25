import { buildHtmlFormResponse } from "./buildHtmlFormResponse";
import "./index.css";

const form: HTMLFormElement = document.querySelector(".lookup") as HTMLFormElement;
const dialog = document.querySelector(".result");
if (form && dialog) {
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      /* @ts-ignore */
      dialog.close();
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    dialog.innerHTML = `<div class="loading">Loading...</div>`;
    /* @ts-ignore */
    dialog.showModal();
    //example
    // const exampleResponse = {
    //   steamId: "3017860",
    //   appType: "app",
    //   title: "DOOM: The Dark AgesDOOM: The Dark Ages",
    //   url: "https://store.steampowered.com/app/3017860/",
    //   imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3017860/header.jpg?t=1747409289",
    //   exchange: null,
    //   regions: [
    //     { regionCode: "au", price: "₽119.95" },
    //     { regionCode: "us", price: "₽69.99" },
    //     { regionCode: "uk", price: "£69.99" },
    //     { regionCode: "eu1", price: "€79.99" },
    //     { regionCode: "eu2", price: "€79.99" },
    //     { regionCode: "ru", price: "$0" },
    //   ],
    //   hits: 1,
    //   timestamp: 1748094674,
    // };
    const data = new FormData(form);
    const url = data.get("gameUrl") ?? null;

    if (!url) {
      dialog.innerHTML = `<div class="loading">Enter a valid Steam game url.</div>`;
      return;
    }

    try {
      const res = await fetch(`https://api.steamregionalprices.com/2.0/getUrl/${url}`);
      /* @ts-ignore */
      dialog.innerHTML = buildHtmlFormResponse(await res.json());
    } catch {
      dialog.innerHTML = `<div class="loading">Something went wrong.</div>`;
    }
  });
}
