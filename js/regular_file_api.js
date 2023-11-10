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