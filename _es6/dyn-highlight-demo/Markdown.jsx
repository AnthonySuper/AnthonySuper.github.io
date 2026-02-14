import React, { lazy, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"

const languages = import.meta.glob(`highlight.js/lib/languages/*`);

const Lowlight = lazy(() => import("react-lowlight"));

export const Code = (props) =>  {
  useEffect(() => {
    (async () => {
      const usedLang = languages[`highlight.js/lib/languages/${props.language}`];
      console.log(usedLang, language);
      if(usedLang === undefined) {
        return;
      }
      const properLang = await usedLang;
      Lowlight.registerLanguage(props.language, lang);
    })();
  }, [props.language]);

  return <Lowlight language={props.language || ""} value={props.value || ""} />;
}

export const renderers = { code: Code };

export const Markdown = (props) => <ReactMarkdown
  {...props}
  renderers={renderers}
/>;

export default Markdown;
