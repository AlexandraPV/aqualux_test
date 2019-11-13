class Root {
    constructor() {
        this.div_output_data = document.getElementById("output");
        this.response_text_output = document.getElementById('output_request')
        this.json_path = "./test.json";
        this.form = document.getElementById("form");


    }


    readTextFile(file, callback) {
        var file_req = new XMLHttpRequest();
        file_req.overrideMimeType("application/json");
        file_req.open("GET", file, true);
        file_req.onreadystatechange = function () {
            if (file_req.readyState === 4 && file_req.status === 200) {
                callback(file_req.responseText);
            }
        };
        file_req.send(null);
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
        this.div_output_data.appendChild(ul);
    }


    form_submit() {
        let obj = {};
        let file_obj = {};
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


            xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts', false); //test url
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 201) {
                    self.response_text_output.innerHTML =
                        'created request status :' + xhr.status + xhr.responseText;
                } else {
                    // error //
                    alert(xhr.status + ': ' + xhr.statusText);
                }
            };
            xhr.send(JSON.stringify(obj));

        })


    }
}

const App = new Root();
App.init();
App.form_submit();

