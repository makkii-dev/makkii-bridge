import { Messager, Ipayload } from "./messager";
import { evtCallback } from "./messager/event_bus";

export default class Bridge {
    messager: Messager;
    constructor(getWebView: ()=> ({
        injectJavaScript:(data:any) => any
    })|null){
        this.messager = new Messager((data:any)=>{
            const injectCode =
            `{ let evt = document.createEvent('events');\n` +
            `evt.initEvent('FROM_MAKKII',true,false);\n` +
            `evt.data = ${JSON.stringify(data)};\n` +
            `document.dispatchEvent(evt);\n` +
            `}`;
            const webview = getWebView();
            if(webview){
                webview.injectJavaScript(injectCode);
            }
        })
    }
    bind=(name: string)=>this.messager.bind(name)
    define=(name: string, func: (...data: any) => any)=>this.messager.define(name, func)
    listener = (e:any)=>{
        let data : any;
        try {
            data = JSON.parse(e.nativeEvent.data);
            if(typeof data === 'string') data = JSON.parse(data)
        }catch(e){
            // 
        }
        if(data){
            this.messager.listener(data)
        }
    } 
    addEventListener =  (name: string, cb: evtCallback<Ipayload<any>> )=>this.messager.addEventListener(name, cb)
    removeEventListener = (name: string, cb: evtCallback<Ipayload<any>> )=>this.messager.removeEventListener(name, cb)
    isConnect = ()=> this.messager.isConnect
}