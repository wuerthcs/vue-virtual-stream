import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'

export default {
    input: 'src/index.js',
    output: {
        name: 'VueVirtualStream',
        exports: 'named',
    },
    plugins: [
        vue({
            css: true,
            compileTemplate: true,
        }),
        buble(),
    ],
}