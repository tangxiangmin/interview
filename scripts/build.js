// 自动生成SUMMARY.md

let fs = require("fs-extra");
let path = require("path");

const ROOT_PATH = path.resolve(__dirname, "../"); // 项目根目录
const SPACE_2 = "  "; // mardown列表缩进

// 比较粗糙的检测方式，判断是否是文件夹
function isFloder(url) {
    let extName = path.extname(url);

    return !extName;
}

// 解析某个目录下的文件及子目录
function parseFloder(floder, baseRoot) {
    let root = `${baseRoot}/${floder}`;
    let res = fs.readdirSync(root);

    let files = res.map(file => {
        if (isFloder(file)) {
            return parseFloder(file, root);
        } else {
            return file;
        }
    });

    return {
        name: floder,
        files: files
    };
}

// 为某个文件夹生成markdown目录列表
function createCatalogue(config, deep, root){
    let {name, files} = config;

    let acc = '';
    if(deep == 0){
        acc += `\n## ${name}\n`;
    }else if(deep == 1){
        acc += `${SPACE_2.repeat(deep - 1)}* ${name}\n`;
    }

    acc += files.reduce((s, item) => {
        if(item.files) {

            return s + createCatalogue(item, deep+1, `${root}/${name}`)
        }else {

            return (
                s +
                `${SPACE_2.repeat(deep)}* [${path.basename(
                    item
                )}](${root}/${name}/${item}) \n`
            );
        }
       
    }, "");
    return acc;
}

// 为gitbook生成目录Summary.md
function writeSummary(floders) {
    // 头部
    let content = `
# Summary
* [Introduction](README.md)
    `;

    // 文件夹的目录树转换成markdown形式
    content += floders.map(floder => {
        let config = parseFloder(floder, ROOT_PATH);
        return createCatalogue(config, 0, '.');
    }).join('')

    let output = path.resolve(ROOT_PATH, "./SUMMARY.md");
    fs.writeFileSync(output, content);
}

// ===start build=== //
function build(){
    let floders = ["知识点", "面试题", "面试记录"];
    writeSummary(floders)
}

console.log("===准备生成SUMMARY.md===");
build();
