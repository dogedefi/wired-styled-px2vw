/* eslint-disable no-debugger */
import styled from 'styled-components'

const pxRe = /-?\d*[.\d]*px/g
const base64Re = /^data:\w+\/[a-zA-Z+\-.]+;base64,/i

const DRAFT_WIDTH = process.env.MOBILE_DESIGN_DRAFT_WIDTH ? Number(process.env.MOBILE_DESIGN_DRAFT_WIDTH) : 750

function checkIfMobile(boundary = 800) {
    const isMobile = window.screen.width <= boundary || /mobile|ios|android/gi.test(navigator.userAgent)

    // chrome
    if (/chrome/gi.test(navigator.userAgent) && window.screen.width > boundary) {
        return false
    }
    return isMobile
}

const px2vw = px => {
    return Number(px)
        ? checkIfMobile()
            ? `${Math.round((Number(px) / (DRAFT_WIDTH / 100)) * 100000) / 100000}vw`
            : `${px}px`
        : 0
}

const convertStringPx2vw = style => {
    if (!style) return style

    if (
        !base64Re.test(style) && // 非base64字符串
        pxRe.test(style) // 包含px单位
    ) {
        return style.replace(pxRe, value => px2vw(value.replace('px', '')))
    }

    return style
}

const isKeyframes = interpolation =>
    Object.prototype.toString.call(interpolation) === '[object Object]' &&
    interpolation.constructor.name === 'Keyframes'

const convertKeyframesPx2vw = keyframes => {
    keyframes.stringifyArgs = keyframes.stringifyArgs.map(convertStringPx2vw)

    return keyframes
}

const convertInterpolationPx2vw = interpolation => {
    if (typeof interpolation === 'string') {
        return convertStringPx2vw(interpolation)
    }

    if (isKeyframes(interpolation)) {
        return convertKeyframesPx2vw(interpolation)
    }

    if (Array.isArray(interpolation)) {
        return interpolation.map(convertInterpolationPx2vw)
    }

    if (typeof interpolation === 'function') {
        return props => convertInterpolationPx2vw(interpolation(props))
    }

    return interpolation
}

const withCss = styled => {
    const interleave = (strings, ...interpolations) => {
        strings = strings.map(convertStringPx2vw)

        interpolations = interpolations.map(convertInterpolationPx2vw)

        return styled(strings, ...interpolations)
    }

    Object.keys(styled).forEach(prop => (interleave[prop] = withTemplateFunc(styled[prop])))

    return interleave
}

const withTemplateFunc = styled => (...props) => withCss(styled(...props))

export default (styled => {
    const obj = withTemplateFunc(styled)

    Object.keys(styled).forEach(key => {
        obj[key] = withCss(styled[key])

        Object.keys(styled[key]).forEach(prop => (obj[key][prop] = withTemplateFunc(styled[key][prop])))
    })

    return obj
})(styled)
export { px2vw, checkIfMobile }
export * from 'styled-components'
