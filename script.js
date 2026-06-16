const body = document.body;
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const typingText = document.getElementById("typingText");
const heroParticles = document.getElementById("heroParticles");
const heroSpotlight = document.getElementById("heroSpotlight");
const loader = document.getElementById("loader");
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const filterChips = document.querySelectorAll(".filter-chip");
const skillCards = document.querySelectorAll(".skill-card");
const skillFills = document.querySelectorAll(".skill-meter__fill");
const revealItems = document.querySelectorAll("[data-reveal]");
const navLinks = document.querySelectorAll(".site-nav a");
const counters = document.querySelectorAll("[data-counter]");
const tiltItems = document.querySelectorAll("[data-tilt]");
const spotlightItems = document.querySelectorAll("[data-surface]");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const openModalButtons = document.querySelectorAll(".open-modal");
const projectModal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalDescription = document.getElementById("modalDescription");
const modalHighlights = document.getElementById("modalHighlights");
const modalCloseTargets = document.querySelectorAll("[data-close-modal]");
const contactForm = document.getElementById("contactForm");
const clearFormButton = document.getElementById("clearForm");
const formStatus = document.getElementById("formStatus");
const sendMessageButton = contactForm?.querySelector('button[type="submit"]');

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

const typingWords = [
  "Full Stack Developer",
  "Software Engineer",
  "Java Builder",
  "Responsive UI Crafter",
  "Cloud Computing Enthusiast"
];

const projectDetails = {
  inertia: {
    eyebrow: "Voice Interaction Project",
    title: "INERTIA - Virtual Assistant",
    description:
      "INERTIA focuses on conversational browser interaction with voice recognition and speech output, turning a static interface into a more natural assistant-like experience.",
    highlights: [
      "Built around real-time speech recognition and text-to-speech responses.",
      "Uses browser-native APIs to create an accessible and interactive flow.",
      "Shows strength in user-centric experimentation and frontend logic."
    ]
  },
  results: {
    eyebrow: "Academic Management Project",
    title: "University Result Application",
    description:
      "This application streamlines result publication and academic record management with a structured Java web stack and database-driven backend flow.",
    highlights: [
      "Combines Java, JSP, Servlets, JDBC, MySQL, and Maven.",
      "Organizes secure academic information through structured server-side logic.",
      "Highlights backend discipline, data flow thinking, and practical software engineering."
    ]
  }
};

body.classList.add("is-loading");

const setScrollProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
  backToTop.classList.toggle("is-visible", scrollTop > 420);
};

const toggleMenu = () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
};

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});

const startTypingEffect = () => {
  if (!typingText) {
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const currentWord = typingWords[wordIndex];
    const visibleText = currentWord.slice(0, charIndex);
    typingText.textContent = visibleText;

    if (!isDeleting && charIndex < currentWord.length) {
      charIndex += 1;
      setTimeout(type, 90);
      return;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, 1300);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(type, 45);
      return;
    }

    isDeleting = false;
    wordIndex = (wordIndex + 1) % typingWords.length;
    setTimeout(type, 280);
  };

  type();
};

const buildParticles = () => {
  if (!heroParticles || prefersReducedMotion) {
    return;
  }

  const particleCount = 30;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const size = Math.random() * 10 + 4;
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--duration", `${Math.random() * 12 + 12}s`);
    particle.style.setProperty("--delay", `${Math.random() * -12}s`);
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    heroParticles.appendChild(particle);
  }
};

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.counter || 0);
      const duration = 1400;
      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);
        element.textContent = `${value}`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = `${target}`;
        }
      };

      requestAnimationFrame(animate);
      observer.unobserve(element);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const animateSkillBars = () => {
  skillFills.forEach((fill) => {
    const parentCard = fill.closest(".skill-card");

    if (!parentCard || parentCard.classList.contains("is-hidden")) {
      fill.style.width = "0%";
      return;
    }

    fill.style.width = `${fill.dataset.level || 0}%`;
  });
};

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter || "all";

    filterChips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");

    skillCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || filter === category;
      card.classList.toggle("is-hidden", !shouldShow);
    });

    window.setTimeout(animateSkillBars, 100);
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const activeLink = document.querySelector(`.site-nav a[href="#${id}"]`);

      if (entry.isIntersecting && activeLink) {
        navLinks.forEach((link) => link.classList.remove("is-active"));
        activeLink.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

const applyTilt = (event, item) => {
  if (prefersReducedMotion) {
    return;
  }

  const rect = item.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rotateX = ((y / rect.height) - 0.5) * -10;
  const rotateY = ((x / rect.width) - 0.5) * 10;

  item.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
};

tiltItems.forEach((item) => {
  item.addEventListener("mousemove", (event) => applyTilt(event, item));
  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

spotlightItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    item.style.setProperty("--spotlight-x", `${x}%`);
    item.style.setProperty("--spotlight-y", `${y}%`);
  });
});

const magneticButtons = document.querySelectorAll(".magnetic");

magneticButtons.forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    if (prefersReducedMotion) {
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

const handleHeroParallax = (event) => {
  if (prefersReducedMotion) {
    return;
  }

  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;

  heroSpotlight.style.setProperty("--pointer-x", `${x}%`);
  heroSpotlight.style.setProperty("--pointer-y", `${y}%`);

  parallaxItems.forEach((item) => {
    const depth = Number(item.dataset.parallax || 18);
    const moveX = ((x - 50) / 50) * (depth / 9);
    const moveY = ((y - 50) / 50) * (depth / 11);
    item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
};

document.addEventListener("pointermove", handleHeroParallax);

if (!isTouchDevice) {
  const cursorPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPosition = { x: cursorPosition.x, y: cursorPosition.y };

  document.addEventListener("pointermove", (event) => {
    cursorPosition.x = event.clientX;
    cursorPosition.y = event.clientY;
  });

  const renderCursor = () => {
    ringPosition.x += (cursorPosition.x - ringPosition.x) * 0.18;
    ringPosition.y += (cursorPosition.y - ringPosition.y) * 0.18;

    cursorDot.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate(${ringPosition.x}px, ${ringPosition.y}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  };

  renderCursor();

  const hoverTargets = document.querySelectorAll("a, button, input, textarea, .service-card, .project-card, .social-card");

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      cursorDot.classList.add("is-hover");
      cursorRing.classList.add("is-hover");
    });
    target.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("is-hover");
      cursorRing.classList.remove("is-hover");
    });
  });
}

const openProjectModal = (key) => {
  const details = projectDetails[key];

  if (!details) {
    return;
  }

  modalEyebrow.textContent = details.eyebrow;
  modalTitle.textContent = details.title;
  modalDescription.textContent = details.description;
  modalHighlights.innerHTML = "";

  details.highlights.forEach((highlight) => {
    const item = document.createElement("span");
    item.textContent = highlight;
    modalHighlights.appendChild(item);
  });

  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");
};

const closeProjectModal = () => {
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");
};

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => openProjectModal(button.dataset.project));
});

modalCloseTargets.forEach((target) => {
  target.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});

const validateField = (field) => {
  const wrapper = field.closest(".form-field");
  const errorElement = wrapper?.querySelector(".form-error");
  let message = "";

  if (!field.value.trim()) {
    message = "This field is required.";
  } else if (field.type === "email") {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    if (!isValidEmail) {
      message = "Enter a valid email address.";
    }
  }

  wrapper?.classList.toggle("is-error", Boolean(message));
  if (errorElement) {
    errorElement.textContent = message;
  }

  return !message;
};

const clearFormState = () => {
  contactForm.querySelectorAll(".form-field").forEach((field) => field.classList.remove("is-error"));
  contactForm.querySelectorAll(".form-error").forEach((error) => {
    error.textContent = "";
  });
};

const setFormBusy = (isBusy) => {
  if (sendMessageButton) {
    sendMessageButton.disabled = isBusy;
    sendMessageButton.textContent = isBusy ? "Sending..." : "Send Message";
  }

  if (clearFormButton) {
    clearFormButton.disabled = isBusy;
  }
};

["input", "blur"].forEach((eventName) => {
  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener(eventName, () => validateField(field));
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFormState();
  formStatus.textContent = "";
  formStatus.className = "form-status";

  const fields = Array.from(contactForm.querySelectorAll("input, textarea"));
  const isValid = fields.every((field) => validateField(field));

  if (!isValid) {
    formStatus.textContent = "Please fix the highlighted fields and try again.";
    formStatus.classList.add("is-error");
    return;
  }

  const formElements = contactForm.elements;
  const payload = {
    name: formElements.namedItem("name").value.trim(),
    email: formElements.namedItem("email").value.trim(),
    subject: formElements.namedItem("subject").value.trim(),
    message: formElements.namedItem("message").value.trim()
  };

  setFormBusy(true);

  fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(async (response) => {
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : { message: "Unexpected server response." };

      if (!response.ok) {
        throw new Error(data.message || "Unable to send your message right now.");
      }

      formStatus.textContent = data.message || "Message sent successfully.";
      formStatus.classList.add("is-success");
      contactForm.reset();
    })
    .catch((error) => {
      formStatus.textContent = error.message || "Unable to connect to the contact service.";
      formStatus.classList.add("is-error");
    })
    .finally(() => {
      setFormBusy(false);
    });
});

clearFormButton.addEventListener("click", () => {
  contactForm.reset();
  clearFormState();
  formStatus.textContent = "Form cleared.";
  formStatus.className = "form-status";
});

window.addEventListener("scroll", setScrollProgress, { passive: true });
window.addEventListener("resize", setScrollProgress);

window.addEventListener("load", () => {
  setScrollProgress();
  buildParticles();
  startTypingEffect();
  animateSkillBars();

  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    body.classList.remove("is-loading");
  }, prefersReducedMotion ? 60 : 700);
});
