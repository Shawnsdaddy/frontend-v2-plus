import {createSSRApp, createApp, h} from "vue";
import ElementPlus, {ID_INJECTION_KEY} from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "/src/App.vue";
import {setPageContext} from "./usePageContext";
import "element-plus/theme-chalk/dark/css-vars.css";


export {createVPSApp};

function createVPSApp(pageContext, clientOnly) {
    const {Page, pageProps} = pageContext;
    const createAppFunc = clientOnly ? createApp : createSSRApp;
    const PageWithLayout = {
        render() {
            return h(App, pageProps || {}, {
                default() {
                    return h(Page, pageProps || {});
                },
            });
        },
    };

    const app = createAppFunc(PageWithLayout);

    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component);
    }

    const files = import.meta.glob('/src/custom/*.vue', {eager: true})
    for (let index in files) {
        const name = files[index].default.__name
        app.component('c-' + name, files[index].default)
    }


    app.use(ElementPlus);
    if (!clientOnly) {
        app.provide(ID_INJECTION_KEY, {
            prefix: 1024,
            current: 0,
        });
    }

    // We make pageContext available from any Vue component
    setPageContext(app, pageContext);

    return app;
}
