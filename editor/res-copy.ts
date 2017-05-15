namespace engine.res {



    export interface Processor {

        load(url: string, callback: Function): void;

    }

    export class ImageProcessor implements Processor {

        load(url: string, callback: Function) {
            let image = document.createElement("img");
            image.src = url;
            image.onload = () => {
                callback();
            }
        }
    }

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
        console.log(processor,isLoaded)
        if (processor != null && isLoaded == true) {
            processor.load(url, (data) => {
                let name = getNameByUrl(url);
                cache[name] = data;
                // cache[url] = data;
                callback(data);
            });
        } else {
            console.log("无法判断的文件类型");
        }
    }

    /**
     * 通过路径获得文件名http://www.111cn.net/wy/js-ajax/65531.htm
     */
    export function getNameByUrl(url: string): string {
        let name = url.substr(url.lastIndexOf("/") + 1);
        return name;
    }


    /**
     * 根据url,直接从缓存中得到文件
     */
    export function get(url: string): any {
        return cache[url];
    }



    var getTypeByURL = (url: string): string => {
        if (url.indexOf(".jpg") >= 0) {
            return "image";
        }
        else if (url.indexOf(".mp3") >= 0) {
            return "sound";
        }
        else if (url.indexOf(".json") >= 0) {
            return "text";
        }
    }

    let hashMap = {
        "image": new ImageProcessor(),
        "text": new TextProcessor()
    }
    function createProcessor(type: string) {
        let processor: Processor = hashMap[type];
        return processor;
    }

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


//  class SoundProcessor implements Processor {
//         load(url: string, callback: Function) { }
//     }
//     mapTypeSelector((url) => {
//         return "image";
//     })
//     map("sound", new SoundProcessor())

//     load("1.mp3", () => {

//     })



