export * from "./DisplayDesignSystem.js";

export function designSystemURL() {
  const params = new URLSearchParams(window.location.search);
  return params.has("system");
}
