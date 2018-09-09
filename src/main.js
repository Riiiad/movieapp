(function(){

    const app = {
        apiKey:  'a4c22d76',
        searchField: document.querySelector('input[name="search"]'),
        output: document.querySelector('#output ul'),
        list:  document.querySelector('#list ul'),
        loader: document.querySelector('.loader'),
        btnShow: document.querySelector('#btnShow')
    };

    let searchTerm = '';
    let firebaseDB;

    app.searchField.addEventListener('keydown', async function(e) {
        let imdb = await import('imdb-api');

        searchTerm = this.value;

        /**Close/Delete open list so new can be opened*/
        closeAllLists();

        if(!searchTerm) {
            app.output.innerHTML = '';
            return;
        }

        if(searchTerm.length >= 3  && e.key !== "Backspace") {
            imdb.search({name: searchTerm}, {apiKey: app.apiKey})
            .then((movie) => {
                movie.results.forEach(searchResult => {
                    //console.log(searchResult.imdbRating);
                    app.output.innerHTML +=
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

    function closeAllLists(elmnt) {
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
        if(e.target.matches('li')){
            let title = document.querySelector('#movieTitle').innerHTML;
            let poster = document.querySelector('#moviePoster').getAttribute('src');

            if(title !== null || title !== undefined) {
                addMovie(title, poster);
            }
        }
    }, true);

    async function addMovie(name, poster){
        firebaseDB = await import('firebase/app');
        await import('./firebaseConfig');
        /***db.collection('test').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().name === name) {
                    console.error(`Movie ${name} already in database`);
                    return;
                }
            });
        });***/

        firebaseDB.firestore()
            .collection("movie_database")
            .doc(name).set({
                name: name,
                poster: poster
        })
        .then(function(doc) {
            console.log("Document written with Name: ", doc);
            app.btnShow.classList.remove('disabled');
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    app.btnShow.addEventListener('click', async () => {
        app.btnShow.classList.add('disabled');
        app.loader.classList.add('show');
        //await import('./firebaseConfig');
        firebaseDB = await import('firebase/app');
        await import('./firebaseConfig');
        app.list.innerHTML = '';
        firebaseDB.firestore()
            .collection("movie_database")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    listUpdate(doc.data().name, doc.data().poster);
                });
        })

        setTimeout(() => {
            app.loader.classList.remove('show');
        }, 500);

    });

    window.addEventListener('click', (e) => {
        if(e.target.id == 'btnDelete') {
            console.log(e.target.getAttribute('data-item'));
            btnDelete(e.target.getAttribute('data-item'));
        }
    });

    function listUpdate(name, poster) {
        let listElement = document.createElement('li');
        listElement.innerHTML = `
            <div id="btnEdit">Edit</div>
            <div id="btnDelete" data-item="${name}">Delete</div>
            <div class="search-results">
                <div class="details">
                    <p id="movieTitle">${name}</p>
                    <p id="movieYear">empty if offline</p>
                </div>
                <img id="moviePoster" src="${poster}" alt="${name}">
            </div>`;
        app.list.appendChild(listElement);
    }

    function btnDelete(name) {
        // Remove the doc with 'name' field from the document
        firebaseDB.firestore()
            .collection("movie_database")
            .doc(name)
            .delete();
        console.log('Item ' + name + ' deleted');
        btnShow.classList.remove('disabled');
    }

})();
