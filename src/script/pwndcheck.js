/**
 * Hi Florian,
 Here's your free API key: 918b8543267f8baceeee4eff15b2ee7d
 The API documentation can be found here: https://breachdirectory.com/api
 With the API key, users are also able to log in to the User Control Panel to use more features (the UserCP is in development and in active beta now, but it can still be used): https://breachdirectory.com/usercp
 Thanks for using the service!
 3b229106edc4442fa64578547d9667e9
 */

const pwndMail = document.getElementById("pwndMail");
const pwndButton = document.getElementById("searchPwndMail");
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
        /*getData(mail)
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
            });*/
        getJSON(mail)
    } else {
        mailInvalid.style.display = 'inline-block';
        loader.style.display = 'none';
    }
}


const resetResults = () => {
    pwndResults.innerText = '';
    pwndResults.innerHTML = '';
    pwndResults.className = '';
}


async function getData(mail) {
    let url = `https://haveibeenpwned.com/api/v3/breachedaccount/${mail}`
    return await fetch(url, {
        method: 'GET',
        headers: {
            'hibp-api-key': '3b229106edc4442fa64578547d9667e9'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }); // parses JSON response into native JavaScript objects
}


const getJSON = (mail) => {

    let url = `https://haveibeenpwned.com/api/v3/breachedaccount/${mail}`

    let xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.setRequestHeader('hibp-api-key', '3b229106edc4442fa64578547d9667e9');
    xhr.send();
    // 4. This will be called after the response is received
    xhr.onload = function () {
        if (xhr.status != 200) { // analyze HTTP status of the response
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else { // show the result
            alert(`Done, got ${xhr.response.length} bytes`); // response is the server response
        }
    };

    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            alert(`Received ${event.loaded} of ${event.total} bytes`);
        } else {
            alert(`Received ${event.loaded} bytes`); // no Content-Length
        }

    };

    xhr.onerror = function () {
        alert("Request failed");
    };

}

const parseResponse = () => {

}

const displayError = (err) => {
    pwndResults.innerText = err;
    pwndResults.className = '';
    pwndResults.classList.add('error');
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkMail(pwndMail.value);
    }
})

pwndButton.addEventListener('click', () => {
    checkMail(pwndMail.value);
});



