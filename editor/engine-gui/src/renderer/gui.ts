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

    function validProject(project:string){
        return true;
    }

    let textField = new engine.TextField();
    textField.text = "Hello,User";
    textField.x = 50;
    textField.y = 50;
    stage.addChild(textField);

    engine.res.loadConfig("test-project/default.json", () => {
        engine.res.load("test-project/default.json", (data) => {
            let resourceJson = engine.res.get("default.json");
            let resource: engine.res.ResourceData[] = JSON.parse(resourceJson)["resource"];
            for (let res of resource) {//加载所有资源
                engine.res.load(res.url, (data) => {
                    console.log(data);
                });
            }
            setTimeout(function () {
                refresh(stage);
            }, 300);
        })
    });
}


var startX = 50;
var startY = 100;
var deltaY = 100;
var deltaX = 100;
var gap = 30;

/**
 * 从data直接得到的文件
 */
var data;
/**
 * data中的"resource"
 */
var booksResource: { name: string, ID: string }[];


function refresh(stage: engine.DisplayObjectContainer) {
    let container = new engine.DisplayObjectContainer();
    stage.addChild(container);
    let projectUserPick = path.resolve(__dirname, "../../test-project");
    let configPath = path.join(projectUserPick, "data.config");

    let add_Bitmap = new engine.Bitmap();
    let refresh_Bitmap = new engine.Bitmap();
    let save_Bitmap = new engine.Bitmap();

    add_Bitmap = engine.res.get("add.png");
    refresh_Bitmap = engine.res.get("shuaxin.png");
    save_Bitmap = engine.res.get("save.png");

    add_Bitmap.x = 300;
    add_Bitmap.y = 10;
    refresh_Bitmap.x = 400;
    refresh_Bitmap.y = 10;
    save_Bitmap.x = 500;
    save_Bitmap.y = 10;
    container.addChild(add_Bitmap);
    container.addChild(refresh_Bitmap);
    container.addChild(save_Bitmap);
    refresh_Bitmap.touchEnabled = true;
    refresh_Bitmap.addEventListener(engine.TouchType.TOUCH_TAP, () => {
        console.log("刷新");
        stage.removeChild(container);
        refresh(stage);
    });
    save_Bitmap.touchEnabled = true;
    save_Bitmap.addEventListener(engine.TouchType.TOUCH_TAP, () => {
        //储存
        console.log("储存");
        data.resource = booksResource;
        let dataContent = JSON.stringify(data, null, "\t");
        fs.writeFileSync(configPath, dataContent, "utf-8");
        alert("储存成功！！！");
    });


    if (!fs.existsSync(configPath)) {
        alert("该文件夹不是有效路径");
    }
    else {
        let dataContent = fs.readFileSync(configPath, "utf-8");

        try {
            data = JSON.parse(dataContent);
        }
        catch (e) {
            alert("配置文件解析失败！")
        }
        if (data) {
            booksResource = data.resource;

            let changeY = startY;
            for (let book of booksResource) {
                //建立一本书
                let book_Item = new BookItem(book.name, book.ID, "delete.png", "bianji.png");
                book_Item.x = startX;
                book_Item.y = changeY;
                changeY += deltaY;
                //添加到屏幕里
                container.addChild(book_Item);
            }

        }
    }
}


class BookItem extends engine.DisplayObjectContainer {
    bookName: string;
    bookId: string;
    bookTextField: engine.TextField;
    changeButton: engine.Bitmap;
    deleteButton: engine.Bitmap;
    constructor(book_name: string, book_id: string, deleteButton_res: string, bianjiButton_res: string) {
        super();
        //赋值
        this.bookName = book_name;
        this.bookId = book_id;
        //建立文本框
        this.bookTextField = new engine.TextField();
        this.bookTextField.text = this.bookName;
        this.bookTextField.x = 10;
        this.bookTextField.y = 10;
        this.bookTextField.scaleX=3;
        this.bookTextField.scaleY=3;
        //建立按钮
        let delete_Bitmap = new engine.Bitmap();
        let change_Bitmap = new engine.Bitmap();
        delete_Bitmap.x = 50;
        change_Bitmap.x = 150;
        delete_Bitmap.y = 20;
        change_Bitmap.y = 20;

        delete_Bitmap = engine.res.get(deleteButton_res);
        change_Bitmap = engine.res.get(bianjiButton_res);
        this.deleteButton = delete_Bitmap;
        this.changeButton = change_Bitmap;
        this.addChild(this.bookTextField);
        this.addChild(this.deleteButton);
        this.addChild(this.changeButton);


        this.deleteButton.touchEnabled = true;
        this.deleteButton.addEventListener(engine.TouchType.TOUCH_TAP, () => {
            //删除事件
            console.log("删除");
            let copy_booksResource = booksResource;
            for (let book of booksResource) {
                if (this.bookId == book.ID) {
                    let deleteIndex = booksResource.indexOf(book); //in(book);
                    copy_booksResource.splice(deleteIndex, 1);
                    break;
                }
            }
            this.removeChild(this);
            booksResource = copy_booksResource;
        });


        this.changeButton.touchEnabled = true;
        this.changeButton.addEventListener(engine.TouchType.TOUCH_TAP, () => {
            //修改事件
            console.log("修改");
            this.bookName = 'geng_gai_cheng_gong';
            this.bookTextField.text = this.bookName;
            let copy_booksResource = booksResource;
            for (let book of copy_booksResource) {
                if (this.bookId == book.ID) {
                    book.name = this.bookName;
                }
            }
            booksResource = copy_booksResource;

        });
    }
}