const socket = io()

const form = document.querySelector("#form")
const imgField = document.querySelector("#img")
const title = document.querySelector("#title")
const galery = document.querySelector("#galery")
const imgList = document.querySelector("#imgList")
const colorMessage = document.querySelector("#colorMessage")
const settingsForm = document.querySelector("#settingsForm")
const settingsWindow = document.querySelector("#settingsWindow")
const color = localStorage.getItem("color")

let body = {
    id: "",
    userName: "",
    imgsUploaded: [],
    title: "",
    color: color
}

const generateRandomColorHex = () => {
    const corAleatoria = Math.floor(Math.random() * 16777215)
    const hex = `#${corAleatoria.toString(16).padStart(6, "0")}`
    return hex
}

window.addEventListener("load", () => {
    const userName = localStorage.getItem("userName")
    const color = localStorage.getItem("color")
    const id = localStorage.getItem("id")

    if(!userName){
        body.userName = prompt("Qual seu nome?")
        localStorage.setItem("userName", body.userName)
    }else{
        body.userName = userName
        console.log(`Bem-vindo ${userName}`)
    }

    if(!color){
        const newColor = generateRandomColorHex()
        localStorage.setItem("color", newColor)
    }

    if(!id){
        localStorage.setItem("id", `userId-${Math.floor(Math.random() * 1E6)}`)
    }else{
        body.id = id
        console.log(id)
    }
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
    const activeElements = document.querySelectorAll(".visible")

    if(e.target.id.includes("galery") && activeElements.length > 0){
        activeElements.forEach(element => {
            element.classList.add("block")
            element.classList.remove("visible")
        })
    }else{
        if(e.target.id.includes("img-")){
            let img = e.target
            let linkBtn = img.parentElement.children[1]
            linkBtn.classList.remove("block")
            linkBtn.classList.add("visible")
        }
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault()

    if(body.title){
        socket.emit("front", body)
    }

    body.title = ""
    title.value = ""
})

settingsForm.addEventListener("submit", (e) => {
    e.preventDefault()
})

const visibleWindowConfig = () => {
    settingsWindow.classList.add("visible")
    settingsWindow.classList.remove("block")
}

const hideWindonw = () => {
    settingsWindow.classList.add("block")
    settingsWindow.classList.remove("visible")
}

document.querySelector("#closeSettings").addEventListener("click", hideWindonw)

document.querySelector("#configButton").addEventListener("click", visibleWindowConfig)

document.querySelector("#saveBtn").addEventListener("click", () => {
    hideWindonw()
    const name = document.querySelector("#userName")
    const color = document.querySelector("#colorMessage")
    const id = localStorage.getItem("id")

    let userNameTags = document.querySelectorAll(`.${id}`)
    
    userNameTags.forEach(userNameTag => {
        if(name.value){
            userNameTag.children[0].innerHTML = name.value 
        }

        if(color.value){
            userNameTag.children[0].style.background = color.value
            userNameTag.children[1].style.background = color.value
        }
    })

    if(name.value){
        localStorage.setItem("userName", name.value)
    }

    if(color.value){
        localStorage.setItem("color", color.value)        
    }


    body.userName = name.value
    body.color = color.value
})

settingsWindow.addEventListener("click", (e) => {
    if(e.target.id == "settingsWindow"){
        settingsWindow.classList.remove("visible")
        settingsWindow.classList.add("block")
    }
})


socket.on("front", (msg) => {
    var templateImg;
    const id = localStorage.getItem("id")

    if(msg.imgsUploaded.length == 0){
        templateImg = `
        <li class="text ${id}">
            <span id="user-${Math.floor(Math.random() * 1E2)}" style="background: ${msg.color}">${msg.userName}:</span>
            <span style="background: ${msg.color}">${msg.title}</span>
        </li>`
    }

    imgList.innerHTML += templateImg
    galery.scrollTo(0, galery.scrollHeight)
})