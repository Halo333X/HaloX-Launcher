document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(
      "https://ignitedsstudios.github.io/IgnitedsLauncher/src/event.json"
    );
    const eventData = await response.json();

    const backgroundContainer = document.getElementById("backgroundContainer");
    const title = document.getElementById("title");
    const startButton = document.getElementById("startButton");
    const startImage = document.getElementById("startImage");
    const downloadButton = document.getElementById("downloadButton");
    const reloadButton = document.getElementById("reloadButton");
    const statusIcon = document.getElementById("statusIcon");

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
      video.src = eventData.background;
      backgroundContainer.appendChild(video);

      // Intenta reproducir el video después de 2 segundos
      setTimeout(() => {
        video.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }, 2000);
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

    title.innerText = eventData.eventName;

    startButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Evita que el clic se propague al contenedor del video
      startImage.src = "assets/startG.gif";
      setTimeout(async () => {
        startImage.src = "assets/startP.png";
        await openMinecraft(eventData.ip, eventData.port, eventData.serverStatus);
      }, 400);
    });

    downloadButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Evita que el clic se propague al contenedor del video
      if (eventData.packs) {
        openDownloadPacks(eventData.packs);
      } else {
        console.error("URL de los packs no disponible.");
      }
    });

    reloadButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Evita que el clic se propague al contenedor del video
      window.location.reload();
    });

    // Actualiza el estado del servidor
    console.log(eventData.serverStatus);
    if (eventData.serverStatus) {
      statusIcon.src = "https://ignitedsstudios.github.io/IgnitedsLauncherWeb/assets/status_on.png";
    } else {
      statusIcon.src = "https://ignitedsstudios.github.io/IgnitedsLauncherWeb/assets/status_off.png";
    }

    // Ajusta el tamaño del icono del estatus
    statusIcon.style.width = "32px"; // Cambia el tamaño según tus necesidades
    statusIcon.style.height = "32px"; // Cambia el tamaño según tus necesidades

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
