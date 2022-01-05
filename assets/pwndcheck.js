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


    $.ajax({
        url: `https://haveibeenpwned.com/api/v3/breachedaccount/${mail}`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("hibp-api-key", "3b229106edc4442fa64578547d9667e9")
        }, success: function (data) {
            console.log(data);
            //process the JSON data etc
        }, error: function (err) {
            console.log(err)
        }
    })


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
    pwndResults.innerText = err;
    pwndResults.className = '';
    pwndResults.classList.add('message', 'error');
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkMail(pwndMail.value);
    }
})