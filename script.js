const form = document.getElementById("lead-form");
const statusText = document.getElementById("form-status");
const teacherPhotos = document.querySelectorAll(".teacher-photo");
const teacherSlides = Array.from(document.querySelectorAll(".teacher-slide"));
const teacherPrev = document.getElementById("teacher-prev");
const teacherNext = document.getElementById("teacher-next");
const teacherPosition = document.getElementById("teacher-position");
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
      "Ol\u00e1, tenho interesse no retiro Yoga nas Montanhas.",
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
