const navbar = document.querySelector(".navbar");
const navMenu = navbar.querySelector(".nav-menu");
const navLinks = navMenu.querySelectorAll(".nav-link");
const hamburger = navbar.querySelector(".hamburger");
const mainContent = document.querySelector("main");
const mainMenu = mainContent.querySelector(".main-menu");
const tagsMenu = document.querySelector("#tags-menu");
const tagsMenuButton = document.querySelector("#tags-menu-button");
const footer = document.querySelector(".footer");

function toggleMenu(menuToggle, menu) {
    menuToggle.classList.toggle("active");
    menu.classList.toggle("active");
}

async function fadeElements(sleepDurationMs, ...elements) {
    if (!elements[0].classList.contains("hidden")) {
        elements.forEach((element) => {
            element.classList.toggle("fade-visibility");
        });
        await sleep(sleepDurationMs);
        elements.forEach((element) => {
            element.classList.toggle("hidden");
        });
    } else {
        elements.forEach((element) => {
            element.classList.toggle("hidden");
        });
        await sleep(sleepDurationMs);
        elements.forEach((element) => {
            element.classList.toggle("fade-visibility");
        });
    }
}

function makeElementsRelative(...elements) {
    elements.forEach((element) => {
        element.classList.toggle("relative");
    });
}

// Drop-down navbar menu

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

hamburger.addEventListener("click", toggleNavMenu);

function toggleNavMenu() {
    toggleMenu(hamburger, navMenu);
    fadeElements(350, mainContent, footer);
    makeElementsFixed(navbar);
}

// Highlight current page in navbar

function isVisible(element) {
    const elementRect = element.getBoundingClientRect();

    return (
        elementRect.top >= 0 &&
        elementRect.left >= 0 &&
        elementRect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        elementRect.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
}

function getLastUrlPathPart(url) {
    const urlParts = url.split("/");

    // Trailing slash in URL cause empty string as last element
    let urlLastPart = urlParts[urlParts.length - 1];
    if (!urlLastPart) {
        urlLastPart = urlParts[urlParts.length - 2];
    }

    return urlLastPart;
}

function highlightCurrentPageNavLink() {
    const url = location.href;
    const currentPage = getLastUrlPathPart(url);

    for (i = 0; i < navLinks.length; i++) {
        const navLinkUrl = navLinks[i].href;
        const navLinkDestination = getLastUrlPathPart(navLinkUrl);

        if (navLinkDestination === currentPage) {
            navLinks[i].classList.add("current");
        }
    }
}

if (isVisible(navMenu)) {
    highlightCurrentPageNavLink();
}

// Blog post tags menu

if (tagsMenuButton) {
    tagsMenuButton.addEventListener("click", toggleTagsMenu);

    async function toggleTagsMenu() {
        await fadeElements(150, mainMenu, footer);
        toggleMenu(tagsMenuButton, tagsMenu);
        makeElementsFixed(navbar);
    }
}

// Copy snippet

function findPreviousNode(element) {
    let previousNode = element.previousSibling;

    while (previousNode.tagName === undefined) {
        previousNode = previousNode.previousSibling;
    }
    return previousNode;
}

async function copyContent(button) {
    const contentNode = findPreviousNode(button);

    const range = document.createRange();
    range.setStart(contentNode, 0);
    range.setEnd(button, 0);
    const selection = window.getSelection();

    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("copy");

    await sleep(350);
    selection.removeAllRanges();
}
