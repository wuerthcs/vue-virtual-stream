# vue-virtual-stream ([Demo](https://zip-software.github.io/vue-virtual-stream/))

> A virtualized list component for chats, comment lists and streams in general.

[Demo](https://zip-software.github.io/vue-virtual-stream/)

This Vue component can be used to build large lists of virtual components without a limited amount of items (For example chats, comment sections, streams, etc.). It's not optimized for fetched data yet but will be optimized in the future.

**IMPORTANT NOTE**<br />
This package is not final yet and still in development. There can be strange behaviour while scrolling or recalculation of heights. Please create issues whenever you encounter a problem.

This repository contains

1. The source files for the Vue component
2. Scripts to built your own packaged versions via rollup
3. An example demo

## Table of Contents

* [Background](#background)
* [Install](#install)
* [Usage](#usage)
* [Options](#options)
* [Events](#events)
* [Maintainers](#maintainers)
* [Contributing](#contributing)
* [License](#license)

## Background

Since Vue lacks a lot of virtualization options and the few we have are not optimized for unlimited sets of data, this package was started to be developed to counter some issues we have with large datasets in Vue at the moment. This includes

* Limitations of items in a list because of max-height limitation of DOM elements
* Unflexible behaviour when new items or content is pushed to the list
* Strange control on how the component should scroll or behave

## Install

You can install this package via NPM or Yarn.

```sh
npm i @zip-software/vue-virtual-stream --save
```

We also offer **esm**, **unpkg** and **umd** versions. You can find all different version in the `dist/` folder after the package finished building.

## Usage

```vue
<template>
    <virtual-stream :items="items">
        <template slot-scope="{ item }">
            <div>{{ item.text }}</div>
        </template>
    </virtual-stream>
</template>

<script>
    import VirtualStream from '@zip-software/vue-virtual-stream'

    export default {
        components: {
            VirtualStream,
        },
        ...
    }
</script>
```

## Options (Props)

### items
`items` needs to be an array of items to iterate through. You can use the `<template>` tag to customize rendering of items from outside of the component.

* **Types**: Array
* **Required**: true
* **Default**: none

```vue
<VirtualStream :items="items">
    <template slot-scope="{ item }">
        <div>{{ item.text }}</div>
    </template>
</VirtualStream>
```

### reversed
This prop can be used to enable scrolling from the bottom of the list. This will reverse scroll ordering and rendering.

* **Types**: Boolean
* **Required**: false
* **Default**: false

```vue
<VirtualStream :items="items" reversed>
    ...
</VirtualStream>
```

### count
This prop controls how many items should be loaded into the DOM. Play around with this for performance and ux tests.

* **Types**: Number
* **Required**: false
* **Default**: 40

```vue
<VirtualStream :items="items" :preload="50">
    ...
</VirtualStream>
```

### offset
This prop controls the offset (count of items) that will be used to detect when the list of virtualized items will be updated. Adjust this to your needs.

* **Types**: Number
* **Required**: false
* **Default**: 5

### watchResizes
This prop handles if the virtualization should watch resize events

* **Types**: Boolean
* **Required**: false
* **Default**: true

## Events

### scroll

This event is triggered whenever the virtualized list is scrolled. When scrolled to the start / end you will receive `start` or `end` as a data passed by the event

### dimensions

Will be emitted when the dimensions were recalculated

### newitem

Will be emitted when a new item was added to the virtualized list

## Maintainers
This project is maintained by:

* [ZIP Software](https://github.com/ZIP-Software)
* [bdbch](https://github.com/bdbch)

## Contributing

Feel free to dive in! [Open an issue](https://github.com/ZIP-Software/vue-virtual-stream/issues) or submit PRs. Check out our Code of Conduct if you have any questions.

## License

[MIT](https://github.com/ZIP-Software/vue-virtual-stream/blob/master/LICENSE) © ZIP-Software
