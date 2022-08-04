import { StyledInterface } from 'styled-components'

declare const styledPx2vw: StyledInterface

export default styledPx2vw

export const px2vw: (px: string) => string | 0
export const checkIfMobile: (boundary?: number) => boolean

export * from 'styled-components'
