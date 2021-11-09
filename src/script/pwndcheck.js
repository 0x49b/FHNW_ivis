/**
 * Hi Florian,
 Here's your free API key: 918b8543267f8baceeee4eff15b2ee7d
 The API documentation can be found here: https://breachdirectory.com/api
 With the API key, users are also able to log in to the User Control Panel to use more features (the UserCP is in development and in active beta now, but it can still be used): https://breachdirectory.com/usercp
 Thanks for using the service!
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
        //getJSON(mail);
        getData(mail)
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
            });
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
    let url = `https://breachdirectory.com/api_usage?method=email&key=918b8543267f8baceeee4eff15b2ee7d&query=${mail}`
    return await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }); // parses JSON response into native JavaScript objects
}


const getJSON = (mail) => {

    let url = `https://breachdirectory.com/api_usage?method=email&key=918b8543267f8baceeee4eff15b2ee7d&query=${mail}`

    console.log(url)

    fetch(url, {mode: 'no-cors'})
        .then(response => response)
        .then(data => console.log(data))
        .catch((err) => {
            loader.style.display = 'none';
            console.error(`Some error happened => ${err}`)
            displayError(err)
        });
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



