import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export let run = () => {
    let canvas = document.getElementById("app") as HTMLCanvasElement;
    let stage = engine.run(canvas);

    /**
     * 设计窗口内预览游戏
     */
    let projectUserPick=path.resolve(__dirname,"../../../engine-test-game");
    console.log(projectUserPick);
    if(!validProject(projectUserPick)){
        alert("该文件不是一个有效的游戏项目");
    }else{
        let child_process=cp.exec("engine "+"run "+projectUserPick);
        child_process.stdout.addListener("data",data=>{
            console.log(data.toString());
            if(data.toString().indexOf("server listening to")>=0){
                let iframe=document.getElementById("preview") as HTMLIFrameElement;
                iframe.src="http://localhost:1337/index.html";
            }
        })
        child_process.stderr.addListener("data",data=>{
            console.log(data.toString());
        })
        child_process.addListener("close",()=>{

        })
    }

    let iframe = document.getElementById("preview") as HTMLIFrameElement;
    iframe.src = "http://localhost:1337/index.html";
    //iframe.src = "http://10.0.7.120:3000/index.html";

    function validProject(project: string) {
        return true;
    }
}