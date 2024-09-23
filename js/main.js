let kommuner = []
let regioner = []
const kommuneTbody = document.getElementById("kommuneTbody");
const kommuneModal = document.getElementById("kommuneModal");
const kommuneURL = "http://Localhost:8080/kommune"
const regionURL = "http://Localhost:8080/region"
const saveButton = document.getElementById("save");
const addButton = document.getElementById("addKommune")
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

function createRegionOptions(selected) {
    // console.log("option selected kode: ", selected)
    // regioner.forEach(r => console.log(r.kode === selected))
    return regioner.map(region => `<option value="${region.kode}"${region.kode === selected ? ' selected' : 'fuck'}>${region.navn}</option>`).join("")
}

async function getKommuner() {
    let data = await fetch(kommuneURL)
    kommuner = await data.json()
    console.log(kommuner)
    renderTable()
}

async function getRegioner() {
    let data = await fetch(regionURL)
    regioner = await data.json()
    console.log(regioner)
}

function handleTableClick(e) {
    let target = e.target;
    if(target.dataset.kommuneEdit) {
        let kode = target.dataset.kommuneEdit
        console.log("Clicked edit: ", kode)
        editKommune(kode)
    }
    if(target.dataset.kommuneDelete) {
        let kode = target.dataset.kommuneDelete
        console.log("Clicked delete: ", kode)
    }

}

function showModal(kommune) {
    const myModal = new bootstrap.Modal(document.getElementById('kommuneModal'))
    myModal.show()
}


function addKommune() {
    let modalTitle = document.getElementById("kommuneModalTital");
    let inputName = document.getElementById("nameInput")
    let inputRegion = document.getElementById("regionInput")
    let inputKommuneKode = document.getElementById("kommuneKode")
    modalTitle.innerText = "Tilføj ny kommune."
    inputName.value = ""
    inputRegion.innerHTML = "<option value=''>Vælg Region</option>" + createRegionOptions()
    inputKommuneKode.value = ""
    showModal()
}

function editKommune(kommuneKode) {
    const kommune = kommuner.find(kommune => kommune.kode === kommuneKode)
    let inputName = document.getElementById("nameInput")
    let inputRegion = document.getElementById("regionInput")
    let inputKommuneKode = document.getElementById("kommuneKode")
    inputKommuneKode.value = kommune.kode
    inputName.value = kommune.navn
    inputRegion.innerHTML = createRegionOptions(kommune.region.kode)
    showModal()
}

async function saveKommune() {
    let inputName = document.getElementById("nameInput")
    let inputRegion = document.getElementById("regionInput")
    console.log("region: ", inputRegion.value)
    kommune = {}
    kommune.navn = inputName.value
    kommune.href = ""
    kommune.region = { "kode": Number(inputRegion.value)}
    let inputKommuneKode = document.getElementById("kommuneKode")
    if(inputKommuneKode.value) {
        let kommuneKode = inputKommuneKode.value
        console.log("kommune kode: ", kommuneKode)
        const opts = makeOptions("PUT", kommune)
        try {
            kommune = await fetch(`${kommuneURL+"/"+kommuneKode}`, opts)
        } catch(err) {
            console.log("THE ERROR: ", err)
        }
        getKommuner()
    } else {
        console.log("New Kommune :O?")
        const opts = makeOptions("POST", kommune)
        try {
            kommune = await fetch(`${kommuneURL}`, opts)
        } catch(err) {
            console.log("THE ERROR: ", err)
        }
        getKommuner()
    }
}




function makeOptions(method, body) {
    const opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
      }
    }
    if (body) { //Observe how we can add new fields to an object when needed
      opts.body = JSON.stringify(body);
    }
    return opts;
  }

kommuneTbody.addEventListener("click", handleTableClick)
saveButton.addEventListener("click", saveKommune)
addButton.addEventListener("click", addKommune)
getKommuner()
getRegioner()

