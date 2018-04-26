---
title: "Dynamic Syntax Highlighting with React.js"
layout: post
categories: [programming, webdev, js]
---

Let's say you're building a modern web app.
You're using [react](https://reactjs.org/), you're set up with [webpack code splitting](https://webpack.js.org/guides/code-splitting/), you render stuff on the server-side, everything is awesome.
Even better, your dependencies are really lean-and-mean: you fetch stuff as you go, so the initial bundle is very small!

You might run into a problem, though, if you need to render user-generated Markdown. 
You're already using the excellent [react-markdown](https://github.com/rexxars/react-markdown) library, so that's all working fine, but the [recommended way to do syntax highlighting](https://github.com/rexxars/react-markdown-examples/blob/master/examples/custom-renderers/code-renderer.js) has the rather large problem that you need to manually require the languages you want to use.
Worse, they're all bundled together.

You don't want this.
You want to be able to deliver no highlighting code, then allow the user to dynamically fetch the required highlighting files, like how the rest of your app works.
Ideally, you even want it to render a non-highlighted version first, then switch to the highlighted one when its ready.
How might this get done?

<!--more-->

Well, here's a lovely demo:

<div id="dyn-highlight-demo">

</div>

Pretty neat, huh?
Thankfully, this actually isn't very hard.

# Implementation 

First off, get a copy of [react-loadable](https://github.com/jamiebuilds/react-loadable).
This is a higher-order-component that makes things a lot easier.
We're also going to need [react-lowlight](https://github.com/rexxars/react-lowlight), and a copy of [highlight.js](https://highlightjs.org/).

So, we're going to create a custom element to render `code` blocks.
This element is going to be passed a few props, but we only really care about two: `language` and `value`.
The `language` prop, as the name implies, contains the language supplied to the block.
The `value` prop contains the actual code in the block.
So, the approach seems obvious: render the `value` and fetch the proper highlighting for `language` at the same time, then apply the highlighting once fetched.

As it turns out, `react-loader` makes this incredibly easy.
The `Loadable.Map` component takes a loader which can load multiple things at once, and render something else while they're being fetched.
Then, once they're fetched, the user can define what renders.
Let's see how we might use this:

```jsx

import React from "react";
import ReactMarkdown from "react-markdown"
import Loadable from "react-loadable";

export const Code = (props) =>  {
  // The map of objects to load
  // In this case, we normally only load Lowlight...
  const loader = {
    Lowlight: () => import("react-lowlight"),
  }
  // ...but we also load the language if we have one
  if(props.language) {
    loader.lang = () => import(`highlight.js/lib/languages/${props.language}`);
  }
  // Create the loadable map
  let Cmp = Loadable.Map({
    loader,
    // Function called with the things we loaded, as well as
    // any props passed to the component.
    // We capture the props above, so we don't use them.
    render: (loaded, _) => {
      let { lang, Lowlight } = loaded;
      Lowlight = Lowlight.default;
      // If we found a language to highlight with, register it.
      // This allows us to use it to highlight later on.
      if(lang) {
        lang = lang.default;
        Lowlight.registerLanguage(props.language, lang);
      }
      return <Lowlight
        language={props.language || ""}
        value={props.value || ""} />;
    },
    // While loading, display the code in the normal tags
    loading: () => <pre><code>{props.value || "}</pre></code>
  });
  return <Cmp />;
}

// A map of custom renderers ReactMarkdown uses.
export const renderers = { code: Code };
// Tell ReactMarkdown to use our code renderer
export const Markdown = (props) => <ReactMarkdown
  {...props}
  renderers={renderers}
/>;
// Export a markdown object to use
export default Markdown;
```

And that's it!
You're ready to dynamically highlight code blocks in your program, making your bundle size smaller and the first load faster.
Of course, to use this in production you might want to add whitelisting, some sort of translator for common markdown to the actual language stynax name (return "js" to "javascript", for example), and perhaps other niceties.
Still, this should get you started.
