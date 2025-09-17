var step = 1;

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("SW registrado"))
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

document.querySelector(".donation button").addEventListener("click", (e) => {
    const current = step++
    document.querySelector(".donation-p"+current).classList.add("d-none");
    document.querySelector(".donation-p"+step).classList.remove("d-none");
})