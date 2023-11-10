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

