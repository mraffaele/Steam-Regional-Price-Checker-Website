import { buildHtmlFormResponse } from "./buildHtmlFormResponse";

const fs = require("fs");
const path = require("path");

const EXAMPLES: SteamApp[] = [
  { type: "app", id: 1328670 },
  { type: "app", id: 782330 },
  { type: "app", id: 3017860 },
  { type: "app", id: 678950 },
  { type: "app", id: 292030 },
  { type: "app", id: 1174180 },
];

type SteamAppType = "app" | "sub";
type SteamApp = { type: SteamAppType; id: number };

export type ApiResponseRegion = {
  regionCode: "au" | "us" | "uk" | "eu1" | "eu2" | "ru";
  price: string;
};
type ApiResponse = {
  steamId: string;
  appType: SteamAppType;
  title: string;
  url: string;
  imageUrl: string;
  regions: ApiResponseRegion[];
  timestamp: number;
};

export type ApiResponseWithTimeAgo = ApiResponse & { when?: string };

const formatDate = (unixTimestamp: number): string => {
  const date = new Date(unixTimestamp * 1000);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  return `${month} ${day}`;
};

const addCurrencySymbol = ({ regionCode, price }: ApiResponseRegion): ApiResponseRegion => {
  let priceWithSymbol;
  switch (regionCode) {
    case "uk":
      priceWithSymbol = `£${price}`;
      break;
    case "eu1":
      priceWithSymbol = `€${price}`;
      break;
    case "eu2":
      priceWithSymbol = `€${price}`;
      break;
    case "ru":
      priceWithSymbol = `₽${price}`;
      break;
    case "au":
    case "us":
    default:
      priceWithSymbol = `₽${price}`;
      break;
  }
  return { regionCode, price: priceWithSymbol };
};

const parseResponse = async (response: Response): Promise<ApiResponseWithTimeAgo> => {
  const json = (await response.json()) as unknown as ApiResponse;
  return { ...json, when: formatDate(json.timestamp), regions: json.regions.map(addCurrencySymbol) };
};

const fetchSingle = async ({ type, id }: SteamApp): Promise<ApiResponseWithTimeAgo | null> => {
  try {
    const res = await fetch(`https://api.steamregionalprices.com/2.0/get/${type}/${id}/`);
    const parsed = await parseResponse(res);
    return parsed || null;
  } catch {
    return null;
  }
};

const insertIntoIndexFile = (newHtml: string) => {
  const filePath = path.join(__dirname, "index.html");

  fs.readFile(filePath, "utf8", (err: unknown, html: String) => {
    if (err) return console.error("Read error:", err);

    const updated = html.replace(
      /<section id="examples">[\s\S]*?<\/section>/,
      `<section id="examples">${newHtml}</section>`
    );

    fs.writeFile(filePath, updated, "utf8", (err: unknown) => {
      if (err) return console.error("Write error:", err);
      console.log("Content inserted.");
    });
  });
};

// const exampleResponse: ApiResponseWithTimeAgo = {
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
//   when: "May 24",
// } as ApiResponseWithTimeAgo;

(async () => {
  const results = await Promise.all(EXAMPLES.map(fetchSingle));
  const html = results.map(buildHtmlFormResponse).join("");
  insertIntoIndexFile(html);
})();
