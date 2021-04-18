let fs = require("fs-extra");
let path = require("path");

const ROOT_PATH = path.resolve(__dirname, "../"); // 项目根目录

module.exports = {
    title: "前端知识汇总",
    description: "fe",
    themeConfig: {
        nav: [
            {text: "目录", link: "/SUMMARY", activeMatch: '^/$'},
            {text: "知识点", link: "/知识点/README", activeMatch: "^/知识点/"},
            {text: "源码分析", link: "/源码分析/README", activeMatch: "^/源码分析/"},
            {text: "面试", link: "/面试/README", activeMatch: "^/面试/"},
            {
                text: "github",
                link: "https://github.com/tangxiangmin/interview",
            },
            {
                text: "shymean",
                link: "https://shymean.com",
            },
        ],

        sidebar: {
            "/知识点/": getFolderChild('知识点'),
            "/面试/": getFolderChild('面试'),
            "/源码分析/": getFolderChild('源码分析'),
        },
    },
};

// 比较粗糙的检测方式，判断是否是文件夹
function isFolder(url) {
    let extName = path.extname(url);
    return !extName;
}

function parseFolder(floder, baseRoot) {
    let root = `${baseRoot}/${floder}`;
    let res = fs.readdirSync(root);

    let files = []
    let hasReadme = false
    res.forEach(file => {
        if (isFolder(file)) {
            files.push(parseFolder(file, root))
        } else if (file.indexOf(`README`) === 0) {
            hasReadme = true
            // readme.md作为目录放在最前面
            // files.unshift(file)
        } else {
            files.push(file)

        }
    });

    return {
        hasReadme,
        name: floder,
        files
    };
}


function getFolderChild(folder) {
    let config = parseFolder(folder, ROOT_PATH);
    return generateChildrenRoutes(config, '').children
    // return []
}

function generateChildrenRoutes(config, folder) {
    const {name, files, hasReadme} = config

    const children = files.map(item => {
        if (Array.isArray(item.files)) {
            return generateChildrenRoutes(item, name)
        }
        const text = item.split('.')[0]
        return {
            text,
            link: folder ? `/${folder}/${name}/${text}` : `/${name}/${text}`
        }
    })

    const result = {
        text: name,
        children,
    }
    if (hasReadme) {
        result.link = `${folder}/${name}/README`
    }
    return result
}


