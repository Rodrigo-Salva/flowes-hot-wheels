        document.addEventListener('DOMContentLoaded', function() {
            // --- Elementos de la tarjeta ---
            const stemImages = document.querySelectorAll('.head-stem__image');
            const loveCardOverlay = document.getElementById('love-card-overlay');
            const loveCard = document.getElementById('love-card');
            const loveText = document.getElementById('love-text');

            // --- Contenido editable (ver DEFAULTS/CONFIG_FIELDS mas arriba) ---
            const cardBackgrounds = (Array.isArray(CONFIG_FIELDS.galeria) && CONFIG_FIELDS.galeria.length) ? CONFIG_FIELDS.galeria : DEFAULTS.galeria;
            const loveMessages = (Array.isArray(CONFIG_FIELDS.frases) && CONFIG_FIELDS.frases.length) ? CONFIG_FIELDS.frases : DEFAULTS.frases;
            
            // --- Copias para la selección aleatoria sin repetición ---
            let availableBackgrounds = [...cardBackgrounds];
            let availableMessages = [...loveMessages];


            // --- Funciones para abrir y cerrar ---
            function openCard(event) {
                // Detenemos la propagación para evitar cierres accidentales.
                event.stopPropagation(); 
                
                // Si la lista de fondos disponibles está vacía, la rellenamos de nuevo.
                if (availableBackgrounds.length === 0) {
                    availableBackgrounds = [...cardBackgrounds];
                }
                
                // Si la lista de mensajes disponibles está vacía, la rellenamos de nuevo.
                if (availableMessages.length === 0) {
                    availableMessages = [...loveMessages];
                }

                // Seleccionamos un índice aleatorio de los elementos disponibles.
                const bgIndex = Math.floor(Math.random() * availableBackgrounds.length);
                // Extraemos el elemento de la lista para que no se pueda volver a seleccionar.
                const randomBg = availableBackgrounds.splice(bgIndex, 1)[0];

                // Hacemos lo mismo para los mensajes.
                const msgIndex = Math.floor(Math.random() * availableMessages.length);
                const randomMsg = availableMessages.splice(msgIndex, 1)[0];

                // Asignamos los valores seleccionados.
                loveCard.style.backgroundImage = `url('${randomBg}')`;
                loveText.textContent = randomMsg;

                // Mostramos la tarjeta.
                loveCardOverlay.style.display = 'flex';
                setTimeout(() => {
                    loveCardOverlay.style.opacity = '1';
                    loveCardOverlay.classList.add('visible');
                }, 10);
            }

            function closeCard() {
                loveCardOverlay.style.opacity = '0';
                loveCardOverlay.classList.remove('visible');
                setTimeout(() => {
                    loveCardOverlay.style.display = 'none';
                }, 400); // Coincide con la duración de la transición en CSS
            }

            // --- Asignar Eventos ---
            // Abrir la tarjeta al hacer clic en una imagen de tallo
            stemImages.forEach(image => {
                image.addEventListener('click', openCard);
            });

            // Cerrar la tarjeta al hacer clic en cualquier lugar de la superposición.
            loveCardOverlay.addEventListener('click', closeCard);
        });
