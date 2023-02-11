let topUrl = "";

window.addEventListener("message", async event => {
    const inputType = isInput(event.data);
    let url = cutCommand(event.data);
    if (inputType === true) {
        window.navigator.serviceWorker.register('./sw.js', {
            scope: __uv$config.prefix
        }).then(() => {
            if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
            else if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;
            try {
                await registerSW()
            } catch (err) {
                throw err;
            };
            location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
        });
    } else if (inputType === false) {
        topUrl = url;
    } else /* null */ {
        throw "Message invalid";
    }
});

// returns true if input, false if command for the webpage, and null if neither
function isInput(val){
    const commandString = val.substr(0, val.indexOf(':'));
    if (commandString == "input") {
        return true;
    } else if (commandString == "topUrl") {
        return false;
    } else {
        return null;
    }
}

// cuts the command prefix from the window message
function cutCommand(val) {
    let i = val.indexOf(':');
    i++;
    return val.substr(i);
}

function isUrl(val = '') {
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
}
