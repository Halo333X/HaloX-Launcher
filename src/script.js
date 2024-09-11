document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(
      "https://halo333x.github.io/SurvivalCraft/src/event.json"
    );
    const eventData = await response.json();

    const backgroundContainer = document.getElementById("backgroundContainer");
    const title = document.getElementById("title");
    const startButton = document.getElementById("startButton");
    const startImage = document.getElementById("startImage");
    const downloadButton = document.getElementById("downloadButton");
    const reloadButton = document.getElementById("reloadButton");
    const statusContainer = document.getElementById("status");

    // Limpia el contenedor de fondo antes de agregar un nuevo fondo
    backgroundContainer.innerHTML = "";

    let video;
    if (eventData.backgroundIsVideo) {
      video = document.createElement("video");
      video.id = "backgroundVideo";
      video.loop = true;
      video.volume = 0.5;
      video.style.position = "absolute";
      video.style.top = "0";
      video.style.left = "0";
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";
      video.src = eventData.background; // some backgrounds: https://www.desktophut.com/search/minecraft
      backgroundContainer.appendChild(video);

    } else {
      const img = document.createElement("img");
      img.id = "backgroundImage";
      img.src = eventData.background;
      img.alt = "Background Image";
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      backgroundContainer.appendChild(img);
    }
    setTimeout(() => {
      video.play();
    }, 2000);
    title.innerText = eventData.eventName;

    startButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Evita que el clic se propague al contenedor del video
      startImage.src = "../assets/startG.gif";
      setTimeout(async () => {
        startImage.src = "../assets/startP.png";
        await openMinecraft(eventData.ip, eventData.port, eventData.serverStatus);
      }, 400);
    });

    downloadButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Evita que el clic se propague al contenedor del video
      if (eventData.packs) {
        setTimeout(() => {
          openDownloadPacks(eventData.packs);
        }, 500);
      } else {
        console.error("URL de los packs no disponible.");
      }
    });

    reloadButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Evita que el clic se propague al contenedor del video
      window.location.reload();
    });

    // Función para actualizar el número de jugadores en línea
    async function updatePlayersOnline() {
      try {
        const res = await fetch('https://survivalcraft-6e68c-default-rtdb.firebaseio.com/serverStatus.json');
        const get = await res.json();
        if (get) {
          const playersOnline = get.playersOnline;
          const ping = get.latency;
          function getPing(ping) {
            if (ping <= 100) return "ping_green.png";
            else if (ping >= 100 && ping <= 150) return "ping_yellow.png";
            else return "ping_red.png";
          }
          statusContainer.innerHTML = `
            <span id="playersOnline">${playersOnline}</span>
            <img id="statusIcon" src="../assets/playersIcon.png" alt="Players Icon" style="width: 20px; object-fit: contain;" />
            <img id="pingIcon" src="../assets/${getPing(ping)}" alt="Ping" style="width: 20px; object-fit: contain; margin-left: 10px;" />
          `;
        } else {
          statusContainer.innerHTML = `
            <span id="playersOnline">0</span>
            <img id="statusIcon" src="../assets/playersIcon.png" alt="Players Icon" style="width: 20px; object-fit: contain;" />
            <img id="pingIcon" src="../assets/ping_green.png" alt="Ping" style="width: 20px; object-fit: contain; margin-left: 10px;" />
          `;
        }
      } catch (error) {
        console.error("Error fetching players online:", error);
      }
    }

    // Llama a la función de actualización inmediatamente
    updatePlayersOnline();

    // Configura el intervalo para actualizar el número de jugadores en línea cada 30 segundos
    setInterval(updatePlayersOnline, 30000); // Cada 30 segundos

    // Añade un evento de clic en el documento para pausar o reanudar el video
    document.addEventListener("click", () => {
      if (video) {
        if (video.paused) {
          video.play().catch((error) => {
            console.error("Error playing video:", error);
          });
          backgroundContainer.style.opacity = "1"; // Opacidad normal
        } else {
          video.pause();
          backgroundContainer.style.opacity = "0.5"; // Opacidad reducida
        }
      }
    });

    // Añade un evento de teclado para pausar o reanudar el video al presionar la barra espaciadora
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (video) {
          if (video.paused) {
            video.play().catch((error) => {
              console.error("Error playing video:", error);
            });
            backgroundContainer.style.opacity = "1"; // Opacidad normal
          } else {
            video.pause();
            backgroundContainer.style.opacity = "0.5"; // Opacidad reducida
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching event data:", error);
  }
});

async function openMinecraft(serverUrl, serverPort, serverStatus) {
  const target = isMobile() ? "_blank" : "_self";
  console.log(serverStatus);
  const url = `minecraft://connect?serverUrl=${serverUrl}&serverPort=${serverPort}`;
  if (serverStatus) {
    window.open(url, target);
  } else {
    alert('Server not running!');
  }
}

function openDownloadPacks(url) {
  const target = isMobile() ? "_blank" : "_self";
  window.open(url, target);
}

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}