import { Audio } from 'expo';

export const soundObject = new Audio.Sound();
try {
    soundObject.loadAsync(require('../../assets/sounds/revolver.mp3'));
} catch (error) {
    console.log(error)
}