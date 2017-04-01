var firebase;
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAwpARQ1bpvfFbQsZnK0gXXJfY5dNnnvCY",
    authDomain: "shopping-cart-981f7.firebaseapp.com",
    databaseURL: "https://shopping-cart-981f7.firebaseio.com",
    storageBucket: "shopping-cart-981f7.appspot.com",
    messagingSenderId: "683828427382"
};
firebase.initializeApp(config);
var db = firebase.database();
var db_root = db.ref('/');
db_root.on('value', function (snapshot) {
    var val = snapshot.val();
    if (val == null)
        return drawUI([]);
    var data = Object.keys(val).map(function (key) { return [val[key], key]; });
    var tupledData = data.map(function (x) { return [x[0].item, x[1]]; });
    drawUI(tupledData);
});
var input = document.querySelector(".new-todo");
input.onkeypress = function (ev) {
    if (ev.keyCode == 13) {
        addTodo();
        input.value = "";
    }
};
function addTodo() {
    var name = input.value;
    if (name == "")
        return;
    console.log("Send " + name + " to db");
    db_root.push({
        item: name
    });
}
function drawUI(data) {
    var list = document.querySelector('.todo-list');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    var tmp = document.createDocumentFragment();
    var items = data.map(buildItem).map(function (elem) { return tmp.appendChild(elem); });
    list.appendChild(tmp);
}
function buildItem(_a) {
    var name = _a[0], id = _a[1];
    var li = document.createElement("li");
    li.setAttribute("data-id", id);
    var div = document.createElement("div");
    div.classList.add("view");
    var input = document.createElement("input");
    input.classList.add("toggle");
    input.setAttribute("type", "checkbox");
    var label = document.createElement("label");
    label.textContent = name;
    var button = document.createElement("button");
    button.onclick = deleteItem(id);
    button.classList.add("destroy");
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(button);
    li.appendChild(div);
    return li;
}
function deleteItem(id) {
    return function (ev) {
        db.ref("/" + id).remove();
    };
}
