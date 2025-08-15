// util.js

function setRole(role) {
    localStorage.setItem("userRole", role);
}

function getRole() {
    return localStorage.getItem("userRole");
}

function clearRole() {
    localStorage.removeItem("userRole");
}

window.setRole = setRole;
window.getRole = getRole;
window.clearRole = clearRole;
