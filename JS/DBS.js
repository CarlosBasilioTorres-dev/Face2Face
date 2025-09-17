const request =  indexedDB.open("st_helper")


request.onupgradeneeded = (event) =>{
    const db = event.target.result;

    db.createObjectStore("cp",{

    })
}