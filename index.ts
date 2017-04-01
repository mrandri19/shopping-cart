let firebase: any

// Initialize Firebase
const config = {
    apiKey: "AIzaSyAwpARQ1bpvfFbQsZnK0gXXJfY5dNnnvCY",
    authDomain: "shopping-cart-981f7.firebaseapp.com",
    databaseURL: "https://shopping-cart-981f7.firebaseio.com",
    storageBucket: "shopping-cart-981f7.appspot.com",
    messagingSenderId: "683828427382"
}

firebase.initializeApp(config)
const db = firebase.database()
const db_root = db.ref('/')

db_root.on('value', function(snapshot: any) {
    const val = snapshot.val()
    if(val == null) return drawUI([])

    const data = Object.keys(val).map(key => [val[key], key])
    const tupledData = data.map(x=>[x[0].item, x[1]])
    drawUI(tupledData);
});

const input: HTMLInputElement = document.querySelector(".new-todo") as HTMLInputElement
input.onkeypress = (ev) => {
    if(ev.keyCode == 13) {
        addTodo()
        input.value = ""
    }
}

function addTodo() {
    const name = input.value
    if (name == "") return

    console.log(`Send ${name} to db`);
    db_root.push({
        item: name
    })
}

function drawUI(data) {
    const list = document.querySelector('.todo-list')

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    const tmp = document.createDocumentFragment()
    const items = data.map(buildItem).map(elem => tmp.appendChild(elem))
    
    list.appendChild(tmp)
}

function buildItem([name, id]) {
    const li = document.createElement("li")
    li.setAttribute("data-id", id)


    const div = document.createElement("div")
    div.classList.add("view")

    const input = document.createElement("input")
    input.classList.add("toggle")
    input.setAttribute("type", "checkbox")
    const label = document.createElement("label")
    label.textContent = name
    const button = document.createElement("button")
    button.onclick = deleteItem(id)
    button.classList.add("destroy")

    div.appendChild(input)
    div.appendChild(label)
    div.appendChild(button)

    li.appendChild(div)
    return li
}

function deleteItem(id) {
    return function(ev) {
        db.ref("/"+id).remove();
    }
}