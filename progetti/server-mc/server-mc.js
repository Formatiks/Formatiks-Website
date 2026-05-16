(function () {
  var ipBtn = document.getElementById("mc-copy-ip");
  var ipAddr = document.getElementById("mc-ip-addr");
  var mcStatus = document.getElementById("mc-players");
  var dsStatus = document.getElementById("mc-discord-count");
  var SERVER = "mc.anozon.it";
  var DISCORD_GUILD = "1036366855121670144";

  if (ipBtn && ipAddr) {
    ipBtn.addEventListener("click", function () {
      var ip = SERVER;
      function done() {
        var hint = ipBtn.querySelector(".mc-ip__hint");
        if (!hint) return;
        var prev = hint.textContent;
        hint.textContent = "IP copiato!";
        setTimeout(function () {
          hint.textContent = prev;
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ip).then(done).catch(function () {
          window.prompt("Copia l'IP del server:", ip);
        });
      } else {
        window.prompt("Copia l'IP del server:", ip);
        done();
      }
    });
  }

  if (mcStatus && typeof MinecraftAPI !== "undefined") {
    MinecraftAPI.getServerStatus(SERVER, {}, function (error, status) {
      if (error || !status || !status.players) {
        mcStatus.textContent = "Stato server non disponibile";
        return;
      }
      mcStatus.textContent = status.players.now + " giocatori online";
    });
  } else if (mcStatus) {
    mcStatus.textContent = "Aggiungi Minecraft Java per giocare";
  }

  if (dsStatus) {
    fetch("https://discord.com/api/guilds/" + DISCORD_GUILD + "/widget.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data && typeof data.presence_count === "number") {
          dsStatus.textContent = data.presence_count + " utenti online su Discord";
        }
      })
      .catch(function () {
        dsStatus.textContent = "Community attiva su Discord";
      });
  }
})();
