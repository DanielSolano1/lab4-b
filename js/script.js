document.addEventListener("DOMContentLoaded", async function () {
    document.querySelector('#zipcode').addEventListener("change", display);
    let statesAbrv = 'https://csumb.space/api/allStatesAPI.php';
    let response = await fetch(statesAbrv);
    let states = await response.json();

    for (let state of states) {
        let option = document.createElement('option');
        // option.id = state.state;
        option.value = state.usps;
        option.innerHTML = state.usps;
        document.querySelector('#state').appendChild(option);

    }

    document.querySelector('#username').addEventListener("change", checkUsername);
    document.querySelector("#passwordBox").addEventListener("click", suggestPassword);
    document.querySelector('#state').addEventListener("change", getCounties);
    document.querySelector('#submit').addEventListener("click", checkForm);

});


async function getCounties(selectedCounty = null) {
    let state = document.querySelector('#state').value;
    let countyAbv = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(countyAbv);
    let counties = await response.json();

    let countySelect = document.querySelector('#county');
    countySelect.innerHTML = ''; 

    // Add default 'None' option
    let defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerHTML = 'None';
    countySelect.appendChild(defaultOption);

    for (let county of counties) {
        let option = document.createElement('option');
        option.value = county.county;
        option.innerHTML = county.county;
        countySelect.appendChild(option);
    }

    // Ensure selected county is properly set
    if (selectedCounty && counties.some(c => c.county === selectedCounty)) {
        countySelect.value = selectedCounty;
    } else {
        countySelect.value = '';
    }

    // Ensure dropdown text is updated
    countySelect.dispatchEvent(new Event('change'));
}


async function display() {
    let zipcode = document.querySelector('#zipcode').value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipcode}`;

    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    if (data.city === undefined) {
        document.querySelector('#zipcode').value = "Zipcode not found";
        document.querySelector('#zipcode').style.color = "red";
        return;
    }
    document.querySelector('#zipcode').style.color = "black";

    document.querySelector('#city').value = data.city;
    document.querySelector('#state').value = data.state;
    document.querySelector('#latitude').innerHTML = data.latitude;
    document.querySelector('#longitude').innerHTML = data.longitude;

    await getCounties(data.county);
}

async function suggestPassword (){
    let url = "https://csumb.space/api/suggestedPassword.php?length=8";
    let response = await fetch(url);
    let newPassword = await response.json();
    console.log(newPassword);
    let suggestedPasswordAlert = document.querySelector('#suggestedPasswordAlert');

    suggestedPasswordAlert.textContent = `Suggested Password: ${newPassword.password}`;
}

async function checkUsername() {

    let username = document.querySelector('#username');
    let takenUsernames = `https://csumb.space/api/usernamesAPI.php?username=${username.value}`;
    let response2 = await fetch(takenUsernames);
    let taken = await response2.json();

    console.log(taken);

    if (!taken.available) {
        document.querySelector('#alert1').innerHTML = "Username is taken";
        document.querySelector('#alert1').style.color = "red";
        return false;
    } else {
        document.querySelector('#alert1').innerHTML = "Username is available";
        document.querySelector('#alert1').style.color = "green";
        return true;
    }
}

async function checkForm(){
    event.preventDefault();
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#passwordBox').value;
    let retypePassword = document.querySelector('#passwordBox2').value;
    let isValid = true;

    document.querySelector('#alert1').innerHTML = "";
    document.querySelector('#alert2').innerHTML = "";


    if (username.length < 3 & !checkUsername()){ 
        document.querySelector('#alert1').innerHTML = "Username must be at least 3 characters and username is taken";
        document.querySelector('#alert1').style.color = "red";
        isValid = false;
    } else if(username.length < 3){
        document.querySelector('#alert1').innerHTML = "Username must be at least 3 characters";
        document.querySelector('#alert1').style.color = "red";
        isValid = false;
    }else{
        let usernameAvailable = await checkUsername();
        if (!usernameAvailable) {
            isValid = false;
        }
    }

    if(password.length < 6){
        document.querySelector('#alert2').innerHTML = "Password must be at least 6 characters";
        document.querySelector('#alert2').style.color = "red";
        isValid = false;
    }
    if(password !== retypePassword){
        document.querySelector('#alert2').innerHTML = "Passwords do not match";
        document.querySelector('#alert2').style.color = "red";
        isValid = false;
    }
    if (isValid) {
        document.querySelector('#alert1').innerHTML = "Congratulations! Your form has been submitted!";
        document.querySelector('#alert1').style.color = "green";
    //this refreshes the page
    }
}