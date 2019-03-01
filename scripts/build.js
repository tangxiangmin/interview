// 自动生成SUMMARY.md
// todo 增加二级目录

let fs = require("fs-extra");
let path = require("path");

const ROOT_PATH = path.resolve(__dirname, "../");

function getAllFile() {
    let floders = ["知识点", "面试题", "面试记录"];
    return floders.map(name => {
        let files = fs.readdirSync(`${ROOT_PATH}/${name}`);

        return {
            name,
            files
        };
    });
}

function writeSummary(files){
    let content = `
# Summary
* [Introduction](README.md)

    `
    content = files.reduce((acc, item)=>{
        acc += `\n##${item.name}\n`
        
        acc += item.files.reduce((s, file)=>{
            return s + `  * [${path.basename(file)}](./${item.name}/${file}) \n`
        }, '')

        return acc
    }, content)

    let output = path.resolve(ROOT_PATH, './SUMMARY.md')

    fs.writeFileSync(output, content)
}



writeSummary(getAllFile())
