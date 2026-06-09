const form = document.getElementById("lead-form");
const statusText = document.getElementById("form-status");
const teacherPhotos = document.querySelectorAll(".teacher-photo");
const teacherSlides = Array.from(document.querySelectorAll(".teacher-slide"));
const teacherPrev = document.getElementById("teacher-prev");
const teacherNext = document.getElementById("teacher-next");
const teacherPosition = document.getElementById("teacher-position");
const lightboxImages = Array.from(document.querySelectorAll("[data-lightbox-image]"));
const galleryTrack = document.getElementById("place-gallery-track");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");
const whatsappBaseUrl = "https://wa.me/5512992080994";

if (form && statusText) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const nome = (formData.get("nome") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const telefone = (formData.get("telefone") || "").toString().trim();
    const lote = (formData.get("lote") || "").toString().trim();
    const mensagem = (formData.get("mensagem") || "").toString().trim();

    if (!nome || !email || !telefone) {
      statusText.textContent = "Preencha nome, e-mail e WhatsApp para continuar.";
      return;
    }

    const text = [
      "Ol\u00e1, tenho interesse no segundo lote do retiro Yoga nas Montanhas por R$ 3.300,00 em at\u00e9 12x sem juros no cart\u00e3o.",
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `WhatsApp: ${telefone}`,
      `Interesse principal: ${lote || "N\u00e3o informado"}`,
      mensagem ? `Mensagem: ${mensagem}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    statusText.textContent = "Abrindo WhatsApp com sua mensagem pronta.";
    window.open(`${whatsappBaseUrl}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
}

teacherPhotos.forEach((photo) => {
  const card = photo.closest(".teacher-card");

  if (!card) {
    return;
  }

  const fallbackText = photo.dataset.fallback || card.dataset.fallback || "Foto da professora";
  card.dataset.fallback = fallbackText;

  const handleMissingPhoto = () => {
    photo.style.display = "none";
    card.classList.add("photo-missing");
  };

  photo.addEventListener("error", handleMissingPhoto);

  if (photo.complete && photo.naturalWidth === 0) {
    handleMissingPhoto();
  }
});

if (teacherSlides.length > 0 && teacherPrev && teacherNext && teacherPosition) {
  let currentTeacherIndex = 0;

  const renderTeacher = (index) => {
    teacherSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });

    teacherPosition.textContent = `${index + 1} de ${teacherSlides.length}`;
  };

  teacherPrev.addEventListener("click", () => {
    currentTeacherIndex = (currentTeacherIndex - 1 + teacherSlides.length) % teacherSlides.length;
    renderTeacher(currentTeacherIndex);
  });

  teacherNext.addEventListener("click", () => {
    currentTeacherIndex = (currentTeacherIndex + 1) % teacherSlides.length;
    renderTeacher(currentTeacherIndex);
  });

  renderTeacher(currentTeacherIndex);
}

if (galleryTrack && galleryPrev && galleryNext) {
  const scrollGallery = (direction) => {
    const firstItem = galleryTrack.querySelector("img");
    const itemWidth = firstItem ? firstItem.getBoundingClientRect().width : 220;
    galleryTrack.scrollBy({
      left: direction * (itemWidth + 16) * 2,
      behavior: "smooth",
    });
  };

  galleryPrev.addEventListener("click", () => scrollGallery(-1));
  galleryNext.addEventListener("click", () => scrollGallery(1));
}

if (lightboxImages.length > 0) {
  const lightbox = document.createElement("div");
  const lightboxImage = document.createElement("img");
  const closeButton = document.createElement("button");

  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Imagem ampliada");

  closeButton.className = "btn image-lightbox-close";
  closeButton.type = "button";
  closeButton.textContent = "Fechar";

  lightbox.append(lightboxImage, closeButton);
  document.body.appendChild(lightbox);

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    lightboxImage.removeAttribute("alt");
  };

  const openLightbox = (image) => {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Imagem ampliada";
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  lightboxImages.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `${image.alt}. Ampliar imagem`);

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}
