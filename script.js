const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector(".sr-only").textContent = open ? "Sulje valikko" : "Avaa valikko";
});

function closeNav() {
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.querySelector(".sr-only").textContent = "Avaa valikko";
}

const views = {
  "#ruokalista": "is-menu",
  "#juomat": "is-drinks",
};

function openView(className) {
  document.body.classList.remove("is-menu", "is-drinks");
  document.body.classList.add(className);
  closeNav();
  window.scrollTo(0, 0);
}

function closeViews(hash) {
  document.body.classList.remove("is-menu", "is-drinks");
  closeNav();
  if (!hash || hash === "#etusivu") {
    window.scrollTo(0, 0);
    return;
  }
  const target = document.querySelector(hash);
  if (target) target.scrollIntoView();
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (views[hash]) {
      event.preventDefault();
      openView(views[hash]);
      history.pushState(null, "", hash);
      return;
    }
    const overlayOpen = document.body.classList.contains("is-menu") || document.body.classList.contains("is-drinks");
    if (overlayOpen) {
      event.preventDefault();
      closeViews(hash);
      if (hash && hash !== "#sisalto") history.pushState(null, "", hash);
    } else {
      closeNav();
    }
  });
});

const paivaKentta = document.querySelector('input[name="paiva"]');
const tanaan = new Date();
const kuukausi = String(tanaan.getMonth() + 1).padStart(2, "0");
const pv = String(tanaan.getDate()).padStart(2, "0");
paivaKentta.min = `${tanaan.getFullYear()}-${kuukausi}-${pv}`;

const form = document.querySelector("#varauslomake");
const status = document.querySelector("#varausviesti");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nimi = String(data.get("nimi") || "").trim();
  const paiva = String(data.get("paiva") || "");
  const aika = String(data.get("aika") || "");
  const puhelin = String(data.get("puhelin") || "").trim();
  const henkilot = String(data.get("henkilot") || "");

  if (!nimi || !paiva || !aika || !puhelin) {
    status.hidden = false;
    status.classList.add("is-error");
    status.textContent = "Täytä nimi, päivä, kellonaika ja puhelinnumero.";
    return;
  }

  const valittu = new Date(`${paiva}T${aika}`);
  const nyt = new Date();
  nyt.setHours(0, 0, 0, 0);
  if (Number.isNaN(valittu.getTime()) || valittu < nyt) {
    status.hidden = false;
    status.classList.add("is-error");
    status.textContent = "Valitse tuleva päivä ja kellonaika.";
    return;
  }

  if (valittu.getDay() === 1) {
    status.hidden = false;
    status.classList.add("is-error");
    status.textContent = "Ravintola on maanantaisin suljettu. Valitse toinen päivä.";
    return;
  }

  const paivaTeksti = valittu.toLocaleDateString("fi-FI");
  status.hidden = false;
  status.classList.remove("is-error");
  status.textContent = `Kiitos, ${nimi}! Varauspyyntö ${henkilot} hengelle ${paivaTeksti} klo ${aika} on vastaanotettu. Vahvistamme sen numeroon ${puhelin}.`;
  form.reset();
});
