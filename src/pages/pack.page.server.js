import axios from "axios";
import stageApi from "@/api/stage";

export async function onBeforeRender(pageContext) {
  const response = await axios.get("https://backend.yituliu.site/api/find/store/pack");
  const data = await response.data.data;
  const pageProps = { data };
  return {
    pageContext: {
      pageProps,
    },
  };
}

export const passToClient = ["pageProps", "urlParsed"];
