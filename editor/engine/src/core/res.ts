namespace engine.res {

    /**
     * 文件处理器接口
     */
    export interface Processor {

        load(url: string, callback: Function): void;

    }


    /**
     * 图片处理器
     */
    export class ImageProcessor implements Processor {

        load(url: string, callback: Function) {
            // let image = document.createElement("img");
            // image.src = url;
            let res = getObjectByUrl(url);
            let bitmap = new Bitmap();//res.name, res.width, res.height, res.url
            bitmap.img.name = res.name;
            bitmap.img.width = res.width;
            bitmap.img.height = res.height;
            bitmap.img.src = res.url;

            bitmap.img.onload = () => {
                callback(bitmap);
            }
        }
    }


    /**
     * 文本处理器
     */
    export class TextProcessor implements Processor {
        load(url: string, callback: Function) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", url);
            xhr.send();
            xhr.onload = () => {
                callback(xhr.responseText);
            }
        }
    }


    /**
     * 根据url地址返回类型字符串
     */
    var getTypeByURL = (url: string): string => {
        if ((url.indexOf(".jpg") >= 0) ||
            (url.indexOf(".png") >= 0)) {
            return "image";
        }
        else if (url.indexOf(".mp3") >= 0) {
            return "sound";
        }
        else if (url.indexOf(".json") >= 0) {
            return "text";
        }
    }


    export function mapTypeSelector(typeSelector: (url: string) => string) {
        getTypeByURL = typeSelector;
    }

    /**
     * 缓存，用于储存加载完成的资源
     */
    var cache = {};
    

    /**
     * resource配置文件
     */
    var resource: any;
    var isLoaded = false;

    /**
     * 加载，根据url加载资源
     */
    export function load(url: string, callback: (data: any) => void) {
        let type = getTypeByURL(url);
        let processor = createProcessor(type);
        if (processor != null && isLoaded == true) {

            processor.load(url, (data) => {
                let name = getNameByUrl(url);
                cache[name] = data;
                callback(data);
            });
        } else {
            console.log("无法判断的文件类型");
        }
    }

    /**
     * 根据url,直接从缓存中得到文件
     */
    export function get(name: string) {
        
        return cache[name];
    }


    /**
     * hashMap，用于储存文件处理器的类型
     */
    let hashMap = {
        "image": new ImageProcessor(),
        "text": new TextProcessor()
    }
    /**
     * 创建文件处理器（类型名）
     */
    function createProcessor(type: string) {
        let processor: Processor = hashMap[type];
        return processor;
    }

    /**
     * 通过路径获得文件名http://www.111cn.net/wy/js-ajax/65531.htm
     */
    export function getNameByUrl(url: string): string {
        let name = url.substr(url.lastIndexOf("/") + 1);
        return name;
    }



    /**
     * 通过url遍历resource获得对象
     */
    function getObjectByUrl(url: string): any {
        for (let res of resource) {
            if (res.url == url) {
                return res;
            }
        }
        console.log("没找到对象，from getObjectByUrl");
        return null;

    }



    /**
     * 自己设计文件处理器
     */
    export function map(type: string, processor: Processor) {
        hashMap[type] = processor;
    }


    /**
     * 加载配置文件
     */
    export function loadConfig(url: string, callback: Function) {
        if (!isLoaded) {
            let processor = new TextProcessor();
            processor.load(url, (data) => {
                let mapJson = JSON.parse(data);
                resource = mapJson["resource"];
            });
            isLoaded = true;
            callback();
        } else {
            console.log("错误，已经加载资源文件")
        }
    }


    /**
     * 配置文件中文件标准格式
     */
    export type ResourceData = {
        name: string,
        type: string,
        url: string
    }

    export type ImageData = {
        image: string,
        width: number,
        height: number
    }

    export type FramesData = {
        name: string,
        length: number,
        frames: ImageData[]
    }



}
