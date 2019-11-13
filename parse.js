class Root {
    constructor() {
        this.div = document.getElementById("output");
        this.json_path = "./test.json";
        this.form = document.getElementById("form");


    }


    readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status === 200) {
                callback(rawFile.responseText);
            }
        };
        rawFile.send(null);
    }

    init() {
        let self = this;
        let data_output = null;
        this.readTextFile(this.json_path, function (arr) {
            data_output = self.sort_elements(JSON.parse(arr));
            self.render(data_output);
        });

    }

    sort_elements(data) {

        return data.sort((a, b) =>
            (a.nodetype < b.nodetype) ? -1 :
                ((a.nodetype > b.nodetype) ? 1 : 0))
            .sort(function (x, y) {
                if (x.nodetype === "dir" && y.nodetype !== "dir") {
                    return -1;
                }
                return 0;
            })
            .sort(function (x, y) {
                if (x.nodetype === y.nodetype && x.nodename < y.nodename) {
                    return -1;
                }
                if (x.nodetype === y.nodetype && x.nodename > y.nodename) {
                    return 1;
                }
                return 0;
            });


    }

    render(data) {
        let ul = document.createElement("ul");
        for (let index in data) {
            let li = document.createElement("li");
            let srting = "";
            for (let key in data[index]) {
                srting += `<b>${key} :</b> ${data[index][key]} `;
                li.innerHTML = srting;
            }
            ul.appendChild(li);
        }
        this.div.appendChild(ul);
    }


    form_submit() {
        let obj = {};
        let file_obj = {};
        // let str_ = ''
        let self = this;
        this.form.addEventListener('submit', function (event) {
            event.preventDefault();
            let formData = new FormData(this);
            let file_form = document.getElementById('file_form').files[0];
              for (let elem in file_form) {
                file_obj[elem] = file_form[elem];
            }

            for (let elem of formData.entries()) {
                obj[elem[0]] = elem[1];
            }
            obj['file'] = file_obj;
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts', false);
            xhr.send(JSON.stringify(obj));

            console.log(xhr);
        })


    }
}

const App = new Root();
App.init();
App.form_submit();

