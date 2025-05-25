import { ApiResponseWithTimeAgo, ApiResponseRegion } from "./addExamples";

export const buildHtmlFormResponse = (data: ApiResponseWithTimeAgo | null): string => {
  if (data === null) return "";
  const buildSingleRegion = (region: ApiResponseRegion) => {
    return `<div class="app__region">
        <img class="app__flag" src="./assets/flags/${region.regionCode}.png" alt="${region.regionCode} flag" width="16" height="11" />
        <span class="app__cost">${region.price}</span>
    </div>`;
  };

  return `
    <article class="app">
        <div class="app__image">
          <a href="${data.url}" target="_blank">
            <img src="${data.imageUrl}" alt="${data.title} image" loading="lazy" />
          </a>
        </div>
        <h1 class="app__title"><a href="${data.url}" target="_blank">${data.title}</a></h1>
        <div class="app__regions">
            ${data.regions.map(buildSingleRegion).join("")}
        </div>
        ${data.when ? `<div class="app__updated">Checked: ${data.when}</div>` : ""}
    </article>
  `;
};
