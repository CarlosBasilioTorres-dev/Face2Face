if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => alert("SW registrado"))
        .catch(err => console.error("Error SW:", err));
}else{
    const el = document.documentElement
        el.requestFullscreen();
}

const sections = {
    home: "home-card",
    sync: "sync-card",
    donation: "donation-card",
    stats: "stats-card",
    historic: "historic-card"
};

Object.entries(sections).forEach(([btnId, cardClass]) => {
    document.getElementById(btnId).addEventListener("click", () => {
        document.querySelectorAll(".cards .card").forEach(item => {
            item.classList.add("d-none");
        });
        document.querySelector(`.${cardClass}`).classList.remove("d-none");
    });
});
