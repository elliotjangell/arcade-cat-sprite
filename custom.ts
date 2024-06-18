namespace SpriteKind {
    export const Cat = SpriteKind.create()
    export const Target = SpriteKind.create()
}
enum MyEnum {
    //% block="tone 1"
    One,
    //% block="tone 2"
    Two,
    //% block="tone 3"
    Three,
    //% block="tone 4"
    Four
}

/**
 * Digital Cat
 */
//% weight=100 color=#FFBFCC icon= groups=[Create, Reaction, Interact, Control]
namespace cat {
    let myCat: Sprite
    let meowImg: Image
    let purrImg: Image
    let idleImg: Image
    let created: boolean
    let purrWhenPet: boolean = false
    let petting: boolean
    let followSprite: Sprite
    let heartSprite: Sprite
    let outcome: () => void
    forever(function() {
        if (petting) {
            petting = false
            heartSprite = sprites.create(img`
    . 2 2 . 2 2 . 
    2 3 2 2 2 2 e 
    2 2 2 2 2 2 e 
    2 2 2 2 2 2 e 
    . 2 2 2 2 e . 
    . . 2 2 e . . 
    . . . e . . . 
    `, SpriteKind.Player)
            for (let index = 0; index < 10; index++) {
                heartSprite.scale = 1.75
                heartSprite.y = (myCat.top - 10)
                heartSprite.x = (myCat.x)
                pause(500)
                heartSprite.scale = 1
                heartSprite.y = (myCat.top - 10)
                heartSprite.x = (myCat.x)
                pause(500)
            }
            sprites.destroy(heartSprite)

        }
    })
    /**
    * Returns cat as sprite
    */
    //% block="cat sprite" group=Create
    export function getCat(): Sprite {
        return myCat
    }
    /**
    * Draw the cat's purr image
    * @param img the image to display when the cat purrs
    */
    //% block="Draw your cat's purr image here %img=screen_image_picker" group=Create
    export function setPurr(img: Image): void {
        purrImg = img
    }
    /**
     * Draw the cat's meow image
     * @param img the image to display when the cat meows
     */
    //% block="Draw your cat's meow image here %img=screen_image_picker" group=Create
    export function setMeow(img: Image): void {
        meowImg = img
    }
    /**
     * Draw your own cat image and watch the cat come to life
     * @param img the appearance of the cat
     */
    //% block="Draw your cat here %img=screen_image_picker" group=Create
    export function spawn(img: Image): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.Cat)
        myCat = sprites.create(img, SpriteKind.Cat)
        created = true
        idleImg = myCat.image
    }
    /** 
    * Move the cat smoothly to a given position
    * @param x the target x coordinate
    * @param y the target y coordinate
    */
    //% block="Move cat to x %x y %y with speed %s" group=Control
    export function moveTo(x: number, y: number, s: number): void {
        followSprite = sprites.create(img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`, SpriteKind.Target)
        followSprite.setPosition(x, y)
        myCat.follow(followSprite, s, 400)
        pauseUntil(() => myCat.x==x && myCat.y==y)
        sprites.destroy(followSprite)
    }
    /** 
    * Set the cat's position to a given position
    * @param x the target x coordinate
    * @param y the target y coordinate
    */
    //% block="Set cat position to x %x y %y" group=Control
    export function setPosition(x: number, y: number): void {
        myCat.setPosition(x, y)
    }
    /** 
    * Move the cat with direction buttons with the given vx and vy
    * @param vx the x velocity value that controls the cat's speed
    * @param vy the y velocity value that controls the cat's speed
    */
    //% block="Move cat with buttons||vx %vx vy %vy" group=Control
    //% vx.shadow="spriteSpeedPicker"
    //% vy.shadow="spriteSpeedPicker"
    //% expandableArgumentMode="toggle"
    export function moveWithButtons(vx: number, vy: number): void {
        controller.moveSprite(myCat, vx, vy)
    }
    /**
    * Pet the cat. If purr when pet is on, your cat will purr
    */
    //% block="Pet" group=Interact
    export function pet(): void {
        petting = true
        if (purrWhenPet) {
            myCat.setImage(purrImg)
            music.stopAllSounds()
            music.play(music.createSoundEffect(WaveShape.Triangle, 6, 1, 10000, 0, 9999, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
            myCat.setImage(idleImg)
        }
    }
    /**
    * Toggle whether the cat purrs after being pet
    */
    //% block="Purr when pet set to %onoff=toggleOnOff" group=Interact
    export function purrIfPet(onoff: boolean): void {
        purrWhenPet = onoff
    }
    /**
     * Make the cat purr
     */
    //% block="Purr" group=Reaction
    export function purr(): void {
        myCat.setImage(purrImg)
        music.stopAllSounds()
        music.play(music.createSoundEffect(WaveShape.Triangle, 8, 1, 10000, 0, 9999, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
        myCat.setImage(idleImg)
    }
    /**
     * Make the cat meow in a given tone
     * @param tone the tone of the cat's meow
     */
    //% block="Meow || with %tone" group=Reaction
    export function meow(tone?: MyEnum): void {
        myCat.setImage(meowImg)
        music.stopAllSounds()
        if(tone==MyEnum.One) {
            music.play(music.createSong(hex`0078000408010102001c000c960064006d019001000478002c010000640032000000000a0600050600000004000114`), music.PlaybackMode.InBackground)
        } else if (tone==MyEnum.Two) {
            music.play(music.createSong(hex`0078000408010102001c000c960064006d019001000478002c010000640032000000000a0600050600000004000119`), music.PlaybackMode.InBackground)
        } else if (tone==MyEnum.Three) {
            music.play(music.createSong(hex`0078000408010102001c000c960064006d019001000478002c010000640032000000000a060005060000000400011d`), music.PlaybackMode.InBackground)
        } else if (tone==MyEnum.Four) {
            music.play(music.createSong(hex`0078000408010102001c000c960064006d019001000478002c010000640032000000000a0600050600000004000120`), music.PlaybackMode.InBackground)
        } else {
            music.play(music.createSong(hex`0078000408010102001c000c960064006d019001000478002c010000640032000000000a0600050600000004000114`), music.PlaybackMode.InBackground)
        }
        pause(750)
        myCat.setImage(idleImg)
    }
}
