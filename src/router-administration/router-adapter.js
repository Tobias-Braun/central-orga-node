const axios = require('axios');
const appConfig = require('../../dist/config/dev')
const login_url = "http://192.168.178.1/login_sid.lua"
const data_url = "http://192.168.178.1/data.lua"
const username = "fritz7554"
const password = appConfig.routerPassword

let config = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
}
console.log(config)

let response = {}
axios
    .get(login_url)
    .then(async res => {
        response = res
        console.log(`statusCode: ${res.status}`);
        console.log(res.data);
        let parser = require("fast-xml-parser")
        let xmlParser = new parser.XMLParser()
        let data = xmlParser.parse(response.data)
        let challenge = data.SessionInfo.Challenge
        let reply = challenge + "-" + password
        let md5 = require("md5")
        let hash = md5(Buffer.from(reply, 'utf16le'))

        let loginUrl = new URL(login_url)
        loginUrl.searchParams.append("response", challenge + "-" + hash)
        loginUrl.searchParams.append("username", username)
        let loginRes = await axios.get(loginUrl.href)
        console.log(loginRes.data)
        let sid = xmlParser.parse(loginRes.data).SessionInfo.SID
        console.log("sid", sid)

        let postUrl = new URL(data_url)
        postUrl.searchParams.append("xhr", "1")
        postUrl.searchParams.append("lang", "de")
        postUrl.searchParams.append("urllist", "bild.de\nweb.de\nfaz.de\nfaz.net\nwww.faz.net")
        postUrl.searchParams.append("listtype", "black")
        postUrl.searchParams.append("apply", "")
        postUrl.searchParams.append("sid", sid)
        postUrl.searchParams.append("lang", "de")
        postUrl.searchParams.append("page", "kids_blacklist")
        let postRes = await axios.post(data_url, postUrl.searchParams.toString(), config)
        console.log(postRes.status, postRes.data)

    })
    .catch(error => {
        console.error(error);
    });