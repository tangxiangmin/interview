let fs = require("fs-extra");
let path = require("path");

const ROOT_PATH = path.resolve(__dirname, "../"); // 项目根目录

const config = {
    title: "Shymean",
    description: "fe",
    themeConfig: {
        nav: [
            { text: "导读", link: "/导读", activeMatch: "^/导读$" },
            {
                text: "前端",
                link: "/前端/README",
                activeMatch: "^/前端/",
                items: [
                    { text: "HTML", link: "/前端/HTML/HTML" },
                    { text: "CSS", link: "/前端/CSS/README" },
                    { text: "JavaScript", link: "/前端/JavaScript/README" },
                    { text: "库与框架", link: "/前端/库与框架/README" },
                    { text: "业务相关", link: "/前端/业务相关/前端工程化" },
                    {
                        text: "源码分析",
                        link: "/源码分析/README",
                        activeMatch: "^/源码分析/",
                    },
                ],
            },
            {
                text: "App",
                link: "/App/Android",
            },
            {
                text: "后台",
                link: "/后台/README",
            },

            {
                text: "计算机基础",
                link: "/计算机基础/README",
                activeMatch: "^/计算机基础/",
                items: [
                    {
                        text: "计算机基础",
                        link: "/计算机基础/README",
                    },
                    {
                        text: "数据结构和算法",
                        link: "/数据结构和算法/README",
                    },
                    {
                        text: "网络",
                        link: "/网络/README",
                    },
                ],
            },
            { text: "面试", link: "/面试/README", activeMatch: "^/面试/" },
            { text: "游戏开发", link: "/游戏开发/README", activeMatch: "^/游戏开发/" },

            {
                text: "读书笔记",
                link: "/读书笔记/README",
                activeMatch: "^/读书笔记/",
            },
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
            "/前端/HTML/": getFolderChild("前端/HTML"),
            "/前端/CSS/": getFolderChild("前端/CSS"),
            "/前端/JavaScript/": getFolderChild("前端/JavaScript"),
            "/前端/库与框架/": getFolderChild("前端/库与框架"),
            "/前端/业务相关/": getFolderChild("前端/业务相关"),

            "/App/": getFolderChild("App"),
            "/后台/": getFolderChild("后台"),

            "/面试/": getFolderChild("面试"),
            "/读书笔记/": getFolderChild("读书笔记"),
            "/源码分析/": getFolderChild("源码分析"),
            "/数据结构和算法/": getFolderChild("数据结构和算法"),
            "/计算机基础/": getFolderChild("计算机基础"),
            "/网络/": getFolderChild("网络"),
            "/游戏开发/": getFolderChild("游戏开发"),
        },
    },
    markdown: {
        config: (md) => {
            // 支持复选框
            md.use(require("markdown-it-task-lists"));
        },
    },
};
module.exports = config;

// 比较粗糙的检测方式，判断是否是文件夹
function isFolder(url) {
    let extName = path.extname(url);
    return !extName;
}

function parseFolder(floder, baseRoot) {
    let root = `${baseRoot}/${floder}`;
    let res = fs.readdirSync(root);

    let files = [];
    let hasReadme = false;
    res.forEach((file) => {
        if (isFolder(file)) {
            files.push(parseFolder(file, root));
        } else if (file.indexOf(`README`) === 0) {
            hasReadme = true;
            // readme.md作为目录放在最前面
            // files.unshift(file)
        } else {
            files.push(file);
        }
    });

    return {
        hasReadme,
        name: floder,
        files,
    };
}

function getFolderChild(folder) {
    let config = parseFolder(folder, ROOT_PATH);
    return generateChildrenRoutes(config, "").children;
    // return []
}

// todo 需要解决默认文章排序问题
function generateChildrenRoutes(config, folder) {
    const { name, files, hasReadme } = config;

    const children = files.map((item) => {
        if (Array.isArray(item.files)) {
            return generateChildrenRoutes(item, name);
        }
        const text = item.split(".")[0];
        return {
            text,
            link: folder ? `/${folder}/${name}/${text}` : `/${name}/${text}`,
        };
    });

    const result = {
        text: name,
        children,
    };
    if (hasReadme) {
        result.link = `${folder}/${name}/README`;
    }
    return result;
}
