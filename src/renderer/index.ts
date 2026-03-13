import "../index.css";
import { GhoulJSApp } from "./app/GhoulJSApp";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new GhoulJSApp());
} else {
  new GhoulJSApp();
}