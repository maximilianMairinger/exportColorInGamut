<h1> <img src="pics/icon.png" style="display: inline-block; height: .95em; margin-right: 5px; margin-bottom: -5px"/> Figma/Figjam export color in correct gamut</h1>

![Flowchart to JSON Illustration](pics/header.png)

> Note: This plugin is aimed at developers/designers working with a environment/monitor that supports a color space with a wider gamut than sRGB. Figma running in a browser is limited to sRGB currently, however the desktop app supports the option to use the native OS one. You may need to enable this in the settings under: `Figma > Preferences > Color Space > Unmanaged`.

When working in a wider color gamut (like the display of a modern macbook, supporting p3) and coping colors to be rendered on the web you may find them to look different (notably less saturated), to what you designed. While this is to some extent a invadable consequence of converting to a smaller color gamut (sRGB), as some colors simply cannot be represented there, we can do better than clipping off the values that are out of range (which undermines all deltas of colors not inside the range) as well as linearly interpolating from the respective corners of the gamut (which is not perceptually uniform) (which is what figma currently does). There are better ways of converting colors to a lower color space while respecting both concerns. The specific implementation is explained here [on colorjs.io](https://colorjs.io/docs/gamut-mapping.html). The result is not by the nature of the problem not perfect but much more sensible. Especially as we are, as of recently, not limited to sRGB anymore on the web. The new CSS Color Module Level 4 specifies the `color()` function with which we can represent colors in wider color spaces, when supported. When not supported it applies a similar (sensible) color gamut mapping algorithm than explained above. As this feature is decently new we provide a fallback sRGB representation as well. This plugin copies both representations to your clipboard, so you can paste them into your code.

> Note that this plugin is currently only aimed displays/environment using the p3 color space, if you are on a different one (that is supported by [colorjs.io](https://colorjs.io/docs/spaces.html), please write me / submit a issue and I will try to make it more modular)

## Usage

Install it on the [figma community](https://www.figma.com/community/plugins) and try it out [here](https://www.figma.com/file/CB5B3pqUGaa2A4hTMEfeAv/Playground-color-gamut?type=whiteboard&node-id=0%3A1&t=pVLNRCm9OHaCRqaX-1). 

Select a any element, and run the plugin. A string like the following will be copied to your clipboard:

```css
background: rgb(71.942% 0% 5.7326%);
background: color(display-p3 0.6583 0.1125 0.1125);
```

## Limitations

Gradient fills and opacity are not supported yet. If you need them, please write me / submit a issue and I will try to add this feature.
