const RPC = require("discord-rpc");
const clientId = "1267325685844803646"; // Reemplaza con tu Client ID de Discord

const rpc = new RPC.Client({ transport: "ipc" });

rpc.on("ready", async () => {
  const data = await fetch(
    "https://raw.githubusercontent.com/IgnitedsStudios/IgnitedsLauncher/main/src/event.json"
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error al cargar el archivo JSON:", error);
    });
  rpc.setActivity({
    smallImageText: data ? data.discord_rpc_event : 'Idle!',
    state: data ? data.discord_rpc_event : 'Idle!',
    startTimestamp: new Date(), // El tiempo actual cuando comienza la actividad
    largeImageKey: "logo", // Nombre de la imagen grande configurada en Discord
    largeImageText: data ? data.discord_rpc_event : 'Idle!', // Texto que se muestra cuando se pasa el ratón sobre la imagen grande
    instance: false,
  });
});

rpc.login({ clientId }).catch(console.error);
