/**
 * Um auf dem Localhost zu testen muss der local-cors-proxy Proxy installiert werden mit npm install -g local-cors-proxy.
 * Starten mit lcp --proxyUrl https://haveibeenpwned.com
 */

const pwndMail = document.getElementById("pwndMail");
const mailInvalid = document.getElementById("mailInvalid")
const loader = document.getElementById("loader");
const pwndResults = document.getElementById("pwndResults");


const isValidEmail = (val) => {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEmail.test(val);
}

const checkMail = (mail) => {
    if (isValidEmail(mail)) {
        console.log(mail);
        mailInvalid.style.display = 'none';
        loader.style.display = "inline-block";
        resetResults();

        getData(mail)
            .then(data => {
                loader.style.display = 'none';
                parseResponse(data);
            })
            .catch(err => {
                loader.style.display = 'none';
                if (String(err).includes("JSON.parse")) {
                    displaySuccess();
                } else {
                    displayError(err);
                }
            });
    } else {
        mailInvalid.style.display = 'inline-block';
        loader.style.display = 'none';
        resetResults()
    }
}

const resetResults = () => {
    pwndResults.innerText = '';
    pwndResults.innerHTML = '';
    pwndResults.className = '';
}

async function getData(mail) {
    let url = `https://haveibeenpwned.com/api/v3/breachedaccount/${mail}`;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        url = `http://localhost:8010/proxy/api/v3/breachedaccount/${mail}`;
    }

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'hibp-api-key': '3b229106edc4442fa64578547d9667e9'
        }
    });
    return response.json()
}

const parseResponse = (data) => {
    pwndResults.innerHTML = '<div> <b>Wir haben Ihre E-Mail Adresse in folgenden Dataleaks gefunden:</b></br></br>';
    data.forEach((it, idx) => {
        if (idx < data.length - 1) {
            pwndResults.innerHTML += `${it.Name}, `;
        } else {
            pwndResults.innerHTML += `${it.Name}`;
        }
    })
    pwndResults.innerHTML += "</div>";
    pwndResults.className = '';
    pwndResults.classList.add('message', 'warning');
}

const displaySuccess = () => {
    pwndResults.innerHTML = `Wir haben keine Einträge in den Dataleaks gefunden.`;
    pwndResults.className = '';
    pwndResults.classList.add('message', 'success');
}

const displayError = (err) => {
    pwndResults.innerText = err + "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,";
    pwndResults.className = '';
    pwndResults.classList.add('message', 'error');
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkMail(pwndMail.value);
    }
})