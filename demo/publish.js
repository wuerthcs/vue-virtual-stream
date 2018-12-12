const ghpages = require('gh-pages')

ghpages.publish('./dist', (err) => {
    if (err) {
        console.error('The demo could not be published to github')
        console.error(err)
    }
})