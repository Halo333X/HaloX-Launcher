const RPC = require("discord-rpc");
const clientId = "1283322674566926397"; // Reemplaza con tu Client ID de Discord

const rpc = new RPC.Client({ transport: "ipc" });

rpc.on("ready", async () => {
  const data = await fetch(
    "https://halo333x.github.io/HaloX-Launcher/src/event.json"
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
    startTimestamp: new Date(),
    largeImageKey: "logo",
    largeImageText: data ? data.discord_rpc_event : 'Idle!',
    instance: false,
  });
});

rpc.login({ clientId }).catch(console.error);
