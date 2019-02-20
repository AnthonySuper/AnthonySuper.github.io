import React from "react";
import ReactMarkdown from "react-markdown"
import Loadable from "react-loadable";

export const Code = (props) =>  {
  const loader = {
    Lowlight: () => import("react-lowlight"),
  }
  if(props.language) {
    loader.lang = () => import(`highlight.js/lib/languages/${props.language}`);
  }
  let Cmp = Loadable.Map({
    loader,
    render: (loaded, p) => {
      let { lang, Lowlight } = loaded;
      console.log(loaded);
      if(lang) {
        Lowlight.registerLanguage(props.language, lang);
      }
      return <Lowlight
        language={props.language || ""}
        value={props.value || ""} />;
    },
    loading: () => <pre><code>{props.value || ""}</code></pre>
  });
  return <Cmp />;
}

export const renderers = { code: Code };

export const Markdown = (props) => <ReactMarkdown
  {...props}
  renderers={renderers}
/>;

export default Markdown;
