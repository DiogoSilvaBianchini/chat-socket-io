const socket = io()

const form = document.querySelector("#form")
const imgField = document.querySelector("#img")
const title = document.querySelector("#title")
const galery = document.querySelector("#galery")

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
})

imgField.addEventListener('change', (e) => {
    const render = new FileReader()
    const img = e.target.files[0]

    render.onload = (e) => {
        body.imgsUploaded.push(e.target.result)
    }

    render.readAsDataURL(img)
})

title.addEventListener("keyup", (e) => body.title = e.target.value)

form.addEventListener("submit", (e) => {
    e.preventDefault()

    if(body.imgsUploaded.length > 0){
        socket.emit("front", body)
    }
    body = {
        userName: "",
        imgsUploaded: [],
        msg: ""
    }

    title.value = ""
})

socket.on("front", (msg) => {
    msg.imgsUploaded.forEach(img => {
        var templateImg;

        if(msg.title){
           templateImg = `
            <li>
                <span>${msg.userName}</span>
                <img src="${img}"/>
                <span>${msg.title}</span>
            </li>`
        }else{
            templateImg = `
            <li>
                <span>${msg.userName}</span>
                <img src="${img}"/>
            </li>`
        }
        
        galery.innerHTML += templateImg
    })
})