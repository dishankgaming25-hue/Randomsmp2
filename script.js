"use strict";

/*
 * Edit your server details here.
 */
const SITE_CONFIG = {
  serverHost: "Randomsmp.softhost.pro",
  bedrockPort: "19186",
  discordUrl: "https://discord.gg/YvMmBxmG5"
};

const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function getCopyValue(type) {
  if (type === "bedrock") {
    return `${SITE_CONFIG.serverHost}:${SITE_CONFIG.bedrockPort}`;
  }

  return SITE_CONFIG.serverHost;
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for local files and browsers without Clipboard API access.
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = text;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    const copied = document.execCommand("copy");
    temporaryInput.remove();
    return copied;
  } catch {
    return false;
  }
}

function setSiteDetails() {
  document.querySelectorAll("[data-server-host]").forEach((element) => {
    element.textContent = SITE_CONFIG.serverHost;
  });

  document.querySelectorAll("[data-server-port]").forEach((element) => {
    element.textContent = SITE_CONFIG.bedrockPort;
  });

  document.querySelectorAll("[data-discord-link]").forEach((element) => {
    element.href = SITE_CONFIG.discordUrl;
  });

  const year = document.querySelector("#current-year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = getCopyValue(button.dataset.copy);
      const copied = await copyText(value);

      if (copied) {
        showToast(`Copied ${value} to clipboard!`);
      } else {
        showToast(`Copy this address: ${value}`);
      }
    });
  });
}

function setupMobileNavigation() {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");

  if (!menuButton || !navigation) return;

  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("open");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu"
    );
    navigation.classList.toggle("open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });
}

function setupFaq() {
  const faqItems = document.querySelectorAll(".faq-item");

  // Keep the FAQ tidy by allowing one answer to be expanded at a time.
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) otherItem.open = false;
      });
    });
  });
}

setSiteDetails();
setupCopyButtons();
setupMobileNavigation();
setupFaq();
