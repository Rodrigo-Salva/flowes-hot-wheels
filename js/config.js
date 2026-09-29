        /* ════════════════════════════════════════════════════════════════
           ██  CAMPOS EDITABLES  ██
           ═════════════════════════════════════════════════════════════ */
        const DEFAULTS = {
            titulo: "Feliz Día de los Carritos Hot Wheels 🚗",
            galeria: ["assets/card1.jpg", "assets/card2.jpg", "assets/card3.jpg"],
            frases: [
                "Eres mi momento favorito del día.",
                "Contigo, cada día es especial.",
                "Mi lugar feliz eres tú.",
                "Gracias por existir.",
                "Pienso en ti más de lo que imaginas.",
                "Eres la casualidad más bonita.",
                "Todo es mejor contigo a mi lado.",
                "Me encantas de aquí a las estrellas."
            ],
            musica: "assets/audios/audio02.mp3",
            textoInicio: "Toca para abrir",
            imagenInicio: "assets/log.png"
        };
        const CONFIG_FIELDS = DEFAULTS;

        // Precarga las fotos de la tarjeta de una vez (durante la intro,
        // antes de que el usuario llegue a tocar una flor) - sin esto, la
        // primera vez que se abria la tarjeta la foto de fondo tardaba en
        // aparecer porque recien se pedia por red en ese momento.
        (Array.isArray(CONFIG_FIELDS.galeria) && CONFIG_FIELDS.galeria.length ? CONFIG_FIELDS.galeria : DEFAULTS.galeria).forEach(function (src) {
            new Image().src = src;
        });

        document.getElementById('titulo-text').textContent = CONFIG_FIELDS.titulo || DEFAULTS.titulo;
        document.getElementById('overlay-text').textContent = CONFIG_FIELDS.textoInicio || DEFAULTS.textoInicio;
        document.getElementById('overlay-image').src = CONFIG_FIELDS.imagenInicio || DEFAULTS.imagenInicio;
        // .src va DIRECTO sobre el <audio> (sin <source> hijo) - se
        // re-resuelve solo al reasignarlo, sin necesitar .load() en ningun
        // lado.
        document.getElementById('background-music').src = CONFIG_FIELDS.musica || DEFAULTS.musica;
