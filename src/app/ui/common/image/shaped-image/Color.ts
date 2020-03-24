import { Color as ChromaColor } from 'chroma-js'
import chroma from 'chroma-js';



export type Color =
    string |
    number |
    number[] |
    { h: number, s: number, l: number, a?: number } |
    { l: number, c: number, h: number, a?: number } |
    { c: number, m: number, y: number, k: number, a?: number } |
    ChromaColor;