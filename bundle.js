(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const toBuffer = require("it-to-buffer")

// input text
const COMMON_INPUT_TXT = document.getElementById("common-input-txt");

//mkdir
const mkdirButton = document.getElementById("mkdir");
mkdirButton.addEventListener("click", async () => {
    const resultDiv = document.getElementById("mkdir-result");
    resultDiv.innerText = "디렉토리 생성 중";
    await ipfs.files.mkdir(`/${COMMON_INPUT_TXT.value}`, {parents: true})
    resultDiv.innerText = "디렉토리 생성 완료";
})

//stats
const statButton = document.getElementById("stat");
statButton.addEventListener("click", async () => {
    const resultDiv = document.getElementById("stat-result");
    try {
        const stats = await ipfs.files.stat(`/${COMMON_INPUT_TXT.value}`)
        console.log(stats)
        resultDiv.innerText = stats.cid.toString();
    }catch{
        alert("No File or Directory Existed")
    }
})

// ls
const mt_lsButton = document.getElementById("mt-ls");
mt_lsButton.addEventListener("click", async () => {
    const resultDiv = document.getElementById("mt-ls-result");
    resultDiv.innerText = "";
    try {
        for await (const file of ipfs.files.ls(`/${COMMON_INPUT_TXT.value}`)) {
            resultDiv.innerText += `${file.name}\n`;
        }
    }catch{
        alert("No File or Directory Existed")
    }
})

// rm
const rmButton = document.getElementById("rm");
rmButton.addEventListener("click", async () => {
    const resultDiv = document.getElementById("rm-result");
    try {
        // recursive catch no error for exist file
        await ipfs.files.rm(`/${COMMON_INPUT_TXT.value}`, {recursive: true})
        resultDiv.innerText = `${COMMON_INPUT_TXT.value} deleted`;
    }catch{
        alert("No File or Directory Existed")
    }
})

// cp
const cpButton = document.getElementById("cp");
cpButton.addEventListener("click", async () => {
    const toDir = document.getElementById("cp-to");
    const resultDiv = document.getElementById("cp-result");
    try {
        if (!toDir.value) throw Error;
        await ipfs.files.cp(`/${COMMON_INPUT_TXT.value}`, `/${toDir.value}/`)
        resultDiv.innerText = `${COMMON_INPUT_TXT.value} is copied to ${toDir.value}`;
    }catch{
        alert("No File or Directory Existed")
    }
})

// mv
const mvButton = document.getElementById("mv");
mvButton.addEventListener("click", async () => {
    const toDir = document.getElementById("mv-to");
    const resultDiv = document.getElementById("mv-result");
    try {
        if (!toDir.value) throw Error;
        await ipfs.files.mv(`/${COMMON_INPUT_TXT.value}`, `/${toDir.value}/`)
        resultDiv.innerText = `${COMMON_INPUT_TXT.value} is moved to ${toDir.value}`;
    }catch{
        alert("No File or Directory Existed")
    }
})

// write
const writeButton = document.getElementById("write");
writeButton.addEventListener("click", async () => {
    const contentFile = document.getElementById("write-to").files;
    console.log(contentFile)
    const file = contentFile[0]
    const resultDiv = document.getElementById("write-result");
    try {
        // if (!toDir.value) throw Error;
        await ipfs.files.write(`/${COMMON_INPUT_TXT.value}/${file.name}`, file, {parents: true, create: true})
        resultDiv.innerText = `Success to write contents`;
    }catch(error){
        console.log(error)
        alert("No File or Directory Existed")
    }
})

// read
const readButton = document.getElementById("read");
readButton.addEventListener("click", async () => {
    const contentType = document.getElementById("mt-content-type").value;
    const resultDiv = document.getElementById("read-result");
    try {
        // if (!toDir.value) throw Error;
        const chunks = [];
        for await ( const chunk of ipfs.files.read(`/${COMMON_INPUT_TXT.value}`)){
            chunks.push(chunk);
        }
        const content = await toBuffer(chunks);
        switch (contentType) {
            case "TEXT":
                resultDiv.innerText = `Success to read contents
                ${new TextDecoder().decode(content)}`;
                break;
            case "IMAGE":
                const img = document.createElement("img");
                img.src = `data:image/png;base64,${toBase64(content)}`
                img.width = "300"
                resultDiv.append(img);
                break;
            default:
                break;
        }

    }catch(error){
        console.log(error)
        alert("No File or Directory Existed")
    }
})


},{"it-to-buffer":3}],2:[function(require,module,exports){
const toBuffer = require("it-to-buffer")
// connect to ipfs daemon API server
// const ipfs = create('http://localhost:5001') // (the default in Node.js)

// // or connect with multiaddr
// const ipfs = create('/ip4/127.0.0.1/tcp/5001')

// // or using options
// const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' })

// // or specifying a specific API path
// const ipfs = create({ host: '1.1.1.1', port: '80', apiPath: '/ipfs/api/v0' })

/* global ipfs, toBuffer */


// cat image contents
const showImgContent = async (contentCID) => {
    const content = await ipfs.cat(`/ipfs/${contentCID}`);
    console.log(content);
    const fileContents = await toBuffer(content);
    console.log(fileContents);

    const div = document.getElementById("cat-result");
    div.innerText = "";
    const img = document.createElement("img");
    img.src = `data:image/png;base64,${toBase64(fileContents)}`
    img.width = "300"
    const info = document.createElement("span")
    info.innerText = `CID = /ipfs/${contentCID}`;
    div.append(img)
    div.append(info)
        // return message
}

const showTxtContent = async (contentCID) => {
    const content = await ipfs.cat(`/ipfs/${contentCID}`);
    console.log(content);
    const fileContents = await toBuffer(content);
    console.log(fileContents);

    const div = document.getElementById("cat-result");
    div.innerText = "";
    const h3 = document.createElement("h3");
    contentString = new TextDecoder().decode(fileContents);
    h3.innerText = contentString;
    // textArea.width = 200;
    const info = document.createElement("span")
    info.innerText = `CID = /ipfs/${contentCID}`;
    div.append(h3)
    div.append(info)
        // return message
}

const catButton = document.getElementById("cat");
catButton.addEventListener("click", async() => {
    const cid = document.getElementById("cid-path").value;
    const contentType = document.getElementById("content-type").value;
    switch (contentType) {
        case "TEXT":
            showTxtContent(cid);
            break;
        case "IMAGE":
            showImgContent(cid);
            break;
        default:
            break;
            }
        })
// add
const addButton = document.getElementById("add");
addButton.addEventListener("click", async () => {
    const inputFile = document.getElementById("files");
    const files = inputFile.files;
    // const result = await all(ipfs.addAll(files))
    
    // or using for await...of loop
    // const result = []
    
    // for await (const resultPart of ipfs.addAll(files)) {
    //  result.push(resultPart)
    // }
    
    // or when uploading one file
    const file = files[0]

    const result = await ipfs.add({
        path: file.name,
        content: file
    });
    const div = document.getElementById("add-result");
    div.innerText = "";
    const spanInfo = document.createElement("span");
    spanInfo.innerText = "path: " + result.path;
    div.append(spanInfo);
    console.log(result);
})

// addAll
const addAllButton = document.getElementById("add-all");
addAllButton.addEventListener("click", async () => {
    const inputFile = document.getElementById("files");
    const files = inputFile.files;
    // const result = await all(ipfs.addAll(files))
    console.log(files.item(0));
    const fileObjectsArray = Array.from(files).map((file) => {
        return {
            path: file.name,
            content: file
        }
    })
    // or using for await...of loop
    const result = []
    
    for await (const resultPart of ipfs.addAll(fileObjectsArray, {wrapWithDirectory: true})) {
        result.push(resultPart)
    }

    const div = document.getElementById("add-result");
    div.innerText = "";
    const spanInfo = document.createElement("span");
    const directoryCID = result[result.length - 1].cid;
    spanInfo.innerText = "results\n" + result.map((CID, i) => `${i+1}. ${CID.path}`).join('\n') + directoryCID.toString();
    div.append(spanInfo);

    console.log(result);
    console.log(directoryCID.toString());
    lsResult(directoryCID);
})

// ls
const lsResult = async (directoryCID) => {
    const result = [];

    console.log("파일 가져오는 중");
    for await (const resultPart of ipfs.ls(directoryCID)) {
        result.push(resultPart);
    }

    console.log("파일 가져오기 완료")
    const div = document.getElementById("ls-result");
    div.innerText = "";
    const spanInfo = document.createElement("span");

    spanInfo.innerText = `ls of Directory (${directoryCID})
    ${result.map((file) => `파일명: ${file.name} Path: ${file.path} CID: ${file.cid.toString()}`).join("\n")}`;
    div.append(spanInfo);

    console.log(result);
}

const lsButton = document.getElementById("ls");
lsButton.addEventListener("click", () => {
    const dirCIDPath = document.getElementById("cid-dir-path").value;
    lsResult(dirCIDPath);
})

// get
const getResult = async (directoryCID) => {
    const result = [];
    const div = document.getElementById("get-result");
    div.innerText = "";

    console.log("파일 가져오는 중");
    for await (const resultPart of ipfs.get(directoryCID)) {
        result.push(resultPart);
        
        // const img = document.createElement("img");
        // img.src = `data:image/png;base64,${toBase64(resultPart)}`
        // img.width = "150"
        // div.append(img);
    }
    // const spanInfo = document.createElement("span");

    // spanInfo.innerText = `get of Directory (${directoryCID})
    // ${result.map((file) => `파일명: ${file.name} Path: ${file.path} CID: ${file.cid}`).join("\n")}`;
    // div.append(spanInfo);
    const fileContents = await toBuffer(result);
    console.log(fileContents)
    console.log(result);
}

const getButton = document.getElementById("get");
getButton.addEventListener("click", () => {
    const dirCIDPath = document.getElementById("cid-root-dir-path").value;
    getResult(dirCIDPath);
})
},{"it-to-buffer":3}],3:[function(require,module,exports){
'use strict'

const { concat: uint8ArrayConcat } = require('uint8arrays/concat')

/**
 * Takes an (async) iterable that yields buffer-like-objects and concats them
 * into one buffer
 * @param {AsyncIterable<Uint8Array>|Iterable<Uint8Array>} stream
 */
async function toBuffer (stream) {
  let buffer = new Uint8Array(0)

  for await (const buf of stream) {
    buffer = uint8ArrayConcat([buffer, buf], buffer.length + buf.length)
  }

  return buffer
}

module.exports = toBuffer

},{"uint8arrays/concat":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function concat(arrays, length) {
  if (!length) {
    length = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output = new Uint8Array(length);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return output;
}

exports.concat = concat;

},{}]},{},[1,2]);
