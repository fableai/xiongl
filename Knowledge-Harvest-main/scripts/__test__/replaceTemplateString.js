import parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from '@babel/generator'

// 原始代码字符串
const code = `
const name = "World";
const message = \`哈H哒E你好呀, \${name}\`;
`;

// 使用babel解析代码为AST
const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "templateLiteral"], // 启用JSX和模板字符串插件
});

// 定义替换逻辑
traverse.default(ast, {
    TemplateLiteral(path) {
        path.node.quasis.forEach((element, index) => {
            // 替换为i18n调用
            element.value = {
                ...element.value,
                raw: element.value.raw.replace(/[\u4e00-\u9fa5]+/g, ($1) => {
                    return `\$\{i18n('${$1}')\}`
                })
            };
        });
    },
});

// 将修改后的AST转换回代码
const { code: outputCode } = generate.default(ast);

console.log(outputCode);
