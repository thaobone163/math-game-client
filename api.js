function getData (){
    const url = new URL("http://localhost:8000")

    let headersList = {
        "Content-Type": "application/json"
    }
    fetch(`${url}play`, {
        method: "POST",
        body:  "{\n    \"number\":"+ 1 +"\n}",
        headers: headersList
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        let {A} = data;
        console.log(A);
        console.log(data);
    })
}