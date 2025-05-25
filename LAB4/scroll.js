    const load_size = 2;
    let counter = 0;
    let all = [];
    let filtered = [];

    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const res = await fetch('product.json');
        if (!res.ok) throw new Error('load fail');
        all = await res.json();
        filtered = [...all];
        loadMore();

        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        });

        const sortRadios = document.querySelectorAll('input[name="sort"]');
        sortRadios.forEach(radio => {
          radio.addEventListener('change', handleSort);
        });
      } catch (e) {
        console.error(e);
      }
    });

    function handleSort() {
      const selectedSort = document.querySelector('input[name="sort"]:checked');
      if (!selectedSort) return;

      switch (selectedSort.value) {
        case 'name_down':
          filtered.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'name_up':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'open_down':
          filtered.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
          break;
        case 'open_up':
          filtered.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
          break;
        case 'vote_down':
          filtered.sort((a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average));
          break;
        case 'vote_up':
          filtered.sort((a, b) => parseFloat(a.vote_average) - parseFloat(b.vote_average));
          break;
      }

      refresh();
    }

    function handleSearch() {
      const searchInput = document.getElementById('searchInput');
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      if (searchTerm === '') {
        filtered = [...all];
      } 
      else {
        filtered = all.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm)
        );
      }

      refresh();
    }

    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadMore();
      }
    });

    function refresh() {
      const container = document.querySelector('.movies');
      container.innerHTML = '';
      counter = 0;
      
      loadMore();
    }

    function loadMore() {
      if (counter >= filtered.length) return;

      const nextBatch = filtered.slice(counter, counter + load_size);
      nextBatch.forEach(renderMovie);
      counter += load_size;
    }

    function renderMovie(movie) {
      const container = document.querySelector('.movies');
      const div = document.createElement('div');
      div.className = 'movie';
      div.innerHTML = `
        <div class="image-container">
          <div class="hidden">
            <p>${movie.overview}</p>
          </div>
          <img src="${movie.image}" alt="${movie.title}" width="300" height="400">
        </div>
        <div class="info">
          <span class="h10" style="text-align: center;">${movie.title}</span>
          <span class="h11">${movie.release_date}</span>
          <span class="h11">${movie.vote_average}</span>
        </div>
      `;
      container.appendChild(div);
    }