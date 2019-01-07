const getBrowser = () => {
    const ua = navigator.userAgent.toLowerCase()

    if (ua.indexOf('chrome') > -1) {
        return 'google-chrome'
    }
    
    if (ua.indexOf('safari') > -1) {
        return 'safari'
    }

    return 'general'
}

export default getBrowser