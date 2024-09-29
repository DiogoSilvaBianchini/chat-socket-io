const socket = io()

const form = document.querySelector("#form")
const imgField = document.querySelector("#img")
const title = document.querySelector("#title")
const galery = document.querySelector("#galery")
const imgList = document.querySelector("#imgList")

let body = {
    userName: "",
    imgsUploaded: [],
    title: ""
}

window.addEventListener("load", () => {
    const userName = localStorage.getItem("userName")
    if(!userName){
        body.userName = prompt("Qual seu nome?")
        localStorage.setItem("userName", body.userName)
    }else{
        body.userName = userName
        console.log(`Bem-vindo ${userName}`)
    }

    const corAleatoria = Math.floor(Math.random() * 16777215)
    const hex = `#${corAleatoria.toString(16).padStart(6, "0")}`

    localStorage.setItem("color", hex)
})

imgField.addEventListener('change', (e) => {
    if(e.target.files){
        const render = new FileReader()
        const img = e.target.files[0]

        render.onload = (e) => {
            body.imgsUploaded.push(e.target.result)
            socket.emit("front", body)
        }

        render.readAsDataURL(img)
    }
})

title.addEventListener("keyup", (e) => body.title = e.target.value)

galery.addEventListener("mousemove", (e) => {
    const activeElements = document.querySelectorAll(".hide")

    if(e.target.id.includes("galery") && activeElements.length > 0){
        activeElements.forEach(element => {
            element.classList.add("block")
            element.classList.remove("hide")
        })
    }else{
        if(e.target.id.includes("img-")){
            let img = e.target
            let linkBtn = img.parentElement.children[1]
            linkBtn.classList.remove("block")
            linkBtn.classList.add("hide")
        }
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault()

    socket.emit("front", body)

    body.title = ""
    title.value = ""
})

socket.on("front", (msg) => {
    var templateImg;
    const color = localStorage.getItem("color")
    if(msg.imgsUploaded.length == 0){
        templateImg = `
        <li class="text">
            <span style="background: ${color}">${msg.userName}:</span>
            <span style="background: ${color}">${msg.title}</span>
        </li>`
    }

    imgList.innerHTML += templateImg
    galery.scrollTo(0, galery.scrollHeight)
})