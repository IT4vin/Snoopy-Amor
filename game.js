// Jogo do Snoopy - Versão simplificada
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = { score: 0, keys: {}, gravity: 0.8, friction: 0.85, currentPhase: 1, maxPhases: 3, phaseComplete: false, enemiesKilled: 0, showingFinalScene: false };

// Passarinho amarelo
const bird = {
    x: -100,
    y: 80,
    baseY: 80,
    speed: 1.5,
    waveAmplitude: 15,
    waveFrequency: 0.03,
    wingPhase: 0,
    visible: true,
    hasLetter: true
};
const player = { 
    x: 100, y: 490, width: 50, height: 60, velocityX: 0, velocityY: 0, speed: 5, jumpPower: 13, 
    onGround: true, direction: 1, 
    // Novos parâmetros para animação 3D
    walkFrame: 0, walkSpeed: 0.4, bounceY: 0, bouncePhase: 0,
    shadowScale: 1, depth: 0, rotationY: 0, isJumping: false,
    // Sistema de pulo duplo
    canDoubleJump: false, hasDoubleJumped: false, lastJumpTime: 0, jumpCooldown: 200
};

// ========== CONFIGURAÇÕES DAS FASES ==========
const phaseConfigs = {
    1: {
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, color: '#8B4513' }, 
            { x: 200, y: 450, width: 120, height: 20, color: '#8B4513' },
            { x: 500, y: 380, width: 100, height: 20, color: '#8B4513' },
            { x: 120, y: 350, width: 80, height: 15, color: '#CD853F' }
        ],
        roses: [
            { x: 230, y: 420, width: 20, height: 15, collected: false }, 
            { x: 530, y: 350, width: 20, height: 15, collected: false },
            { x: 140, y: 320, width: 20, height: 15, collected: false }
        ],
        enemies: [
            { x: 250, y: 430, width: 25, height: 25, velocityX: 1, direction: 1, platformIndex: 1, dead: false, deathTimer: 0, type: 'goomba' },
            { x: 520, y: 360, width: 25, height: 25, velocityX: 1.5, direction: -1, platformIndex: 2, dead: false, deathTimer: 0, type: 'spiky' }
        ]
    },
    2: {
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, color: '#8B4513' },
            { x: 150, y: 480, width: 100, height: 15, color: '#CD853F' },
            { x: 350, y: 420, width: 80, height: 15, color: '#CD853F' },
            { x: 550, y: 360, width: 120, height: 20, color: '#8B4513' },
            { x: 100, y: 300, width: 60, height: 15, color: '#CD853F' },
            { x: 650, y: 250, width: 100, height: 20, color: '#8B4513' }
        ],
        roses: [
            { x: 170, y: 450, width: 20, height: 15, collected: false },
            { x: 370, y: 390, width: 20, height: 15, collected: false },
            { x: 580, y: 330, width: 20, height: 15, collected: false },
            { x: 120, y: 270, width: 20, height: 15, collected: false },
            { x: 680, y: 220, width: 20, height: 15, collected: false }
        ],
        enemies: [
            { x: 170, y: 460, width: 25, height: 25, velocityX: 0.8, direction: 1, platformIndex: 1, dead: false, deathTimer: 0, type: 'goomba' },
            { x: 370, y: 400, width: 25, height: 25, velocityX: 1.2, direction: -1, platformIndex: 2, dead: false, deathTimer: 0, type: 'spiky' },
            { x: 580, y: 340, width: 25, height: 25, velocityX: 1, direction: 1, platformIndex: 3, dead: false, deathTimer: 0, type: 'shell' },
            { x: 670, y: 230, width: 25, height: 25, velocityX: 1.5, direction: -1, platformIndex: 5, dead: false, deathTimer: 0, type: 'goomba' }
        ]
    },
    3: {
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, color: '#8B4513' },
            { x: 100, y: 480, width: 80, height: 15, color: '#CD853F' },
            { x: 250, y: 430, width: 60, height: 15, color: '#CD853F' },
            { x: 400, y: 380, width: 80, height: 15, color: '#CD853F' },
            { x: 550, y: 330, width: 60, height: 15, color: '#CD853F' },
            { x: 200, y: 280, width: 100, height: 20, color: '#8B4513' },
            { x: 450, y: 230, width: 80, height: 15, color: '#CD853F' },
            { x: 600, y: 180, width: 120, height: 20, color: '#8B4513' }
        ],
        roses: [
            { x: 120, y: 450, width: 20, height: 15, collected: false },
            { x: 270, y: 400, width: 20, height: 15, collected: false },
            { x: 420, y: 350, width: 20, height: 15, collected: false },
            { x: 570, y: 300, width: 20, height: 15, collected: false },
            { x: 230, y: 250, width: 20, height: 15, collected: false },
            { x: 470, y: 200, width: 20, height: 15, collected: false },
            { x: 630, y: 150, width: 20, height: 15, collected: false }
        ],
        enemies: [
            { x: 120, y: 460, width: 25, height: 25, velocityX: 1, direction: 1, platformIndex: 1, dead: false, deathTimer: 0, type: 'goomba' },
            { x: 270, y: 410, width: 25, height: 25, velocityX: 1.3, direction: -1, platformIndex: 2, dead: false, deathTimer: 0, type: 'spiky' },
            { x: 420, y: 360, width: 25, height: 25, velocityX: 0.9, direction: 1, platformIndex: 3, dead: false, deathTimer: 0, type: 'shell' },
            { x: 570, y: 310, width: 25, height: 25, velocityX: 1.4, direction: -1, platformIndex: 4, dead: false, deathTimer: 0, type: 'goomba' },
            { x: 230, y: 260, width: 25, height: 25, velocityX: 1.1, direction: 1, platformIndex: 5, dead: false, deathTimer: 0, type: 'spiky' },
            { x: 470, y: 210, width: 25, height: 25, velocityX: 1.6, direction: -1, platformIndex: 6, dead: false, deathTimer: 0, type: 'shell' }
        ]
    }
};

let platforms = [], roses = [], enemies = [], particles = [];

function initPhase(phaseNumber) {
    const config = phaseConfigs[phaseNumber] || phaseConfigs[1];
    platforms = [...config.platforms];
    roses = config.roses.map(rose => ({...rose, collected: false}));
    enemies = config.enemies ? config.enemies.map(enemy => ({
        ...enemy, 
        dead: false, 
        deathTimer: 0,
        remove: false,
        bounceY: 0,
        walkFrame: 0
    })) : [];
    
    // Reset player position - sempre no chão
    spawnPlayerOnGround();
    
    game.phaseComplete = false;
    
    // Limpar partículas da fase anterior
    particles = [];
    
    // Atualizar display da fase
    document.getElementById('phaseValue').textContent = phaseNumber;
    
    console.log(`Fase ${phaseNumber} iniciada - ${roses.length} rosas para coletar, ${enemies.length} inimigos`);
    
    // Mostrar mensagem de início da fase
    if (phaseNumber > 1) {
        setTimeout(() => {
            console.log(`🌹 Fase ${phaseNumber} - Colete ${roses.length} rosas! Cuidado com ${enemies.length} inimigos!`);
        }, 100);
    }
}

// ========== FUNÇÕES AUXILIARES ==========

function getGroundPosition() {
    // Encontrar a plataforma principal (chão) - procurar a plataforma mais baixa e larga
    let groundPlatform = platforms[0];
    
    // Procurar pela plataforma que mais parece ser o chão (mais baixa e mais larga)
    platforms.forEach(platform => {
        if (platform.y > groundPlatform.y || 
            (platform.y === groundPlatform.y && platform.width > groundPlatform.width)) {
            groundPlatform = platform;
        }
    });
    
    if (groundPlatform) {
        return groundPlatform.y - player.height;
    }
    
    // Fallback se não encontrar plataforma
    return 460;
}

function spawnPlayerOnGround() {
    player.x = 100;
    player.y = getGroundPosition();
    player.velocityX = 0;
    player.velocityY = 0;
    player.onGround = true;
    
    console.log(`🏠 Snoopy posicionado no chão: x=${player.x}, y=${player.y}`);
}

// ========== SISTEMA DE PROGRESSÃO DE FASES ==========
function completePhase() {
    game.phaseComplete = true;
    
    if (game.currentPhase === game.maxPhases) {
        // Jogo completo - iniciar cena final
        console.log('🎉 Jogo completamente finalizado! Iniciando cena final...');
        startFinalScene();
    } else {
        // Próxima fase
        showTransition(`🌹 Fase ${game.currentPhase} Completa! 🌹`, `Parabéns! Você coletou todas as rosas!<br><br>Prepare-se para o próximo desafio...<br><br>A aventura continua!`);
    }
}

function showTransition(title, text, isGameComplete = false) {
    document.getElementById('transitionTitle').innerHTML = title;
    document.getElementById('transitionText').innerHTML = text;
    
    const continueBtn = document.getElementById('continueBtn');
    if (isGameComplete) {
        continueBtn.textContent = '🔄 Jogar Novamente';
        continueBtn.onclick = () => restartGame();
    } else {
        continueBtn.textContent = '▶️ Próxima Fase';
        continueBtn.onclick = () => continueGame();
    }
    
    document.getElementById('phaseTransition').classList.add('active');
}

function continueGame() {
    game.currentPhase++;
    initPhase(game.currentPhase);
    document.getElementById('phaseTransition').classList.remove('active');
}

function restartGame() {
    game.currentPhase = 1;
    game.score = 0;
    game.enemiesKilled = 0;
    game.showingFinalScene = false;
    bird.visible = true;
    bird.hasLetter = true;
    bird.x = -100;
    document.getElementById('scoreValue').textContent = '0';
    document.getElementById('enemiesValue').textContent = '0';
    initPhase(game.currentPhase);
    document.getElementById('phaseTransition').classList.remove('active');
    hideLovePoem();
}

function startFinalScene() {
    game.showingFinalScene = true;
    
    // Posicionar o passarinho para descer
    bird.x = canvas.width / 2 - 50;
    bird.y = 50;
    bird.speed = 0; // Parar movimento horizontal
    
    // Animar descida do passarinho
    setTimeout(() => {
        animateBirdDescending();
    }, 1000);
}

function animateBirdDescending() {
    const targetY = player.y - 80; // Posição acima do Snoopy
    const descendSpeed = 2;
    
    const descend = () => {
        if (bird.y < targetY) {
            bird.y += descendSpeed;
            requestAnimationFrame(descend);
        } else {
            // Passarinho chegou - entregar a carta
            setTimeout(() => {
                deliverLoveLetter();
            }, 1500);
        }
    };
    
    descend();
}

function deliverLoveLetter() {
    // Passarinho entrega a carta
    bird.hasLetter = false;
    
    // Mostrar o poema romântico
    setTimeout(() => {
        showLovePoem();
    }, 1000);
}

function showLovePoem() {
    // Função para calcular o tempo decorrido
    function getTimeElapsed() {
        const startDate = new Date('2020-11-29T00:00:00');
        const now = new Date();
        const diff = now - startDate;
        
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${years} anos, ${months} meses, ${days} dias, ${hours}h ${minutes}m ${seconds}s`;
    }

    const poemHTML = `
        <div id="lovePoem" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 2s ease-in;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                text-align: center;
                max-width: 500px;
                border: 3px solid #ff69b4;
                position: relative;
            ">
                <div style="
                    margin-bottom: 20px;
                    font-family: 'Arial', sans-serif;
                    font-size: 16px;
                    color: #ff69b4;
                    font-weight: bold;
                ">
                    💕 Tempo juntos 💕<br>
                    <span id="timer" style="
                        display: block;
                        margin-top: 10px;
                        font-size: 18px;
                        color: #ff1493;
                    "></span>
                </div>
                <div style="
                    font-family: 'Arial', sans-serif;
                    font-size: 18px;
                    line-height: 1.8;
                    white-space: pre-line;
                    margin-bottom: 30px;
                    color: #333;
                ">
🌟 Para Mayara Mendes 🌟

Minha ruiva, doce chama,
Teu amor é quem me chama.
Nos caminhos da aventura,
Tua lealdade é minha cura.

Se o mundo ruir lá fora,
Te abraço e passa a hora.
Com coragem e ternura,
Vivemos nossa doçura.

És meu porto, minha estrada,
Minha escolha mais amada.
E em cada novo amanhecer,
É por ti que quero viver.

Com amor e carinho,
💛 Gustavo Gostosão 💛
                </div>
                
                <button onclick="closeLovePoem()" style="
                    background: linear-gradient(45deg, #ff69b4, #ff1493);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-top: 30px;
                    box-shadow: 0 5px 15px rgba(255,20,147,0.4);
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    💕 Fechar 💕
                </button>
            </div>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
        </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', poemHTML);

    // Iniciar o temporizador após adicionar o HTML
    const timerElement = document.getElementById('timer');
    function updateTimer() {
        timerElement.textContent = getTimeElapsed();
        requestAnimationFrame(updateTimer);
    }
    updateTimer();
}

function hideLovePoem() {
    const poem = document.getElementById('lovePoem');
    if (poem) {
        poem.remove();
    }
}

// Função global para fechar o poema
window.closeLovePoem = function() {
    hideLovePoem();
    // Mostrar opção de jogar novamente
    showTransition("💕 FINAL ROMÂNTICO 💕", "Snoopy entregou todas as rosas e recebeu a carta de amor!<br><br>🐦 O passarinho dourado cumpriu sua missão!<br><br>💖 Uma história de amor eterna!", true);
};

function handleJump() {
    const currentTime = Date.now();
    
    // Primeiro pulo (no chão)
    if (player.onGround) {
        player.velocityY = -player.jumpPower;
        player.onGround = false;
        player.isJumping = true;
        player.bouncePhase = 0;
        player.canDoubleJump = true;
        player.hasDoubleJumped = false;
        player.lastJumpTime = currentTime;
        console.log('🚀 Primeiro pulo!');
    }
    // Segundo pulo (no ar)
    else if (player.canDoubleJump && !player.hasDoubleJumped && 
             currentTime - player.lastJumpTime > player.jumpCooldown) {
        player.velocityY = -player.jumpPower * 0.8; // Pulo duplo um pouco menor
        player.hasDoubleJumped = true;
        player.canDoubleJump = false;
        console.log('✨ Pulo duplo!');
        
        // Efeito visual de pulo duplo
        createDoubleJumpEffect(player.x + player.width/2, player.y + player.height);
    }
}

document.addEventListener('keydown', (e) => { 
    game.keys[e.code] = true; 
    // Sistema de pulo duplo - detecta pressionar da tecla
    if (e.code === 'Space') {
        handleJump();
    }
});
document.addEventListener('keyup', (e) => { game.keys[e.code] = false; });

function drawPlayer() {
    // ========== CACHORRO BRANCO SIMPLES ==========
    
    ctx.save();
    
    // Posição central do personagem
    const centerX = player.x + player.width/2;
    const centerY = player.y + player.height/2;
    ctx.translate(centerX, centerY);
    
    // Flip horizontal baseado na direção
    if (player.direction === -1) {
        ctx.scale(-1, 1);
    }
    
    // Sombra simples
    drawSimpleShadow();
    
    // Cachorro branco
    drawWhiteDog();
    
    ctx.restore();
}

function drawPlayerShadow() {
    // Sombra realista no chão
    const shadowY = 550; // Posição do chão
    const shadowDistance = shadowY - (player.y + player.height);
    const shadowScale = Math.max(0.3, 1 - shadowDistance / 200);
    
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'black';
    ctx.transform(1, 0, 0.3, 0.2, 0, 0); // Perspectiva da sombra
    ctx.beginPath();
    ctx.ellipse(
        player.x + player.width/2, 
        shadowY, 
        player.width/2 * shadowScale, 
        player.height/6 * shadowScale, 
        0, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
}

function drawBodyShadow() {
    // Sombra corporal para efeito 3D
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = 'black';
    ctx.translate(3, 3);
    
    // Sombra do corpo
    ctx.beginPath();
    ctx.ellipse(0, 8, player.width/2.5, player.height/3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Sombra da cabeça
    ctx.beginPath();
    ctx.ellipse(0, -18, player.width/3, player.height/3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// ========== CACHORRO BRANCO SIMPLES ==========

function drawSimpleShadow() {
    // Sombra simples no chão (Cachorrinho menor)
    const shadowDistance = 35;
    
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000000';
    
    ctx.beginPath();
    ctx.ellipse(0, shadowDistance, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawWhiteDog() {
    // ===== CACHORRINHO ESTILO SNOOPY =====
    drawDogHead();
    drawDogEar();
    drawDogNose();
    drawDogEyes();
    drawDogSmile();
    drawDogBody();
    drawDogPaws();
    drawDogTail();
}

function drawDogHead() {
    // Cabeça oval branca (menor)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#FFFFFF';
    
    ctx.beginPath();
    ctx.ellipse(0, -18, 18, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawDogEar() {
    // Orelha esquerda preta (menor)
    ctx.fillStyle = '#000000';
    
    ctx.beginPath();
    ctx.ellipse(-15, -18, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawDogNose() {
    // Nariz preto (menor)
    ctx.fillStyle = '#000000';
    
    ctx.beginPath();
    ctx.arc(11, -22, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawDogEyes() {
    // Dois olhos pretos (menores)
    ctx.fillStyle = '#000000';
    
    // Olho direito
    ctx.beginPath();
    ctx.arc(4, -25, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Olho esquerdo
    ctx.beginPath();
    ctx.arc(-4, -25, 1.5, 0, Math.PI * 2);
    ctx.fill();
}

function drawDogSmile() {
    // Sorriso expressivo (menor)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(0, -15, 7, 0, Math.PI / 2, false);
    ctx.stroke();
}

function drawDogBody() {
    // Corpo oval branco (menor)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#FFFFFF';
    
    ctx.beginPath();
    ctx.ellipse(0, 8, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawDogPaws() {
    // Patas ovais (menores)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#FFFFFF';
    
    // Pata esquerda
    ctx.beginPath();
    ctx.ellipse(-8, 26, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Pata direita
    ctx.beginPath();
    ctx.ellipse(8, 26, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawDogTail() {
    // Cauda curvada (menor)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(9, 8);
    ctx.lineTo(18, 4);
    ctx.stroke();
}

function draw4DShadows(centerX, centerY, time) {
    ctx.save();
    
    // Sombras em múltiplas dimensões temporais
    for (let d = 0; d < 5; d++) {
        const timeOffset = d * 0.5;
        const dimensionTime = time + timeOffset;
        
        const shadowX = centerX + Math.sin(dimensionTime * 0.3) * (d * 8);
        const shadowY = centerY + Math.cos(dimensionTime * 0.2) * (d * 5) + 80;
        
        ctx.globalAlpha = 0.1 / (d + 1);
        ctx.fillStyle = `hsl(${240 + d * 30}, 70%, 20%)`;
        
        // Sombra dimensional distorcida
        ctx.beginPath();
        ctx.ellipse(shadowX, shadowY, 40 - d * 3, 15 - d * 2, 
                   dimensionTime * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

function draw4DAura(centerX, centerY, time) {
    ctx.save();
    
    // Aura multidimensional pulsante
    for (let layer = 0; layer < 8; layer++) {
        const radius = 60 + layer * 15 + Math.sin(time * 2 + layer) * 10;
        const alpha = (0.15 - layer * 0.015) * (1 + Math.sin(time * 3) * 0.3);
        
        ctx.globalAlpha = alpha;
        
        // Gradiente dimensional
        const gradient = ctx.createRadialGradient(centerX, centerY - 10, 0, 
                                                centerX, centerY - 10, radius);
        gradient.addColorStop(0, `hsla(${180 + time * 50 + layer * 45}, 80%, 70%, 0)`);
        gradient.addColorStop(0.7, `hsla(${180 + time * 50 + layer * 45}, 80%, 50%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${180 + time * 50 + layer * 45}, 80%, 30%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 10, radius, radius * 0.8, 
                   time * 0.2 + layer * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

function drawSpaceTimeDistortions(centerX, centerY, time) {
    ctx.save();
    
    // Distorções do espaço-tempo ao redor do Snoopy
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.5;
        const distance = 80 + Math.sin(time * 2 + i) * 20;
        
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.6;
        
        ctx.globalAlpha = 0.3 + Math.sin(time * 3 + i) * 0.2;
        ctx.strokeStyle = `hsl(${300 + i * 30 + time * 40}, 70%, 60%)`;
        ctx.lineWidth = 3 + Math.sin(time * 4 + i) * 2;
        
        // Linhas de força dimensional
        ctx.beginPath();
        ctx.moveTo(x, y);
        const endX = x + Math.cos(angle + Math.PI) * 25;
        const endY = y + Math.sin(angle + Math.PI) * 25;
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Partículas dimensionais
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.ellipse(x, y, 3 + Math.sin(time * 5 + i) * 2, 
                   3 + Math.sin(time * 5 + i) * 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

function drawSnoopy4D(centerX, centerY, time) {
    // Desenha Snoopy em múltiplas dimensões sobrepostas
    for (let dimension = 0; dimension < 4; dimension++) {
        ctx.save();
        
        const dimTime = time + dimension * 0.25;
        const offsetX = Math.sin(dimTime * 0.4) * dimension * 3;
        const offsetY = Math.cos(dimTime * 0.3) * dimension * 2;
        const scale = 1 - dimension * 0.05;
        const rotation = Math.sin(dimTime * 0.1) * 0.1;
        
        ctx.translate(centerX + offsetX, centerY + offsetY);
        ctx.scale(scale, scale);
        ctx.rotate(rotation);
        
        // Flip horizontal baseado na direção
        if (player.direction === -1) {
            ctx.scale(-1, 1);
        }
        
        // Transparência dimensional
        ctx.globalAlpha = 1 - dimension * 0.2;
        
        // Matiz dimensional
        const hueShift = dimension * 60;
        
        drawSnoopy4DBody(hueShift, dimension);
        drawSnoopy4DHead(hueShift, dimension);
        drawSnoopy4DEars(hueShift, dimension);
        drawSnoopy4DEyes(hueShift, dimension, dimTime);
        drawSnoopy4DNose(hueShift, dimension);
        drawSnoopy4DMouth(hueShift, dimension);
        drawSnoopy4DCollar(hueShift, dimension);
        drawSnoopy4DArms(hueShift, dimension);
        drawSnoopy4DLegs(hueShift, dimension);
        drawSnoopy4DTail(hueShift, dimension);
        
        ctx.restore();
    }
}

function drawSnoopy4DBody(hueShift, dimension) {
    ctx.fillStyle = dimension === 0 ? '#FFFFFF' : `hsl(${hueShift}, 20%, 90%)`;
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.ellipse(0, 10, 35, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawSnoopy4DHead(hueShift, dimension) {
    ctx.fillStyle = dimension === 0 ? '#FFFFFF' : `hsl(${hueShift}, 20%, 90%)`;
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.ellipse(0, -25, 28, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawSnoopy4DEars(hueShift, dimension) {
    ctx.fillStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 60%, 20%)`;
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.ellipse(18, -40, 12, 20, Math.PI/8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = dimension === 0 ? '#FFFFFF' : `hsl(${hueShift}, 20%, 90%)`;
    ctx.beginPath();
    ctx.ellipse(15, -38, 4, 7, Math.PI/8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(20, -43, 2, 4, Math.PI/6, 0, Math.PI * 2);
    ctx.fill();
}

function drawSnoopy4DEyes(hueShift, dimension, dimTime) {
    // Olhos com brilho dimensional
    ctx.fillStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 60%, 20%)`;
    
    ctx.beginPath();
    ctx.ellipse(-8, -30, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(6, -30, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Brilhos dimensionais pulsantes
    const glowIntensity = 1 + Math.sin(dimTime * 4) * 0.3;
    ctx.fillStyle = dimension === 0 ? '#FFFFFF' : `hsl(${hueShift + 180}, 80%, ${70 + dimension * 10}%)`;
    
    ctx.beginPath();
    ctx.ellipse(-9, -32, 1.5 * glowIntensity, 2 * glowIntensity, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(5, -32, 1.5 * glowIntensity, 2 * glowIntensity, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawSnoopy4DNose(hueShift, dimension) {
    ctx.fillStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 60%, 20%)`;
    ctx.beginPath();
    ctx.ellipse(-2, -18, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = dimension === 0 ? '#FFFFFF' : `hsl(${hueShift + 180}, 80%, 80%)`;
    ctx.beginPath();
    ctx.ellipse(-4, -19, 1.5, 1, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawSnoopy4DMouth(hueShift, dimension) {
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.arc(-2, -12, 10, 0.2, Math.PI - 0.2);
    ctx.stroke();
}

function drawSnoopy4DCollar(hueShift, dimension) {
    ctx.fillStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 60%, 20%)`;
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.ellipse(0, -5, 32, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = dimension === 0 ? '#C0C0C0' : `hsl(${hueShift + 90}, 40%, 70%)`;
    ctx.strokeStyle = dimension === 0 ? '#808080' : `hsl(${hueShift + 90}, 50%, 50%)`;
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.rect(-3, -8, 6, 6);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = dimension === 0 ? '#606060' : `hsl(${hueShift + 90}, 60%, 40%)`;
    ctx.beginPath();
    ctx.ellipse(0, -5, 1.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawSnoopy4DArms(hueShift, dimension) {
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(-28, 5);
    ctx.quadraticCurveTo(-42, 0, -48, 12);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(28, 5);
    ctx.quadraticCurveTo(42, 0, 48, 12);
    ctx.stroke();
    
    ctx.fillStyle = dimension === 0 ? '#FFFFFF' : `hsl(${hueShift}, 20%, 90%)`;
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.ellipse(-50, 15, 7, 9, Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.ellipse(50, 15, 7, 9, -Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawSnoopy4DLegs(hueShift, dimension) {
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(-12, 48);
    ctx.lineTo(-12, 65);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(12, 48);
    ctx.lineTo(12, 65);
    ctx.stroke();
    
    ctx.fillStyle = dimension === 0 ? '#FFFFFF' : `hsl(${hueShift}, 20%, 90%)`;
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.ellipse(-12, 68, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.ellipse(12, 68, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawSnoopy4DTail(hueShift, dimension) {
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(32, 25);
    ctx.quadraticCurveTo(45, 15, 42, 0);
    ctx.quadraticCurveTo(40, -10, 35, -8);
    ctx.stroke();
    
    ctx.fillStyle = dimension === 0 ? '#FFFFFF' : `hsl(${hueShift}, 20%, 90%)`;
    ctx.strokeStyle = dimension === 0 ? '#000000' : `hsl(${hueShift}, 50%, 30%)`;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.ellipse(34, -10, 4, 6, Math.PI/8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawDimensionalEffects(centerX, centerY, time) {
    ctx.save();
    
    // Ondas dimensionais
    for (let wave = 0; wave < 6; wave++) {
        const waveTime = time * 2 + wave;
        const radius = 30 + wave * 20 + Math.sin(waveTime) * 50;
        
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = `hsl(${wave * 60 + time * 30}, 70%, 60%)`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 10, radius, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.restore();
}

function drawQuantumParticles(centerX, centerY, time) {
    ctx.save();
    
    // Partículas quânticas orbitando
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + time;
        const distance = 100 + Math.sin(time * 3 + i) * 30;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.5;
        
        ctx.globalAlpha = 0.6 + Math.sin(time * 5 + i) * 0.4;
        ctx.fillStyle = `hsl(${i * 18 + time * 60}, 80%, 70%)`;
        
        const size = 2 + Math.sin(time * 4 + i) * 2;
        ctx.beginPath();
        ctx.ellipse(x, y, size, size, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Rastro quântico
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 1;
        
        const prevX = centerX + Math.cos(angle - 0.1) * (distance - 5);
        const prevY = centerY + Math.sin(angle - 0.1) * (distance - 5) * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    
    ctx.restore();
}

function drawAnimatedEyes() {
    const blinkPhase = Math.sin(Date.now() * 0.003) > 0.95 ? 0.3 : 1;
    
    ctx.fillStyle = 'black';
    
    // Olho esquerdo
    ctx.beginPath();
    ctx.ellipse(-8, -22, 3, 4 * blinkPhase, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Olho direito
    ctx.beginPath();
    ctx.ellipse(-3, -22, 3, 4 * blinkPhase, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Brilhos nos olhos
    if (blinkPhase > 0.8) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(-9, -24, 1, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(-4, -24, 1, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawAnimatedSmile() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    
    const happiness = 1 + Math.sin(Date.now() * 0.002) * 0.2;
    
    ctx.beginPath();
    ctx.arc(-6, -6, 9 * happiness, 0.1, Math.PI * 0.35);
    ctx.stroke();
}

function drawArmsWithAnimation() {
    const armSwing = Math.sin(player.walkFrame) * 0.3;
    
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    
    // Braço esquerdo com gradiente
    ctx.save();
    ctx.rotate(armSwing);
    const leftArmGradient = ctx.createLinearGradient(-25, 0, -15, 20);
    leftArmGradient.addColorStop(0, '#FFFFFF');
    leftArmGradient.addColorStop(1, '#E8E8E8');
    ctx.fillStyle = leftArmGradient;
    
    ctx.beginPath();
    ctx.ellipse(-22, 5, 9, 18, -Math.PI/8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
    // Braço direito
    ctx.save();
    ctx.rotate(-armSwing);
    const rightArmGradient = ctx.createLinearGradient(15, 0, 25, 20);
    rightArmGradient.addColorStop(0, '#FFFFFF');
    rightArmGradient.addColorStop(1, '#E8E8E8');
    ctx.fillStyle = rightArmGradient;
    
    ctx.beginPath();
    ctx.ellipse(22, 5, 9, 18, Math.PI/8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
    // Mãos com movimento
    drawAnimatedHands(armSwing);
}

function drawAnimatedHands(armSwing) {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2.5;
    
    // Mão esquerda
    const leftHandY = 20 + Math.sin(player.walkFrame) * 3;
    ctx.beginPath();
    ctx.ellipse(-28, leftHandY, 7, 9, armSwing * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Dedos mão esquerda
    for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.ellipse(-31 + i * 4, leftHandY - 2, 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    
    // Mão direita
    const rightHandY = 20 - Math.sin(player.walkFrame) * 3;
    ctx.beginPath();
    ctx.ellipse(28, rightHandY, 7, 9, -armSwing * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Dedos mão direita
    for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.ellipse(27 + i * 4, rightHandY - 2, 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}

function drawLegsWithAnimation() {
    const legSwing = Math.sin(player.walkFrame + Math.PI) * 0.4;
    
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    
    // Perna esquerda
    ctx.save();
    ctx.rotate(legSwing * 0.3);
    const leftLegGradient = ctx.createLinearGradient(-12, 20, -8, 35);
    leftLegGradient.addColorStop(0, '#FFFFFF');
    leftLegGradient.addColorStop(1, '#E8E8E8');
    ctx.fillStyle = leftLegGradient;
    
    ctx.beginPath();
    ctx.ellipse(-10, 25, 7, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
    // Perna direita
    ctx.save();
    ctx.rotate(-legSwing * 0.3);
    const rightLegGradient = ctx.createLinearGradient(8, 20, 12, 35);
    rightLegGradient.addColorStop(0, '#FFFFFF');
    rightLegGradient.addColorStop(1, '#E8E8E8');
    ctx.fillStyle = rightLegGradient;
    
    ctx.beginPath();
    ctx.ellipse(10, 25, 7, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
    // Pés com movimento
    drawAnimatedFeet(legSwing);
}

function drawAnimatedFeet(legSwing) {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2.5;
    
    // Pé esquerdo
    const leftFootY = 38 + Math.sin(player.walkFrame + Math.PI) * 2;
    ctx.beginPath();
    ctx.ellipse(-10, leftFootY, 9, 6, legSwing * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Dedos pé esquerdo
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(-15 + i * 3, leftFootY - 3, 1.8, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    
    // Pé direito
    const rightFootY = 38 - Math.sin(player.walkFrame + Math.PI) * 2;
    ctx.beginPath();
    ctx.ellipse(10, rightFootY, 9, 6, -legSwing * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Dedos pé direito
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(7 + i * 3, rightFootY - 3, 1.8, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}

function drawAnimatedTail() {
    const tailWag = Math.sin(Date.now() * 0.008) * 0.5;
    
    ctx.save();
    ctx.translate(player.width/2.5, 12);
    ctx.rotate(tailWag);
    
    const tailGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 8);
    tailGradient.addColorStop(0, '#FFFFFF');
    tailGradient.addColorStop(1, '#E0E0E0');
    
    ctx.fillStyle = tailGradient;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(0, 0, 6, -Math.PI/2, Math.PI/2);
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
}

function drawWalkingParticles() {
    // Partículas de poeira quando andando
    ctx.save();
    ctx.globalAlpha = 0.6;
    
    for (let i = 0; i < 3; i++) {
        const particleX = player.x + player.width/2 + (Math.random() - 0.5) * 20;
        const particleY = player.y + player.height + Math.random() * 10;
        const size = Math.random() * 3 + 1;
        
        ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

function drawJumpAura() {
    // Aura energética quando pulando
    ctx.save();
    ctx.globalAlpha = 0.3;
    
    const auraGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
    auraGradient.addColorStop(0, 'rgba(135, 206, 235, 0.6)');
    auraGradient.addColorStop(0.7, 'rgba(173, 216, 230, 0.3)');
    auraGradient.addColorStop(1, 'rgba(135, 206, 235, 0)');
    
    ctx.fillStyle = auraGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 50 + Math.sin(Date.now() * 0.01) * 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function updatePlayer() {
    // Parar movimento se a fase estiver completa
    if (game.phaseComplete) return;
    
    // Movimento horizontal
    if (game.keys['ArrowLeft']) { 
        player.velocityX = -player.speed; 
        player.direction = -1;
        player.walkFrame += player.walkSpeed;
        player.rotationY = Math.sin(player.walkFrame) * 0.1;
    }
    else if (game.keys['ArrowRight']) { 
        player.velocityX = player.speed; 
        player.direction = 1;
        player.walkFrame += player.walkSpeed;
        player.rotationY = Math.sin(player.walkFrame) * 0.1;
    }
    else { 
        player.velocityX *= game.friction;
        player.rotationY *= 0.9; // Gradualmente volta ao normal
    }
    
    // Lógica de pulo movida para handleJump() - chamada no keydown
    
    // Animação de bounce quando no chão
    if (player.onGround) {
        player.bouncePhase += 0.3;
        player.bounceY = Math.sin(player.bouncePhase) * 2;
        player.isJumping = false;
    } else {
        player.bounceY *= 0.9;
    }
    
    // Física
    player.velocityY += game.gravity;
    player.x += player.velocityX; 
    player.y += player.velocityY;
    
    // Limites da tela
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    
    // Verificar se caiu do mapa - resetar no chão
    if (player.y > canvas.height) {
        console.log(`🔄 Snoopy caiu do mapa! Voltando ao chão...`);
        spawnPlayerOnGround();
    }
    
    // Atualizar escala da sombra baseada na altura
    const groundDistance = 550 - (player.y + player.height);
    player.shadowScale = Math.max(0.3, 1 - groundDistance / 300);
}

function checkCollisions() {
    // Verificar se a fase já foi completada
    if (game.phaseComplete) return;
    
    player.onGround = false;
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width && player.x + player.width > platform.x &&
            player.y < platform.y + platform.height && player.y + player.height > platform.y) {
            if (player.velocityY > 0 && player.y < platform.y) {
                player.y = platform.y - player.height; 
                player.velocityY = 0; 
                player.onGround = true;
                // Reset do sistema de pulo duplo ao tocar o chão
                player.canDoubleJump = false;
                player.hasDoubleJumped = false;
            }
        }
    });
    
    // Verificar colisão com rosas
    roses.forEach(rose => {
        if (!rose.collected && player.x < rose.x + rose.width && player.x + player.width > rose.x &&
            player.y < rose.y + rose.height && player.y + player.height > rose.y) {
            rose.collected = true; 
            game.score++;
            document.getElementById('scoreValue').textContent = game.score;
            
            // Verificar se todas as rosas foram coletadas
            const allRosesCollected = roses.every(r => r.collected);
            const rosesRemaining = roses.filter(r => !r.collected).length;
            
            if (allRosesCollected) {
                console.log(`Todas as rosas coletadas na fase ${game.currentPhase}!`);
                completePhase();
            } else {
                console.log(`Rosas restantes: ${rosesRemaining}`);
            }
        }
    });
}

function drawBackground() {
    // Fundo com gradiente atmosférico 3D
    const skyGradient = ctx.createRadialGradient(400, 200, 0, 400, 200, 600);
    skyGradient.addColorStop(0, '#B0E0E6');
    skyGradient.addColorStop(0.4, '#87CEEB');
    skyGradient.addColorStop(0.8, '#98FB98');
    skyGradient.addColorStop(1, '#90EE90');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Montanhas distantes (perspectiva)
    drawDistantMountains();
    
    // Sol com efeito volumétrico
    drawVolumetricSun();
    
    // Nuvens em camadas
    drawLayeredClouds();
    
    // Efeitos de luz atmosférica
    drawAtmosphericEffects();
}

function drawDistantMountains() {
    // Montanhas com múltiplas camadas para profundidade
    const layers = [
        { y: 400, alpha: 0.15, color: '#4169E1' },
        { y: 420, alpha: 0.25, color: '#6495ED' },
        { y: 450, alpha: 0.35, color: '#87CEEB' }
    ];
    
    layers.forEach((layer, index) => {
        ctx.save();
        ctx.globalAlpha = layer.alpha;
        ctx.fillStyle = layer.color;
        
        ctx.beginPath();
        ctx.moveTo(0, layer.y);
        for (let x = 0; x <= canvas.width; x += 50) {
            const height = Math.sin(x * 0.02 + index) * 40 + Math.sin(x * 0.005) * 20;
            ctx.lineTo(x, layer.y - height);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    });
}

function drawVolumetricSun() {
    const time = Date.now() * 0.001;
    
    // Halo externo
    const haloGradient = ctx.createRadialGradient(700, 80, 0, 700, 80, 120);
    haloGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
    haloGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.15)');
    haloGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    ctx.fillStyle = haloGradient;
    ctx.beginPath();
    ctx.arc(700, 80, 120, 0, Math.PI * 2);
    ctx.fill();
    
    // Sol principal com gradiente volumétrico
    const sunGradient = ctx.createRadialGradient(690, 70, 0, 700, 80, 35);
    sunGradient.addColorStop(0, '#FFFACD');
    sunGradient.addColorStop(0.4, '#FFD700');
    sunGradient.addColorStop(0.8, '#FFA500');
    sunGradient.addColorStop(1, '#FF8C00');
    
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(700, 80, 35, 0, Math.PI * 2);
    ctx.fill();
    
    // Raios animados
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 + time * 0.5;
        const length = 45 + Math.sin(time * 2 + i) * 10;
        
        ctx.save();
        ctx.translate(700, 80);
        ctx.rotate(angle);
        
        const rayGradient = ctx.createLinearGradient(0, -45, 0, -length);
        rayGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        rayGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.strokeStyle = rayGradient;
        
        ctx.beginPath();
        ctx.moveTo(0, -45);
        ctx.lineTo(0, -length);
        ctx.stroke();
        
        ctx.restore();
    }
}

function drawLayeredClouds() {
    const time = Date.now() * 0.0002;
    
    // Nuvens de fundo (mais distantes)
    drawCloudLayer(0.1, 0.4, 50, time * 0.3);
    
    // Nuvens médias
    drawCloudLayer(0.2, 0.6, 80, time * 0.5);
    
    // Nuvens próximas
    drawCloudLayer(0.3, 0.8, 120, time);
}

function drawCloudLayer(baseAlpha, maxAlpha, yBase, timeOffset) {
    for (let i = 0; i < 4; i++) {
        const x = (i * 200) + Math.sin(timeOffset + i) * 30;
        const y = yBase + Math.sin(timeOffset * 0.7 + i * 0.5) * 20;
        const alpha = baseAlpha + Math.sin(timeOffset + i) * (maxAlpha - baseAlpha);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'white';
        
        // Nuvem com múltiplas bolhas para realismo
        const bubbles = [
            { x: x - 25, y: y, r: 15 },
            { x: x - 10, y: y - 5, r: 20 },
            { x: x + 5, y: y, r: 18 },
            { x: x + 20, y: y - 3, r: 16 },
            { x: x + 35, y: y, r: 12 }
        ];
        
        ctx.beginPath();
        bubbles.forEach(bubble => {
            ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        });
        ctx.fill();
        
        ctx.restore();
    }
}

function drawAtmosphericEffects() {
    // Efeito de neblina/atmosfera
    const mistGradient = ctx.createLinearGradient(0, 300, 0, 600);
    mistGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    mistGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
    mistGradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
    
    ctx.fillStyle = mistGradient;
    ctx.fillRect(0, 300, canvas.width, 300);
    
    // Partículas de luz flutuantes
    drawFloatingLightParticles();
}

function drawFloatingLightParticles() {
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < 8; i++) {
        const x = (i * 100) + Math.sin(time + i) * 50;
        const y = 200 + Math.sin(time * 0.7 + i * 0.8) * 100;
        const alpha = (Math.sin(time * 2 + i) + 1) * 0.3;
        const size = 2 + Math.sin(time + i) * 1;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        particleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        particleGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)');
        particleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// ========== SISTEMA DE INIMIGOS ==========

function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.remove) return;
        
        ctx.save();
        ctx.translate(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
        
        if (enemy.dead) {
            // Inimigo morto - efeito de morte
            ctx.globalAlpha = Math.max(0, 1 - enemy.deathTimer / 60);
            ctx.rotate(Math.PI); // Virar de cabeça para baixo
            ctx.translate(0, enemy.bounceY);
        }
        
        // Desenhar inimigo (estilo Goomba do Mario)
        drawEnemyBody(enemy);
        
        ctx.restore();
    });
}

function drawEnemyBody(enemy) {
    const footBounce = Math.sin(enemy.walkFrame) * 2;
    
    switch(enemy.type) {
        case 'goomba':
            drawGoomba(enemy, footBounce);
            break;
        case 'spiky':
            drawSpiky(enemy, footBounce);
            break;
        case 'shell':
            drawShell(enemy, footBounce);
            break;
        default:
            drawGoomba(enemy, footBounce);
    }
}

function drawGoomba(enemy, footBounce) {
    // Corpo principal (marrom escuro)
    ctx.fillStyle = enemy.dead ? '#8B4513' : '#654321';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Corpo oval
    ctx.beginPath();
    ctx.ellipse(0, 2, enemy.width/2.2, enemy.height/2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    if (!enemy.dead) {
        // Olhos irritados
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(-6, -3, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(6, -3, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilas
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-4, -3, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(4, -3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Sobrancelha irritada
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, -8);
        ctx.lineTo(-2, -5);
        ctx.moveTo(8, -8);
        ctx.lineTo(2, -5);
        ctx.stroke();
        
        // Pés animados
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(-8, 8 + footBounce, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(8, 8 - footBounce, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawSpiky(enemy, footBounce) {
    // Corpo principal (vermelho)
    ctx.fillStyle = enemy.dead ? '#8B0000' : '#DC143C';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Corpo oval
    ctx.beginPath();
    ctx.ellipse(0, 2, enemy.width/2.2, enemy.height/2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    if (!enemy.dead) {
        // Espinhos
        ctx.fillStyle = '#8B0000';
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const spikeX = Math.cos(angle) * 8;
            const spikeY = Math.sin(angle) * 6 + 2;
            
            ctx.beginPath();
            ctx.moveTo(spikeX, spikeY);
            ctx.lineTo(spikeX + Math.cos(angle) * 4, spikeY + Math.sin(angle) * 4);
            ctx.lineTo(spikeX - Math.sin(angle) * 2, spikeY + Math.cos(angle) * 2);
            ctx.closePath();
            ctx.fill();
        }
        
        // Olhos vermelhos
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(-4, -3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(4, -3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawShell(enemy, footBounce) {
    // Corpo principal (verde)
    ctx.fillStyle = enemy.dead ? '#006400' : '#32CD32';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Casco oval
    ctx.beginPath();
    ctx.ellipse(0, 2, enemy.width/2.2, enemy.height/2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    if (!enemy.dead) {
        // Padrão do casco
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(0, 2 - i * 3, enemy.width/3 - i * 2, enemy.height/4 - i, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Cabeça pequena
        ctx.fillStyle = '#90EE90';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, -8, 6, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Olhos pequenos
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-2, -8, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(2, -8, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Pés pequenos
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.ellipse(-6, 8 + footBounce, 2, 1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(6, 8 - footBounce, 2, 1, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateEnemies() {
    if (game.phaseComplete) return;
    
    // Remover inimigos marcados para remoção
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].remove) {
            enemies.splice(i, 1);
        }
    }
    
    enemies.forEach((enemy, index) => {
        if (enemy.dead) {
            // Atualizar animação de morte
            enemy.deathTimer++;
            enemy.bounceY += 0.5; // Cair
            
            // Remover após 60 frames (1 segundo)
            if (enemy.deathTimer >= 60) {
                enemy.remove = true;
            }
            return;
        }
        
        // Movimento horizontal
        enemy.x += enemy.velocityX * enemy.direction;
        enemy.walkFrame += 0.2; // Animação de caminhada
        
        // Verificar limites da plataforma
        const platform = platforms[enemy.platformIndex];
        if (platform) {
            // Virar na borda da plataforma
            if (enemy.x <= platform.x || enemy.x + enemy.width >= platform.x + platform.width) {
                enemy.direction *= -1;
            }
            
            // Manter na plataforma
            if (enemy.x < platform.x) enemy.x = platform.x;
            if (enemy.x + enemy.width > platform.x + platform.width) {
                enemy.x = platform.x + platform.width - enemy.width;
            }
        }
    });
}

function checkEnemyCollisions() {
    if (game.phaseComplete) return;
    
    enemies.forEach((enemy, index) => {
        if (enemy.dead || enemy.remove) return;
        
        // Verificar colisão com o jogador
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            
            const playerBottom = player.y + player.height;
            const enemyTop = enemy.y;
            const playerCenterX = player.x + player.width / 2;
            const enemyCenterX = enemy.x + enemy.width / 2;
            
            // Verificar se o jogador está caindo e acerta por cima (estilo Mario)
            if (player.velocityY > 0 && playerBottom - 10 <= enemyTop && 
                Math.abs(playerCenterX - enemyCenterX) < enemy.width * 0.8) {
                
                // Jogador mata o inimigo
                enemy.dead = true;
                enemy.deathTimer = 0;
                enemy.bounceY = 0;
                
                // Fazer o jogador quicar (ajustado para o novo jumpPower)
                player.velocityY = -7;
                player.y = enemy.y - player.height;
                
                // Efeito sonoro (console)
                console.log(`💥 Inimigo eliminado! Pontos extras!`);
                
                // Pontos extras por eliminar inimigo
                game.score += 10;
                game.enemiesKilled++;
                document.getElementById('scoreValue').textContent = game.score;
                document.getElementById('enemiesValue').textContent = game.enemiesKilled;
                
                // Criar efeito de partículas
                createDeathParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                
            } else {
                // Jogador toca o inimigo lateralmente - perde vida ou reinicia
                console.log(`💀 Snoopy foi atingido por um inimigo!`);
                resetPlayerPosition();
            }
        }
    });
}

function resetPlayerPosition() {
    // Resetar posição do jogador (como no Mario quando perde vida) - sempre no chão
    spawnPlayerOnGround();
    
    // Efeito visual de reset
    console.log(`🔄 Snoopy voltou ao início da fase!`);
}

// ========== SISTEMA DE PARTÍCULAS ==========

function createDeathParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            velocityX: (Math.random() - 0.5) * 8,
            velocityY: Math.random() * -5 - 2,
            life: 30,
            maxLife: 30,
            color: ['#FFD700', '#FF6347', '#FF1493', '#00CED1'][Math.floor(Math.random() * 4)],
            size: Math.random() * 4 + 2
        });
    }
}

function updateBird() {
    if (!bird.visible) return;
    
    // Movimento horizontal
    bird.x += bird.speed;
    
    // Movimento em onda vertical
    bird.y = bird.baseY + Math.sin(bird.x * bird.waveFrequency) * bird.waveAmplitude;
    
    // Animação das asas
    bird.wingPhase += 0.3;
    
    // Reinicia do lado esquerdo quando sai da tela
    if (bird.x > canvas.width + 100) {
        bird.x = -100;
    }
}

function drawBird() {
    if (!bird.visible) return;
    
    const x = bird.x;
    const y = bird.y;
    const wingOffset = Math.sin(bird.wingPhase) * 3;
    
    ctx.save();
    
    // Cabeça
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700"; // Amarelo dourado
    ctx.fill();
    ctx.strokeStyle = "#B8860B";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Peninhas da cabeça
    ctx.beginPath();
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x - 3, y - 18);
    ctx.moveTo(x + 3, y - 12);
    ctx.lineTo(x + 6, y - 18);
    ctx.strokeStyle = "#B8860B";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Olho
    ctx.beginPath();
    ctx.arc(x - 3, y - 3, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    
    // Brilho no olho
    ctx.beginPath();
    ctx.arc(x - 2.5, y - 3.5, 0.5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    
    // Bico
    ctx.beginPath();
    ctx.moveTo(x + 9, y);
    ctx.lineTo(x + 15, y - 3);
    ctx.lineTo(x + 9, y - 6);
    ctx.closePath();
    ctx.fillStyle = "#FF8C00";
    ctx.fill();
    ctx.strokeStyle = "#B8860B";
    ctx.stroke();
    
    // Corpo
    ctx.beginPath();
    ctx.ellipse(x, y + 18, 9, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.strokeStyle = "#B8860B";
    ctx.stroke();
    
    // Asa (animada)
    ctx.beginPath();
    ctx.ellipse(x - 6, y + 18 + wingOffset, 5, 8, Math.PI * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = "#FFA500";
    ctx.fill();
    ctx.strokeStyle = "#B8860B";
    ctx.stroke();
    
    // Pernas
    ctx.beginPath();
    ctx.moveTo(x - 3, y + 33);
    ctx.lineTo(x - 3, y + 40);
    ctx.moveTo(x + 3, y + 33);
    ctx.lineTo(x + 3, y + 40);
    ctx.strokeStyle = "#FF8C00";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Pés
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 40);
    ctx.lineTo(x - 1, y + 40);
    ctx.moveTo(x + 1, y + 40);
    ctx.lineTo(x + 5, y + 40);
    ctx.stroke();
    
    // Cartinha com coração (se ainda tiver)
    if (bird.hasLetter) {
        // Envelope
        ctx.beginPath();
        ctx.rect(x + 12, y + 6, 15, 10);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "#B8860B";
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Coração na carta
        ctx.beginPath();
        ctx.moveTo(x + 19.5, y + 9);
        ctx.arc(x + 18, y + 9, 2, 0, Math.PI, true);
        ctx.arc(x + 21, y + 9, 2, 0, Math.PI, true);
        ctx.lineTo(x + 19.5, y + 13);
        ctx.closePath();
        ctx.fillStyle = "#FF1493";
        ctx.fill();
        
        // Brilho no coração
        ctx.beginPath();
        ctx.arc(x + 18.5, y + 9.5, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
    }
    
    ctx.restore();
}

function createDoubleJumpEffect(x, y) {
    // Partículas em círculo para efeito de pulo duplo
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        particles.push({
            x: x,
            y: y,
            velocityX: Math.cos(angle) * 4,
            velocityY: Math.sin(angle) * 4 - 2,
            life: 1,
            decay: 0.03,
            color: `hsl(${200 + Math.random() * 60}, 80%, 70%)`, // Tons de azul/ciano
            size: 3 + Math.random() * 2
        });
    }
    
    // Anel de energia
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        particles.push({
            x: x + Math.cos(angle) * 15,
            y: y + Math.sin(angle) * 8,
            velocityX: Math.cos(angle) * 2,
            velocityY: Math.sin(angle) * 2 - 1,
            life: 1,
            decay: 0.025,
            color: 'rgba(100, 200, 255, 0.8)',
            size: 4
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityY += 0.3; // Gravidade
        particle.life--;
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life / particle.maxLife;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    
    // Desenhar plataformas com textura
    platforms.forEach(p => { 
        // Sombra da plataforma
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(p.x + 2, p.y + 2, p.width, p.height);
        
        // Plataforma principal
        ctx.fillStyle = p.color; 
        ctx.fillRect(p.x, p.y, p.width, p.height);
        
        // Se for o chão principal, adicionar grama
        if (p.y > 500) {
            ctx.fillStyle = '#90EE90';
            ctx.fillRect(p.x, p.y, p.width, 8);
            
            // Tufos de grama
            ctx.fillStyle = '#228B22';
            for (let i = 0; i < p.width; i += 15) {
                ctx.fillRect(p.x + i, p.y, 2, 6);
                ctx.fillRect(p.x + i + 5, p.y, 1, 4);
                ctx.fillRect(p.x + i + 10, p.y, 2, 5);
            }
        }
    });
    roses.forEach(rose => {
        if (!rose.collected) {
            ctx.save();
            ctx.translate(rose.x + rose.width/2, rose.y + rose.height/2);
            
            // Caule da rosa
            ctx.fillStyle = '#228B22';
            ctx.fillRect(-2, 0, 4, rose.height);
            
            // Folhas
            ctx.fillStyle = '#32CD32';
            ctx.beginPath();
            ctx.ellipse(-6, 5, 4, 2, -Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(6, 8, 4, 2, Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
            
            // Rosa branca (pétalas)
            ctx.fillStyle = 'white';
            ctx.strokeStyle = '#DDD';
            ctx.lineWidth = 1;
            
            // Pétalas externas
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8;
                ctx.save();
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.ellipse(0, -6, 3, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
            
            // Centro da rosa
            ctx.fillStyle = '#FFFACD';
            ctx.beginPath();
            ctx.arc(0, -3, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Brilho da rosa
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(-1, -4, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    });
    
    // Desenhar inimigos
    drawEnemies();
    
    // Desenhar partículas
    drawParticles();
    
    drawPlayer(); 
    updatePlayer(); 
    updateEnemies();
    updateParticles();
    updateBird(); // Atualizar passarinho
    drawBird(); // Desenhar passarinho
    checkCollisions();
    checkEnemyCollisions();
    requestAnimationFrame(gameLoop);
}

initPhase(1); 
// Garantir que o player inicie no chão
spawnPlayerOnGround();
gameLoop();
