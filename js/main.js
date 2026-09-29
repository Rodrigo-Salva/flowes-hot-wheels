        document.addEventListener('DOMContentLoaded', function() {
            const audioOverlay = document.getElementById('audio-overlay');
            const music = document.getElementById('background-music');

            // Loop "adelantado": reinicia la pista 5s ANTES de que termine
            // en vez de esperar a que llegue al final (el atributo "loop"
            // nativo del <audio> sí espera al final) - pedido explícito.
            // Mismo listener sirve para audio01 y audio02, comparten el
            // mismo elemento <audio> (ver playTrack más abajo).
            const LOOP_EARLY_SECONDS = 5;
            music.addEventListener('timeupdate', function () {
                if (music.duration && music.currentTime >= music.duration - LOOP_EARLY_SECONDS) {
                    music.currentTime = 0;
                }
            });

            // Intro: 6 autitos (fotos reales, no el ícono estilizado de los
            // tallos) volando de lado a lado con su rayo de propulsor
            // detrás, alternando sentido y altura. Armado por JS para no
            // repetir 6 bloques de HTML casi idénticos a mano.
            //
            // "dir" sigue hacia donde mira CADA foto de verdad (revisadas
            // una por una, no todas miran para el mismo lado): un auto que
            // mira a la derecha vuela de izquierda a derecha ("ltr", entra
            // por la izquierda y sale por la derecha, punta adelante);uno
            // que mira a la izquierda vuela al revés ("rtl"). Así nunca
            // hace falta voltear ninguna imagen - cada uno vuela para el
            // lado que ya mira de fábrica.
            const introOverlay = document.getElementById('intro-overlay');
            // Un solo literal por imagen, reusado en INTRO_CARS y en BG_CARS
            // (mas abajo) - evita repetir el mismo path dos veces.
            const CAR_IMGS = ['assets/der1.png', 'assets/izq1.png', 'assets/der2.png', 'assets/izq2.png', 'assets/der3.png', 'assets/izq3.png'];
            // Intercalados a proposito: der1, izq1, der2, izq2, der3, izq3
            // (nunca dos del mismo lado seguidos) - pedido explicito.
            const INTRO_CARS = [
                { src: CAR_IMGS[0], dir: 'ltr', top: '10vh', duration: '6.6s', delay: '0s' },  // mira a la derecha
                { src: CAR_IMGS[1], dir: 'rtl', top: '22vh', duration: '7.1s', delay: '.3s' }, // mira a la izquierda
                { src: CAR_IMGS[2], dir: 'ltr', top: '38vh', duration: '6.3s', delay: '.6s' }, // mira a la derecha
                { src: CAR_IMGS[3], dir: 'rtl', top: '54vh', duration: '7.3s', delay: '.2s' }, // mira a la izquierda
                { src: CAR_IMGS[4], dir: 'ltr', top: '68vh', duration: '6.7s', delay: '.7s' }, // mira a la derecha
                { src: CAR_IMGS[5], dir: 'rtl', top: '80vh', duration: '7s',   delay: '.4s' }  // mira a la izquierda
            ];
            // Los autitos se arman recien al tocar "Toca para abrir", no
            // antes: una animacion CSS arranca sola apenas el elemento entra
            // al DOM (la excepcion de arriba, ".container #intro-overlay *
            // { animation-play-state: running }", ya los deja corriendo pese
            // a que el body sigue con la clase "container" puesta) - si se
            // armaran de una al cargar la pagina, ya habrian volado y
            // desaparecido para cuando el usuario realmente toca la pantalla.
            // Compartido entre los autitos de la intro y los de fondo: un
            // puñado de puntitos brillantes que se alejan del auto y se
            // apagan en bucle, como el humo/chispas de un cohete.
            function buildThruster(count, sizeMin, sizeMax) {
                const thruster = document.createElement('div');
                thruster.className = 'thruster';
                for (let i = 0; i < count; i++) {
                    const p = document.createElement('span');
                    p.className = 'thruster-particle';
                    const size = sizeMin + Math.random() * (sizeMax - sizeMin);
                    p.style.width = size + 'vmin';
                    p.style.height = size + 'vmin';
                    p.style.marginTop = (-size / 2) + 'vmin';
                    p.style.top = (50 + (Math.random() * 60 - 30)) + '%';
                    const dur = 0.45 + Math.random() * 0.35;
                    p.style.animationDuration = dur + 's';
                    // retraso NEGATIVO: arranca la animacion ya a mitad de
                    // camino, para que las partículas no aparezcan todas
                    // juntas de golpe sino como un chorro continuo.
                    p.style.animationDelay = '-' + (Math.random() * dur).toFixed(2) + 's';
                    thruster.appendChild(p);
                }
                return thruster;
            }
            function buildIntroCars() {
                INTRO_CARS.forEach(cfg => {
                    const car = document.createElement('div');
                    car.className = 'intro-car intro-car--' + cfg.dir;
                    car.style.top = cfg.top;
                    car.style.animationDuration = cfg.duration;
                    car.style.animationDelay = cfg.delay;
                    car.appendChild(buildThruster(8, 2, 4.8));

                    const img = document.createElement('img');
                    img.src = cfg.src;
                    img.alt = '';
                    car.appendChild(img);
                    introOverlay.appendChild(car);
                });
            }

            // --- 8 flores en total, todas margaritas (el tipo "classic" de
            // 4 pétalos se sacó a pedido explícito - ya no se usa) - en las
            // alturas ALTAS (88-124vmin) que antes tenían los tallos de
            // autos, intercambiadas a propósito: "las flores en la parte
            // más alta, los hotwheels abajo en la base". El contenedor
            // #flowers-mount (ver CSS arriba) las mantiene siempre POR
            // DEBAJO de cualquier tallo - los hotwheels y sus tallos van
            // siempre encima, a propósito.
            // Delays mucho mas cortos que antes (0.1-0.8s, antes 1.2-1.9s) -
            // "se estan demorando mucho en salir las flores" - el atraso
            // real era este escalonado, no la intro. La 2da y la 8va usaban
            // "sway-center" las dos (mismo angulo, casi la misma altura),
            // asi que terminaban casi superpuestas en medio del ramo; la
            // 8va ahora usa un angulo propio ("sway-right-30", no repetido
            // en este set) para separarlas de verdad.
            // Sin stagger: todas las flores/tallos brotan JUNTAS y de una
            // vez (delay 0 en todas) a pedido explicito - un escalonado,
            // por mas corto que fuera, se seguia sintiendo "lento".
            // Alturas subidas (mas altas que antes, pedido explicito) y la
            // flor del medio ("sway-center") deliberadamente mas alta que
            // el resto del ramo.
            // "left" variado (32-68%, ya no 50% parejo en las 8) + mezcla de
            // tipo daisy/classic + un "hue" propio por flor (hue-rotate
            // sutil sobre el celeste base) - antes las 8 eran idénticas en
            // forma/color/posición y solo cambiaba la altura/ángulo, lo que
            // se leía "repetitivo" pese a la variedad de swing. Ahora cada
            // una tiene una combinación propia de posición+forma+tono.
            // z entre 101-108 (NO 20-27 como antes): la hierba de abajo
            // (.flower__grass__leaf, .flower__g-front, etc.) usa z-index:100
            // en el CSS - con las flores por debajo de eso, las que caían
            // geometricamente detrás de algún manojo de pasto quedaban con
            // los pétalos tapados y solo se les veía el glow desbordando
            // alrededor (se leía como "algunas flores sin pétalos"). Por
            // encima de 100 quedan siempre visibles completas.
            const FLOWER_SLOTS = [
                { h: 120, left: 32, z: 101, sway: 'sway-left-35', dur: '4.6s', delay: 0, type: 'daisy', hue: -14 },
                { h: 140, left: 50, z: 107, sway: 'sway-center', dur: '5s', delay: 0, type: 'classic', hue: 10 },
                { h: 104, left: 40, z: 102, sway: 'sway-left-20', dur: '4.3s', delay: 0, type: 'daisy', hue: -6 },
                { h: 128, left: 60, z: 105, sway: 'sway-right-20', dur: '4.8s', delay: 0, type: 'classic', hue: 6 },
                { h: 96, left: 46, z: 103, sway: 'sway-left-10', dur: '4.4s', delay: 0, type: 'daisy', hue: -20 },
                { h: 132, left: 68, z: 108, sway: 'sway-right-35', dur: '4.9s', delay: 0, type: 'daisy', hue: 16 },
                { h: 100, left: 55, z: 104, sway: 'sway-right-10', dur: '4.5s', delay: 0, type: 'classic', hue: 2 },
                { h: 116, left: 36, z: 106, sway: 'sway-right-30', dur: '5.1s', delay: 0, type: 'daisy', hue: -4 }
            ];
            const OUTER_PETALS = 14, INNER_PETALS = 13;
            function buildFlower(slot, index) {
                const flower = document.createElement('div');
                flower.className = 'flower';
                flower.style.setProperty('--h', slot.h + 'vmin');
                flower.style.setProperty('--d', slot.delay + 's');
                flower.style.left = (slot.left != null ? slot.left : 50) + '%';
                flower.style.zIndex = slot.z;
                flower.style.animation = slot.sway + ' ' + slot.dur + ' linear infinite';
                // Se aplica en el contenedor (no en .flower__leafs, que ya
                // trae su propio filter de drop-shadow/glow): un filter en
                // el padre compone sobre el resultado ya renderizado del
                // hijo en vez de pisarle el glow.
                if (slot.hue) flower.style.filter = 'hue-rotate(' + slot.hue + 'deg)';

                const leafs = document.createElement('div');
                leafs.className = 'flower__leafs';
                leafs.style.animationDelay = slot.delay + 's';

                const calyx = document.createElement('div');
                calyx.className = 'flower__calyx';
                leafs.appendChild(calyx);

                if (slot.type === 'classic') {
                    // El diseño original: 4 pétalos anchos ya orientados a
                    // mano (ver .flower__leaf--classic-1..4), no un abanico
                    // generado por ángulo como la margarita.
                    for (let i = 1; i <= 4; i++) {
                        const p = document.createElement('div');
                        p.className = 'flower__leaf--classic flower__leaf--classic-' + i;
                        leafs.appendChild(p);
                    }
                } else {
                    for (let i = 0; i < OUTER_PETALS; i++) {
                        const p = document.createElement('div');
                        p.className = 'flower__leaf flower__leaf--outer';
                        p.style.transform = 'rotate(' + (i * (360 / OUTER_PETALS)) + 'deg) rotateX(60deg)';
                        leafs.appendChild(p);
                    }
                    for (let i = 0; i < INNER_PETALS; i++) {
                        const p = document.createElement('div');
                        p.className = 'flower__leaf flower__leaf--inner';
                        p.style.transform = 'rotate(' + (i * (360 / INNER_PETALS) + 14) + 'deg) rotateX(55deg)';
                        leafs.appendChild(p);
                    }
                }

                // Solo la primera flor lleva las lucecitas (igual que en el
                // diseño original, que solo se las daba a flower--1).
                if (index === 0) {
                    for (let i = 1; i <= 8; i++) {
                        const light = document.createElement('div');
                        light.className = 'flower__light flower__light--' + i;
                        leafs.appendChild(light);
                    }
                }

                const center = document.createElement('div');
                center.className = slot.type === 'classic' ? 'flower__white-circle--classic' : 'flower__white-circle';
                leafs.appendChild(center);
                flower.appendChild(leafs);

                const line = document.createElement('div');
                line.className = 'flower__line';
                for (let i = 1; i <= 4; i++) {
                    const ll = document.createElement('div');
                    ll.className = 'flower__line__leaf flower__line__leaf--' + i;
                    line.appendChild(ll);
                }
                flower.appendChild(line);
                return flower;
            }
            function buildFlowers() {
                const mount = document.getElementById('flowers-mount');
                FLOWER_SLOTS.forEach((slot, i) => mount.appendChild(buildFlower(slot, i)));
            }
            buildFlowers();

            // --- Campo de estrellas: puntos fijos titilando, repartidos por
            // toda la pantalla. Armados ahora (no hace falta esperar al
            // clic) - quedan pausados junto con el resto del ramo hasta que
            // revealRamo() los libere.
            const STAR_COUNT = 32;
            const starField = document.getElementById('star-field');
            for (let i = 0; i < STAR_COUNT; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                const size = 1 + Math.random() * 2.2;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                star.style.left = (Math.random() * 100) + '%';
                star.style.top = (Math.random() * 100) + '%';
                const dur = 1.8 + Math.random() * 3;
                star.style.animationDuration = dur + 's';
                star.style.animationDelay = '-' + (Math.random() * dur).toFixed(2) + 's';
                starField.appendChild(star);
            }

            // --- Autitos de fondo: cruzan la pantalla en diagonal, en bucle
            // continuo (a diferencia de los de la intro, que vuelan una
            // sola vez y luego desaparecen) - aun mas rapido que antes a
            // pedido explicito. "dir" se elige igual que en la intro, segun
            // hacia donde mira cada foto de verdad, para no tener que
            // voltear ninguna: las que miran a la derecha cruzan hacia
            // abajo-derecha ("dr"), las que miran a la izquierda hacia
            // abajo-izquierda ("dl"). NO se arman ahora - buildBgCars() se
            // llama recien despues de que las flores ya terminaron de
            // brotar (ver revealRamo). IMPORTANTE: delay siempre POSITIVO
            // (nunca negativo) - un delay negativo en una animacion que
            // recien arranca hace que el navegador la dibuje ya a mitad de
            // camino (algun punto random de la pantalla, con opacidad a
            // medias) en vez de arrancar desde 0% (fuera de pantalla),
            // dando el efecto de "aparece de la nada en el centro" en vez
            // de entrar prolijamente desde el lado que le corresponde.
            const BG_CARS = [
                { src: CAR_IMGS[0], dir: 'dr', top: '5vh',  duration: '7.1s', delay: '0s' },   // mira a la derecha
                { src: CAR_IMGS[1], dir: 'dl', top: '18vh', duration: '8.3s', delay: '1.6s' }, // mira a la izquierda
                { src: CAR_IMGS[2], dir: 'dr', top: '35vh', duration: '6.4s', delay: '3.2s' }, // mira a la derecha
                { src: CAR_IMGS[3], dir: 'dl', top: '50vh', duration: '7.9s', delay: '0.8s' }, // mira a la izquierda
                { src: CAR_IMGS[4], dir: 'dr', top: '65vh', duration: '6.8s', delay: '2.4s' }, // mira a la derecha
                { src: CAR_IMGS[5], dir: 'dl', top: '80vh', duration: '7.5s', delay: '4s' }    // mira a la izquierda
            ];
            const bgCarsMount = document.getElementById('bg-cars');
            function buildBgCars() {
            BG_CARS.forEach(cfg => {
                const car = document.createElement('div');
                car.className = 'bg-car bg-car--' + cfg.dir;
                car.style.top = cfg.top;
                car.style.animationDuration = cfg.duration;
                car.style.animationDelay = cfg.delay;
                car.appendChild(buildThruster(4, 0.8, 1.8));
                const img = document.createElement('img');
                img.src = cfg.src;
                img.alt = '';
                car.appendChild(img);
                bgCarsMount.appendChild(car);
            });
            }

            function revealRamo() {
                document.body.classList.remove("container");
                // Los autitos de fondo recien aparecen cuando el ramo ya
                // broto del todo (el tallo mas el brote de los petalos,
                // ver grow-flower-tree/blooming-flower, ~3s - misma
                // velocidad que el otro ramo de hotwheels, pedido
                // explicito), nunca antes que las flores.
                setTimeout(buildBgCars, 3200);
            }

            // --- Carta previa al ramo: aparece luego de la intro de autitos
            // y se queda en pantalla hasta que el usuario toca "Ver las
            // flores" - recién ahí se llama revealRamo(). Mientras tanto
            // "container" sigue puesto en el body (el ramo permanece
            // pausado/invisible detrás de la carta). Arranca CERRADA (solo
            // logo + "toca para abrir") - un primer toque la abre (revela
            // título/mensaje/botón), no revela el ramo todavía.
            const letterOverlay = document.getElementById('letter-overlay');
            const letterCard = document.getElementById('letter-card');
            const verFloresBtn = document.getElementById('ver-flores-btn');

            function showLetter() {
                letterCard.classList.remove('open');
                letterOverlay.style.display = 'flex';
                requestAnimationFrame(() => letterOverlay.classList.add('visible'));
            }

            letterCard.addEventListener('click', function () {
                letterCard.classList.add('open');
            });

            // Dos pistas distintas segun el momento del toque (pedido
            // explicito): audio02 arranca con "Toca para abrir" (la intro),
            // audio01 la reemplaza recien al tocar "Ver las flores".
            function playTrack(src) {
                music.src = src;
                const playPromise = music.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => { console.log("Autoplay fue prevenido."); });
                }
            }

            function hideLetterAndRevealRamo() {
                playTrack('assets/audios/audio01.mp3');
                letterOverlay.classList.remove('visible');
                setTimeout(() => {
                    letterOverlay.style.display = 'none';
                    revealRamo();
                }, 500);
            }

            verFloresBtn.addEventListener('click', hideLetterAndRevealRamo);

            function startExperience() {
                playTrack('assets/audios/audio02.mp3');
                audioOverlay.style.opacity = '0';
                setTimeout(() => { audioOverlay.style.display = 'none'; }, 800);
                buildIntroCars();

                // La carta recién se muestra DESPUÉS de la intro de autitos
                // volando; el ramo sigue pausado/oculto detrás de ella hasta
                // que el usuario toca "Ver las flores" (ver showLetter/
                // hideLetterAndRevealRamo arriba).
                setTimeout(() => {
                    introOverlay.classList.add('fade-out');
                    setTimeout(() => {
                        introOverlay.style.display = 'none';
                        showLetter();
                    }, 600);
                }, 2800);
            }

            audioOverlay.addEventListener('click', startExperience);

            const particleContainer = document.querySelector('.background-particles');
            const numberOfParticles = 60; 
            for (let i = 0; i < numberOfParticles; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.animationDuration = (Math.random() * 8 + 5) + 's'; 
                particle.style.animationDelay = (Math.random() * 10) + 's';
                particleContainer.appendChild(particle);
            }
        });      
