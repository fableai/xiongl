import parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from '@babel/generator'

// 原始代码字符串
const code = `
import { i18n } from '@/i18n';

export default function A() {
    const config = {
        name: '你好',
        age: 18
    };

    return <div>{'你好'}</div>;
}
`;

// 使用babel解析代码为AST
const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "templateLiteral"], // 启用JSX和模板字符串插件
});

// 定义替换逻辑
traverse.default(ast, {
    ImportDeclaration(path) {
        console.log(path.node)
    },
    StringLiteral(path) {
        const value = path.node.value;
        if (/[\u4e00-\u9fa5]/.test(value)) {
            console.log(value)
            const v = `i18n.t('nh')`
            path.replaceWith(parser.parseExpression(v, {
                sourceType: "module",
                plugins: ["jsx", "templateLiteral"]
            }))
        }
    },
});

// 将修改后的AST转换回代码
const { code: outputCode } = generate.default(ast, {
    retainLines: true, // 保持行号一致
    retainFunctionParens: true, // 保留函数括号
    compact: false, // 生成非紧凑的代码
});

console.log(outputCode);
