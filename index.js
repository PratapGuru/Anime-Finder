const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  animeEl = document.getElementById("anime"),
  resultHeading = document.getElementById("result-heading"),
  single_animeEl = document.getElementById("single-anime"),
  goBackButton = document.getElementById("go-back");

//Search Anime and fetch form API
function searchAnime(e) {
  e.preventDefault();

  //Clear Single anime
  single_animeEl.innerHTML = "";

  //Get the search term
  const term = search.value;

  //Check for Empty
  if (term.trim()) {
    fetch(` https://api.jikan.moe/v4/anime?q=${term}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((item) => {
        console.log(item);
        resultHeading.innerHTML = `<h2>Search results for "${term}"</h2>`;

        if (item.data === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try Again</p>`;
        } else {
          animeEl.innerHTML = item.data
            .map((anime) => {
              return `
                <div class='anime'>
                  <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" class="anime-item-img"/>
                  <div class="anime-info" data-animeid="${anime.mal_id}">
                    <h3>${anime.title}</h3>
                  </div>
                </div> 
           `;
            })
            .join("");
        }
      });
    //Clear Search text
    search.value = "";
  } else {
    alert("Please enter something in search");
  }
}

//Fetching anime info
function fetchAnimeDetails(animeId) {
  fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((anime) => {
      console.log("Received anime details:", anime);
      const animeDetails = `
    <div>
      <h2>${anime.data.title}</h2>
      <p>${anime.data.synopsis}</p>
      <div>
        <h3>Trailer</h3>
        <a href = "${anime.data.trailer.url}">Click here to watch the trailer</a>
      </div>
      <a href="${anime.data.url}" target="_blank">More Info</a>
    </div>
    `;
      single_animeEl.innerHTML = animeDetails;
    })
    .catch((error) => {
      console.error("Error fetching anime details", error);
    });
}

//Event Listeners
submit.addEventListener("submit", searchAnime);
animeEl.addEventListener("click", (e) => {
  const animeItem = e.target.closest(".anime");

  if (animeItem) {
    const allAnimeItems = animeEl.querySelectorAll(".anime");
    allAnimeItems.forEach((item) => {
      if (item !== animeItem) {
        item.style.display = "none";
      }
    });
    single_animeEl.innerHTML = "";
    const animeId = animeItem.querySelector(".anime-info").dataset.animeid;
    fetchAnimeDetails(animeId);
  }
});
goBackButton.addEventListener("click", () => {
  const allAnimeItems = animeEl.querySelectorAll(".anime");
  allAnimeItems.forEach((item) => {
    item.style.display = "block";
  });

  single_animeEl.innerHTML = "";
  search.value = "";
  resultHeading.innerHTML = "";
  window.scrollTo(0, 0);
});
