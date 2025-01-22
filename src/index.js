document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");
    let filterOn = false; 

    function loadDogs() {
        fetch("http://localhost:3000/pups")
            .then(response => response.json())
            .then(pups => {
                dogBar.innerHTML = ""; 
                pups.forEach(pup => {
                    if (!filterOn || pup.isGoodDog) { 
                        const span = document.createElement("span");
                        span.textContent = pup.name;
                        span.dataset.id = pup.id;
                        span.style.cursor = "pointer"; 
                        dogBar.appendChild(span);
                    }
                });
            });
    }

    function showDogDetails(pupId) {
        fetch(`http://localhost:3000/pups/${pupId}`)
            .then(response => response.json())
            .then(pup => {
                dogInfo.innerHTML = `
                    <img src="${pup.image}" style="width: 200px; height: 200px; border-radius: 10px;" />
                    <h2>${pup.name}</h2>
                    <button id="toggle-good-dog" data-id="${pup.id}" data-good="${pup.isGoodDog}">
                        ${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}
                    </button>
                `;
            });
    }

    function toggleGoodDog(pupId, isGoodDog) {
        fetch(`http://localhost:3000/pups/${pupId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isGoodDog: !isGoodDog })
        })
        .then(response => response.json())
        .then(updatedPup => {
            showDogDetails(updatedPup.id); 
            loadDogs(); 
        });
    }

    dogBar.addEventListener("click", (event) => {
        if (event.target.tagName === "SPAN") {
            showDogDetails(event.target.dataset.id);
        }
    });

    dogInfo.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON" && event.target.id === "toggle-good-dog") {
            const pupId = event.target.dataset.id;
            const isGoodDog = event.target.dataset.good === "true";
            toggleGoodDog(pupId, isGoodDog);
        }
    });

    filterButton.addEventListener("click", () => {
        filterOn = !filterOn;
        filterButton.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
        loadDogs(); 
    });

    loadDogs();
});
