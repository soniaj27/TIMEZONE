// getting refrences of all html elements...
const userCont1 = document.querySelector(".user-time-info");
const userCont2 = document.querySelector(".user-address-info");
const resultBox = document.querySelector(".user-by-address");
const error = document.querySelector(".error");

// IIIF function it's automatically called
(function getCurrentTimezone() {
    if (navigator.geolocation) {
        // pass by as a callback function...
        navigator.geolocation.getCurrentPosition(showCurrentTimezone);
    } else {
        error.innerHTML = 'Geolocation is not supported by this browser.';
    }
}());

function showCurrentTimezone(currentPosition) {
    const latitude = currentPosition.coords.latitude;
    const longitude = currentPosition.coords.longitude;

    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=23cc2c6ecec44c51bf1c77ab6ba17bec`;

    fetch(url)
        .then(response => response.json())
        .then(res => {

            let html = `
                <p class="time-zone">Name of Time Zone: ${res.results[0].timezone.name}</p>
                <div>
                    <p class="latitude">Lat: ${res.results[0].lat}</p>
                    <p class="longitude">Long: ${res.results[0].lon}</p>
                </div>
                <p class="STD-seconds">Offset STD Seconds: ${res.results[0].timezone.offset_STD_seconds}</p>
                <p class="DST">Offset DST: ${res.results[0].timezone.offset_DST}</p>
                <p class="DST-seconds">offset DST Seconds: ${res.results[0].timezone.offset_DST_seconds}</p>
                <p class="country">Country: ${res.results[0].country}</p>
                <p class="postcode">Postcode: ${res.results[0].postcode}</p>
                <p class="city">City: ${res.results[0].city}</p>
        `;

            userCont1.innerHTML = html;

        })
        .catch(err => resultBox.style.display = err);
}


function fetchDetailsByAdress() {
    let address = document.querySelector("#address").value;

    // Address validation here..
    if (address.trim() === "") {
        error.innerHTML = "Please Enter City name";
        resultBox.style.display = 'none';
        document.querySelector("#address").value = "";
        return;
    }
    if (!validateAddress(address)) {
        error.innerHTML = "Please Enter a valid Address";
        resultBox.style.display = 'none';
        document.querySelector("#address").value = "";
        return;
    }

    // Convert address to coordinates using geocoding API
    const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=23cc2c6ecec44c51bf1c77ab6ba17bec`;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(res => {

            const latitude = res.features[0].properties.lat;
            const longitude = res.features[0].properties.lon;
            
            const timezoneUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=23cc2c6ecec44c51bf1c77ab6ba17bec`;

            fetch(timezoneUrl)
                .then(response => response.json())
                .then(res => {

                    resultBox.style.display = 'block';
                    error.innerHTML = "";
                    document.querySelector("#address").value = "";

                    let html = `
                    <p class="time-zone">Name of Time Zone: ${res.results[0].timezone.name}</p>
                    <div>
                        <p class="latitude">Lat: ${res.results[0].lat}</p>
                        <p class="longitude">Long: ${res.results[0].lon}</p>
                    </div>
                    <p class="STD-seconds">Offset STD Seconds: ${res.results[0].timezone.offset_STD_seconds}</p>
                    <p class="DST">Offset DST: ${res.results[0].timezone.offset_DST}</p>
                    <p class="DST-seconds">offset DST Seconds: ${res.results[0].timezone.offset_DST_seconds}</p>
                    <p class="country">Country: ${res.results[0].country}</p>
                    <p class="postcode">Postcode: ${res.results[0].postcode}</p>
                    <p class="city">City: ${res.results[0].city}</p>
                `;

                    userCont2.innerHTML = html;

                })
                .catch(() => {
                    // Display the error message for timezone retrieval
                    error.textContent = 'Error retrieving timezone.';
                    resultBox.style.display = 'none';
                    document.querySelector("#address").value = "";
                });
        })
        .catch(() => {
            resultBox.style.display = 'none';
            error.innerHTML = `An error occurred while geocoding the address: Please Enter Valid City`;
            document.querySelector("#address").value = "";
        });
}

function validateAddress(address) {
    var addressPattern = /^[a-zA-Z0-9\s\.,#'-]+$/;
    if (addressPattern.test(address)) {
        return true;
    } else {
        return false;
    }
}

document.querySelector('#btn')
.addEventListener('click', fetchDetailsByAdress);