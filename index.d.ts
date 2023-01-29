import { StyledInterface } from 'styled-components'

declare const styled: StyledInterface

export default styled

export const px2vw: (px: string) => string | 0
export const checkIfMobile: (boundary?: number) => boolean

export * from 'styled-components'
