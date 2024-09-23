let kommuner = []
const kommuneTbody = document.getElementById("kommuneTbody");
const kommuneModal = document.getElementById("kommuneModal");
const kommuneURL = "http://Localhost:8080/kommune"

function makeKommuneRow(kommune) {
    return `<tr>
            <td>${kommune.kode}</td>
            <td>${kommune.navn}</td>
            <td>${kommune.region.navn}</td>
            <td>
                <button data-kommune-edit="${kommune.kode}" type="button" class="btn btn-primary">Edit</button>           
                <button data-kommune-delete="${kommune.kode}" type="button" class="btn btn-danger">Delete</button>
            </td>            
            </tr>`
}

function renderTable() {
    kommuneTbody.innerHTML = kommuner.map(makeKommuneRow).join("")
}

async function getKommuner() {
    let data = await fetch(kommuneURL)
    kommuner = await data.json()
    console.log(kommuner)
    renderTable()
}

function handleTableClick(e) {
    let target = e.target;
    if(target.dataset.kommuneEdit) {
        let kode = target.dataset.kommuneEdit
        console.log("Clicked edit: ", kode)
    }
    if(target.dataset.kommuneDelete) {
        let kode = target.dataset.kommuneDelete
        console.log("Clicked delete: ", kode)
    }

}

kommuneTbody.addEventListener("click", handleTableClick)

getKommuner()