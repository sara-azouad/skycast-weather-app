// Lorsque la page est entièrement chargée
window.addEventListener("load", function () {
  // Vérifie si le message de bienvenue a déjà été affiché pour cette session
  if (typeof sessionStorage !== "undefined" && !sessionStorage.getItem("welcomeMessageShown")) {
    alert("WELCOME TO YOUR TRUSTED WEATHER PORTAL! 🌤️ ");
    sessionStorage.setItem("welcomeMessageShown", "true"); // Marque le message comme affiché
  }

  // Récupère le chemin de la page actuelle (ex: /meteo.html)
  const currentPage = window.location.pathname;

  // Si l'utilisateur est sur la page d'accueil météo
  if (currentPage.includes("meteo.html")) {
    const searchButton = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");

    // Vérifie que les éléments existent
    if (searchButton && cityInput) {
      // Ajoute un événement au clic sur le bouton de recherche
      searchButton.addEventListener("click", function (event) {
        const city = cityInput.value.trim(); // Supprime les espaces

        if (city === "") {
          // Alerte si l'utilisateur n’a rien saisi
          alert("select a city name !");
          event.preventDefault();
        } else {
          // Redirige vers la page de recherche avec la ville en paramètre d'URL
          window.location.href = `search.html?city=${encodeURIComponent(city)}`;
        }
      });
    }
  }
});


// === Configuration API OpenWeatherMap ===
const apiKey = "c3076c16f8a2c96369e9be00b937fec7"; // Clé API
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric"; // URL de base

// Récupère la page actuelle
const currentPage = window.location.pathname;


// === SI NOUS SOMMES SUR LA PAGE METEO.HTML ===
if (currentPage.includes("meteo.html")) {

  // Fonction qui effectue une recherche de ville
  function searchCity() {
    const cityInput = document.querySelector("input"); // L’input pour saisir la ville

    if (!cityInput) {
      alert("Champ de recherche introuvable !");
      return;
    }

    let cityName = cityInput.value.trim(); // Nettoie la saisie

    if (cityName) {
      const formattedCity = encodeURIComponent(cityName.toLowerCase());

      // Affiche dans la console pour vérification
      console.log("Redirection vers :", `search.html?city=${formattedCity}`);

      // Redirige vers la page des résultats météo
      window.location.href = `search.html?city=${formattedCity}`;
    } else {
      alert("enter a city name !");
    }
  }

  // Ajoute l'événement au clic sur le bouton
  document.querySelector(".btn").addEventListener("click", searchCity);

}


// === SI NOUS SOMMES SUR LA PAGE SEARCH.HTML ===
else if (currentPage.includes("search.html")) {
  // Récupère les paramètres de l’URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let cityName = urlParams.get("city"); // Extrait la valeur de 'city'

  // Si aucune ville n’est saisie, utilise une valeur par défaut
  if (!cityName) {
    cityName = "Casablanca";
    console.log("No city found in the URL, defaulting to Casablanca.");
  }

  console.log("Ville reçue de l’URL :", cityName);


  // Fonction asynchrone pour appeler l’API météo
  async function fetchWeather() {
    try {
      const response = await fetch(`${apiUrl}&q=${cityName}&appid=${apiKey}`);
      const data = await response.json();

      // Vérifie que la ville existe
      if (data.cod === 200) {
        // Met à jour les éléments HTML avec les données météo
        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = `Temperature : ${data.main.temp}°C`;
        document.querySelector(".humidity").textContent = `Humidity : ${data.main.humidity}%`;
        document.querySelector(".wind").textContent = `Wind : ${data.wind.speed} m/s`;

        // Alerte en cas de vent fort
        if (data.wind.speed > 3) {
          alert("⚠️ Warning: Strong winds detected in your area. Stay safe!");
        }

      } else {
        // Si la ville n’existe pas, affiche un message d’erreur
        document.querySelector(".city").textContent = "Error while retrieving weather data:";
      }

    } catch (error) {
      // En cas d'erreur réseau ou autre
      console.error("Unable to load weather data. Please check your connection.", error);
      alert("Unable to load weather data. Please check your connection.");
      document.querySelector(".city").textContent = "Data loading error!";
    }
  }

  // Appelle la fonction pour afficher les infos météo
  fetchWeather();
}
