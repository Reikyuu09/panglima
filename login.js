function loginAdmin() {

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var adminUser = "admin";
    var adminPass = "12345";

    if(username === adminUser && password === adminPass){
        alert("Login berhasil!");
        window.location.href = "dashboard.html";
        return false;
    } else {
        document.getElementById("pesan").innerHTML = "Username atau Password salah!";
        return false;
    }
}