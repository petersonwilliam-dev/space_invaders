var PlayerShip
var PositionPlayerX, PositionPlayerY, DirectionPlayerX, DirectionPlayerY
var ShotSpeed
var PlayGame
var animationFrame
var timerAlien
var Life, LifePlayer
var timerRemoveExplosion
var AliensQuantity
var timerBoss, timerBossShot, NumBoss, LifeBoss
var IndexSound



////////////////////////////// FUNCTIONS INITIAL PAGE ////////////////////////////////////////////////


function SelectShip(numShip) {

    let ShipsImgs = document.getElementsByClassName("img-ship")
    let containers = document.getElementsByClassName("ship")
    let currentShip = document.getElementById("img-current-ship") 

    window.localStorage.setItem("ship", ShipsImgs[numShip].src)

    let ImgShip = window.localStorage.getItem("ship");

    currentShip.src = ImgShip

    for (let i = 0; i < containers.length; i++) {
        containers[i].setAttribute("class", "ship")
    }

    containers[numShip].setAttribute("class", "ship selected")

}

function moveScreenDown() {

    let imgCurrent = document.getElementById('img-current-ship')

    if (!window.localStorage.getItem('ship')) {
        imgCurrent.src = "img/ship1.png"
    } else {
        imgCurrent.src = window.localStorage.getItem("ship")
    }

    window.scroll({
        top: document.getElementById('select-screen').offsetTop,
        behavior: 'smooth',
    })

}

function moveScreenUp() {

    window.scroll({
        top: 0,
        behavior: 'smooth',
    })
}



////////////////////////////////////// MOVEMENT FUNCTIONS ////////////////////////////////////////////////////


function teclaDown(event){

     let tecla = event.keyCode;

    switch (tecla) {
        case 37:
            DirectionPlayerX = -1;
        break;
        case 38:
            DirectionPlayerY = -1;
        break;
        case 39:
            DirectionPlayerX = 1;
        break;
        case 40:
            DirectionPlayerY = 1;
        break;
        case 32:
        
        break;
    }

}

function teclaUp(event) {
    let tecla = event.keyCode

    switch(tecla) {
        case 37:
            DirectionPlayerX = 0;
        break;
        case 38:
            DirectionPlayerY = 0;
        break;
        case 39:
            DirectionPlayerX = 0;
        break;
        case 40:
            DirectionPlayerY = 0;
        break;
        case 32:
            playerShot(PositionPlayerX+17, PositionPlayerY-5)
        break;
    }
}

function movePlayer() {
    PositionPlayerX += DirectionPlayerX *5
    PositionPlayerY += DirectionPlayerY *5

    PlayerShip.style.left = PositionPlayerX+"px"
    PlayerShip.style.top = PositionPlayerY+"px"

}

function playerShot(PositionX, PositionY) {

    let shot = document.createElement("div")
    let imgShot = document.createElement("img")

    let PositionShot = document.createAttribute("style")
    PositionShot.value = `top: ${PositionY}px; left: ${PositionX}px`;

    shot.setAttributeNode(PositionShot)
    shot.setAttribute("class", "shot")
    imgShot.src = "img/shootplayer.png"

    shot.appendChild(imgShot)
    document.getElementById("game-screen").appendChild(shot)
}

function moveShotPlayer() {
    let shots = document.getElementsByClassName('shot')

    for (let i = 0; i < shots.length; i++) {
        if (shots[i]) {
            let TopShot = shots[i].offsetTop;
            shots[i].style.top = (TopShot - ShotSpeed)+"px"
            collisionShotPlayer(shots[i])

            if (BossInGame) {
                collisionShotPlayerInBoss(shots[i])
            }

            if (TopShot < 0) {
                shots[i].remove();
            }
        }
    }
}

//////////////////////////////////// ALIEN \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


function createAlien() {
    
    if (AliensQuantity > 0) {
        let ContainerAlien = document.createElement("div")
        let ImgAlien = document.createElement("img")
    
        let PositionAlien = document.createAttribute("style")
    
        let LeftAlien = Math.random() * window.innerWidth
        let TopAlien = Math.random() * 50
        let NumberAlien = Math.floor(Math.random() * 4)
        let direction = Math.floor(Math.random() * 3)
    
        PositionAlien.value = `left: ${LeftAlien}px; top: ${TopAlien}px`
    
        if (direction == 1) {
            ContainerAlien.setAttribute("data-diretion", "left")
        } else if (direction == 2) {
            ContainerAlien.setAttribute("data-direction", "right")
        }
    
        ContainerAlien.setAttributeNode(PositionAlien)
        ContainerAlien.setAttribute("class", "container-alien")
        ImgAlien.src = `img/alien${NumberAlien}.webp`
        ImgAlien.setAttribute("class", "alien")
    
        ContainerAlien.appendChild(ImgAlien)
        document.getElementById('game-screen').appendChild(ContainerAlien)

        AliensQuantity -= 1;
    }
    
}

function movementAlien() {

    let Aliens = document.getElementsByClassName("container-alien")

    for (let i = 0; i < Aliens.length; i++) {

        let AlienDirection = Aliens[i].getAttribute("data-direction")

        if (Aliens[i]) {
            let AlienLeft = Aliens[i].offsetLeft;

            if (AlienLeft < 0) {
                Aliens[i].setAttribute("data-direction", "right")
            } else if (AlienLeft > window.innerWidth - 50){
                Aliens[i].setAttribute("data-direction", "left")
            }

            if (AlienDirection == "right") {
                Aliens[i].style.left = (Aliens[i].offsetLeft + 3)+"px"
            } else {
                Aliens[i].style.left = (Aliens[i].offsetLeft - 3)+"px"
            }
        }
    }

}

function createShotAlien(PositionAlienX, PositionAlienY) {

    let shotAlien = document.createElement("div")
    let ImgShotAlien = document.createElement("img")

    let PositionShotAlien = document.createAttribute("style")

    PositionShotAlien.value = `top: ${PositionAlienY}px; left: ${PositionAlienX}px`

    shotAlien.setAttributeNode(PositionShotAlien)
    shotAlien.setAttribute("class", "shot-alien")

    ImgShotAlien.src = "img/enemyshoot.png"

    shotAlien.appendChild(ImgShotAlien)
    document.getElementById("game-screen").appendChild(shotAlien)

}

function shotAlien() {

    AliensAtPlay = document.getElementsByClassName("container-alien")

    for (let i = 0; i < AliensAtPlay.length; i++) {
        if (AliensAtPlay[i]) {
            createShotAlien((AliensAtPlay[i].offsetLeft + 15), (AliensAtPlay[i].offsetTop + 51))
        }
    }
}

function moveShotAlien() {

    let aliensShots = document.getElementsByClassName("shot-alien")

    for (let i = 0; i < aliensShots.length; i++) {
        if (aliensShots[i]) {
            let shotAlienTop = aliensShots[i].offsetTop;
            aliensShots[i].style.top = (shotAlienTop + 5)+"px"
            collisionShotAlien(aliensShots[i])
            if (shotAlienTop > window.innerHeight) {
                aliensShots[i].remove()
            }
        }
    }
}


///////////////////////////////////////////// COLLISION ///////////////////////////////////////////////////////

function collisionShotPlayer(shot) {
    let aliens = document.getElementsByClassName('container-alien')

    for (let i = 0; i < aliens.length; i++) {
        if (aliens[i]) {
            if (
                (shot.offsetTop <= aliens[i].offsetTop+50) &&
                (shot.offsetLeft >= aliens[i].offsetLeft) &&
                (shot.offsetLeft <= aliens[i].offsetLeft+50)
            ) {
                explosion(shot.offsetLeft-20, shot.offsetTop-50)
                aliens[i].remove()
                shot.remove();
                createAlien()
            }
        }
    }
}

function collisionShotAlien(shotAlien) {

    if (
        (shotAlien.offsetTop >= PlayerShip.offsetTop) &&
        (shotAlien.offsetTop <= PlayerShip.offsetTop+50) &&
        (shotAlien.offsetLeft >= PlayerShip.offsetLeft) &&
        (shotAlien.offsetLeft <= PlayerShip.offsetLeft+55) 
    ) {
        explosion(shotAlien.offsetLeft-20, shotAlien.offsetTop-20)
        shotAlien.remove();
        LifePlayer -= 30
        createExplosionSound()
        Life.style.width = LifePlayer+"px"
    }
}

function collisionShotPlayerInBoss(Shot) {

    let boss = document.getElementById('boss')

    if (
        (Shot.offsetTop <= boss.offsetTop + 421) &&
        (Shot.offsetTop >= boss.offsetTop) &&
        (Shot.offsetLeft >= boss.offsetLeft) && 
        (Shot.offsetLeft <= boss.offsetLeft + 373)
    ) {
        explosion(boss.offsetLeft + 175, boss.offsetTop + 250)
        Shot.remove()
        LifeBoss -= 30;
        console.log(LifeBoss)
    }
}

function explosion(PositionExplosionX, PositionExplosionY) {
    
    let Explosion = document.createElement("div")
    let imgExplosion = document.createElement("img")

    let ExplosionPosition = document.createAttribute("style")
    ExplosionPosition.value = `top: ${PositionExplosionY}px; left: ${PositionExplosionX}px`

    imgExplosion.src = "img/explosion.gif?"+new Date()

    Explosion.setAttributeNode(ExplosionPosition)
    Explosion.appendChild(imgExplosion)
    Explosion.setAttribute("class", "explosion")

    document.getElementById("game-screen").appendChild(Explosion)

    timerRemoveExplosion = setTimeout(() => Explosion.remove(), 2000)
}

function explosionBoss(PositionBossX, PositionBossY) {

    let Explosion = document.createElement("div")
    let imgExplosion = document.createElement("img")

    let ExplosionPosition = document.createAttribute("style")
    ExplosionPosition.value = `top: ${PositionBossY}px; left: ${PositionBossX}px`

    imgExplosion.src = "img/explosionBoss.gif?"+new Date()

    Explosion.setAttributeNode(ExplosionPosition)
    Explosion.appendChild(imgExplosion)
    Explosion.setAttribute("class", "explosionBoss")

    document.getElementById("game-screen").appendChild(Explosion)

    timerRemoveExplosion = setTimeout(() => Explosion.remove(), 2000)
}

function createExplosionSound() {

    let Sound = document.createElement("audio")
    Sound.setAttribute("id", "sound"+IndexSound)
    Sound.src = "img/soundExplosion.mpeg?"+new Date()

    document.body.appendChild(Sound)

    document.getElementById("sound"+IndexSound).play()

}

////////////////////////////////////////////// BOSS ENEMY //////////////////////////////////////////////////////////////

function createBoss() {

    if (NumBoss > 0) {
        let Boss = document.createElement("div")
        let ImgBoss = document.createElement("img")
    
        let BossPosition = document.createAttribute("style")
        BossPosition.value = `left:${window.innerWidth/3}px`
    
        ImgBoss.src = "img/boss.png"
    
        Boss.setAttributeNode(BossPosition)
        Boss.setAttribute("class", "boss")
        Boss.setAttribute("id", "boss")

        Boss.setAttribute("data-directionW", "right")
        Boss.setAttribute("data-directionH", "down")
    
        Boss.appendChild(ImgBoss)
        document.getElementById("game-screen").appendChild(Boss)
        
        timerBoss = setTimeout(() => {
            Boss.classList.add('visible')
            setTimeout(() => {
                BossInGame = true
                timerBossShot =  setInterval(() => {
                    createShotAlien(Boss.offsetLeft+175, Boss.offsetTop+350)
                }, 300) 
            }, 5000)
        })

        NumBoss--
    }
}

function movementBoss() {

    let boss = document.getElementById("boss")

    let bossTop = boss.offsetTop
    let bossLeft = boss.offsetLeft

    let directionW = boss.getAttribute("data-directionW")
    let directionH = boss.getAttribute("data-directionH")

    if (bossTop >= 20) {
        boss.setAttribute("data-directionH", "up")
    } else if (bossTop <= -100){
        boss.setAttribute("data-directionH", "down")
    }

    if (bossLeft < 0) {
        boss.setAttribute("data-directionW", "right")
    } else if (bossLeft > window.innerWidth - 300) {
        boss.setAttribute("data-directionW", "left")
    }


    if (directionH == "down") {
        boss.style.top = (bossTop + 400)+"px"
    } else {
        boss.style.top = (bossTop - 400)+"px"
    }

    if (directionW == "right") {
        boss.style.left = (bossLeft + 900)+"px"
    } else {
        boss.style.left = (bossLeft - 900)+"px"
    }

}


///////////////////////////////////////////// MANAGE GAME /////////////////////////////////////////////////////////////


function LifeColor() {
    if (LifePlayer <= 300 && LifePlayer > 150) {
        Life.style.background = "rgb(44, 215, 44)"
    }else if (LifePlayer <= 150 && LifePlayer > 50) {
        Life.style.background = "orange";
    } else if (LifePlayer <= 75) {
        Life.style.background = "red";
    }
}


function manageGame() {

    let aliensAtPlay = document.getElementsByClassName('container-alien')

    if (PlayGame) {
        if (LifePlayer <= 0) {
            PlayGame = false

            explosion(PlayerShip.offsetLeft+20, PlayerShip.offsetTop+20)
            clearInterval(timerAlien)
            createExplosionSound()
            PlayerShip.style.display = "none";

            setTimeout(() => {
                document.getElementById("game-screen").style.display = "none"
                    document.getElementById("result-screen").style.display = "flex"
                    document.getElementById("result").innerHTML = "Você Perdeu!"
                    document.getElementById("message").innerHTML = "Você Infelizmente não conseguiu, jogue novamente para impedir dessa vez!"
            }, 3000)
        } else if (aliensAtPlay.length <= 0 && AliensQuantity <= 0) {
            clearInterval(timerAlien)
            createBoss()
        }

        if (BossInGame) {

            let boss = document.getElementById("boss")

            if (LifeBoss <= 0 ) {
                PlayGame = false
                BossInGame = false
                explosionBoss(boss.offsetLeft + 50, boss.offsetTop+50)
                clearInterval(timerAlien)
                createExplosionSound()
                clearInterval(timerBossShot)
                boss.remove()

                setTimeout(() => {
                    document.getElementById("game-screen").style.display = "none"
                    document.getElementById("result-screen").style.display = ""
                    document.getElementById("result").innerHTML = "Você ganhou!"
                    document.getElementById("message").innerHTML = "Você conseguiu defender a terra, parabéns!!"
                }, 3000)
            }
        }
    }
}


function game() {
    if (PlayGame) {
        movePlayer()
        moveShotPlayer()
        movementAlien()
        moveShotAlien()
        manageGame()
        LifeColor()

        if (BossInGame) {
            movementBoss()
        }
    }
    animationFrame = requestAnimationFrame(game)
}


function restartGame() {

    // ASSIGNING VALUES

    DirectionPlayerX = DirectionPlayerY = 0
    PositionPlayerX = window.innerWidth / 2
    PositionPlayerY = window.innerHeight / 1.2
    ShotSpeed = 7
    LifePlayer = 300
    AliensQuantity = 40
    PlayGame = true
    PlayerShip.style.display = "block"

    // BOSS VALUES

    NumBoss = 1
    BossInGame = false
    LifeBoss = 3000;

    // FUNCTIONS SCREEN

    document.getElementById("result-screen").style.display = "none"

    document.getElementById('game-screen').style.display = "block"

    // REMOVE ELEMENTS

        let shotAliens = document.getElementsByClassName('shot-alien')
        let shotPlayer = document.getElementsByClassName('shot')
    
        for (let i = 0; i < shotAliens.length; i++) {
            shotAliens[i].remove()
        }
    
        for (let i = 0; i < shotPlayer.length; i++) {
            shotPlayer[i].remove()
    }
    

    Life.style.width = LifePlayer+"px";

    for (let i = 0; i < 10; i++) {
        createAlien()
    }

    timerAlien = setInterval(shotAlien, 1500)
    cancelAnimationFrame(animationFrame)

    game()
}


function iniciaJogo() {

    // ASSIGNING VALUES

    PlayerShip = document.getElementById("player-ship")
    Life = document.getElementById("life-player")

    DirectionPlayerX = DirectionPlayerY = 0
    PositionPlayerX = window.innerWidth / 2
    PositionPlayerY = window.innerHeight / 1.2
    ShotSpeed = 7
    LifePlayer = 300
    AliensQuantity = 40
    PlayGame = true
    IndexSound = 0;

    // BOSS VALUES

    NumBoss = 1
    BossInGame = false
    LifeBoss = 3000;


    // SCREEN CHANGE

    document.getElementById("container-game").style.display = "none"
    document.getElementById("result-screen").style.display = "none"

    document.getElementById('game-screen').style.display = "block"

    // CHANGE SHIP

    if (window.localStorage.getItem('ship')) {
        PlayerShip.src = window.localStorage.getItem('ship')
    } else {
        PlayerShip.src = "img/ship1.png"
    }

    // FUNCTIONS

    window.addEventListener('keydown', teclaDown)
    window.addEventListener('keyup', teclaUp)

    for (let i = 0; i < 10; i++) {
        createAlien()
    }

    timerAlien = setInterval(shotAlien, 1500)
    game()

}
