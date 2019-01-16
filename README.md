# vue-virtual-stream - [Demo](https://zip-software.github.io/vue-virtual-stream/)

> A virtualized list component for chats, comment lists and streams in general.

This Vue component can be used to build large lists of virtual components without a limited amount of items (For example chats, comment sections, streams, etc.). It's not optimized for fetched data yet but will be optimized in the future.

This repository contains

1. The source files for the Vue component
2. Scripts to built your own packaged versions via rollup
3. An example demo

## Example

```html
<template>
    <div class="my-component">
        <VirtualStream :items="myItems" :count="100" :offset="20">
            <template slot-scope="{ item, index }">
                <div>{{ item.text }} - {{ index }}</div>
            </template>
        </VirtualStream>
    </div>
</template>
```

## Documentation

You can find the documentation [here](https://vue-virtual-stream.zip.app/).

## Maintainers
This project is maintained by:

* [ZIP Software](https://github.com/ZIP-Software)
* [bdbch](https://github.com/bdbch)

## Contributing

Feel free to dive in! [Open an issue](https://github.com/ZIP-Software/vue-virtual-stream/issues) or submit PRs. Check out our Code of Conduct if you have any questions.

## License

[MIT](https://github.com/ZIP-Software/vue-virtual-stream/blob/master/LICENSE) © ZIP-Software
