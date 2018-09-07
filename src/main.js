import db from './firebaseConfig';

(function(){
    const apiKey =  'a4c22d76';
    const searchField = document.querySelector('input[name="search"]');
    const output = document.querySelector('#output ul');
    let searchTerm;

    searchField.addEventListener('input', async function() {
        const imdb =  await import('imdb-api');

        searchTerm = this.value;
        closeAllLists();
        if(!searchTerm) {
            output.innerHTML = '';
            return;
        }
        if(searchTerm.length >= 3) {
            imdb.search({name: searchTerm}, {apiKey: apiKey})
            .then((movie) => {
                movie.results.forEach(searchResult => {
                    //console.log(searchResult.imdbRating);
                    output.innerHTML +=
                    `<li class="search-results">
                        <div class="details">
                            <p id="movieTitle">${searchResult.title}</p>
                            <p id="movieYear">${searchResult.year}</p>
                        </div>
                        <img id="moviePoster" src="${searchResult.poster}" alt="${searchResult.title}">
                    </li>`
                    }
                );
            }).catch(console.log);
        }
    });

    function closeAllLists(elmnt = '') {
        // @TODO search needs more work

        let x = document.querySelectorAll(".search-results");
        for(let i = 0; i < x.length; i++) {
            let list = x[i].querySelector('p').innerHTML;
            if( list.indexOf(searchTerm) == -1 ) {
               x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.querySelector('ul').addEventListener('click', function(e) {
        //addMovie(movie.title, movie.poster);
        console.log(e.target);
        if(e.target.matches('li')){
            let title = document.querySelector('#movieTitle').innerHTML;
            let poster = document.querySelector('#moviePoster').getAttribute('src');

            if(title !== null || title !== undefined) {
                addMovie(title, poster);
            }
        }
    }, true);

    function addMovie(name, poster){
        /*db.collection('test').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().name === name) {
                    console.error(`Movie ${name} already in database`);
                    return;
                }
            });
        });*/
        db.collection("test").doc(name).set({
            name: name,
            poster: poster
        })
        .then(function(doc) {
            console.log("Document written with Name: ", doc);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    db.collection('test')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = {
                    'poster': doc.data().poster,
                    'name': doc.data().name
                }
                console.table(data);
            })
        })
})();
