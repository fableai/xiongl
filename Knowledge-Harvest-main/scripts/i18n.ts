import { glob } from 'glob';
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from 'node:url';
import { ParserOptions, parse, parseExpression } from "@babel/parser";
import generate from "@babel/generator";
import Traverse from "@babel/traverse";

const traverse = Traverse.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 根目录
const rootDir = path.join(__dirname, "../src");
// i18n目录
const outputFile = path.join(__dirname, "../i18n/zh_CN.ts");
// 解析配置
const parseOptions = {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
}

// i18n 集合
const i18nMap: Record<string, string> = {}

/**
 * 检查是否存在 JSX 元素字符串
 * @param {*} files 
 */
function checkHasJSXText(files: string[]) {
    console.log(`check-ha-JSXText:begin`);

    let hasJSXTest = false;
    files.forEach((file) => {
        // 读取文件内容
        const content = fs.readFileSync(path.join(rootDir, file), "utf8");
    
        // 使用babel解析代码为AST
        const ast = parse(content, {
            sourceType: "module",
            plugins: ["jsx", "typescript"], // 根据需要添加插件
        });
    
        // 遍历AST，查找并替换包含中文的字符串
        traverse(ast, {
            JSXText(path: any) {
                const value = path.node.value?.trim();
                if (/[\u4e00-\u9fa5]/.test(value)) {
                    console.log(`JSXText:${file}`, value)
                    hasJSXTest = true
                }
            }
        });
    });

    if (hasJSXTest) {
        throw new Error('has JSXText')
    }

    console.log(`check-ha-JSXText:end`);
}

/**
 * 生成 i18n 表达式
 * @param str 
 * @returns 
 */
function genI18nExpression(str: string) {
    const hashKey = crypto.createHash('md5').update(str).digest('hex');

    return `i18n.t('${hashKey}')`;
}

/**
 * 缓存 i18n 字段
 * @param {*} str 
 */
function cacheI18n(str: string) {
    const hashKey = crypto.createHash('md5').update(str).digest('hex');

    if (!i18nMap[hashKey]) {
        i18nMap[hashKey] = str;
    }
}

/**
 * 收集 i18n 数据
 * @param {*} files 
 */
function collectI18n(files: string[]) {
    files.forEach((file) => {
        console.log(`Processing file: ${file}`);

        // 读取文件内容
        const content = fs.readFileSync(path.join(rootDir, file), "utf8");

        // 使用babel解析代码为AST
        const ast = parse(content, parseOptions as ParserOptions);

        // 遍历AST，查找包含中文的字符串
        traverse(ast, {
            StringLiteral(path: any) {
                const value = path.node.value;
                if (/[\u4e00-\u9fa5]/.test(value)) {
                    cacheI18n(value)
                }
            },
            TemplateLiteral(path: any) {
                path.node.quasis.forEach((quasi: any) => {
                    const quasiValue = quasi.value.raw;

                    // 正则表达式匹配中文字符
                    quasi.value.raw = quasiValue.replace(/[\u4e00-\u9fa5]+/g, ($1) => {
                        cacheI18n($1)
                        return $1
                    });
                })
            }
        });
    });
}

/**
 * 将代码中的 中文 替换 i18n 变量
 * @param code 
 * @returns 
 */
function replaceI18nByCode(code: string) {
    // 使用babel解析代码为AST
    const ast = parse(code, parseOptions as ParserOptions);

    let hasReplaced = false;
    let hasImportI18n = false;
    // 遍历AST，查找包含中文的字符串
    traverse(ast, {
        StringLiteral(path: any) {
            const value = path.node.value;
            if (/[\u4e00-\u9fa5]/.test(value)) {
                hasReplaced = true;

                const i18nExpression = genI18nExpression(value);
                path.replaceWith(parseExpression(i18nExpression, parseOptions as ParserOptions))
            }
        },
        TemplateLiteral(path: any) {
            path.node.quasis.forEach((quasi: any) => {
                const quasiValue = quasi.value.raw;

                // 正则表达式匹配中文字符
                quasi.value.raw = quasiValue.replace(/[\u4e00-\u9fa5]+/g, ($1: string) => {
                    hasReplaced = true
                    console.log($1)
                    return `\$\{${genI18nExpression($1)}\}`
                });
            })
        },
        ImportDeclaration(path: any) {
            if (path.node.source.value === 'i18n') {
                hasImportI18n = true
            }
        },
    });

    if (hasReplaced) {
        // 重新生成代码
        code = generate.default(ast, {
            retainLines: true, // 保持行号一致
            retainFunctionParens: true, // 保留函数括号
            compact: false, // 生成非紧凑的代码
        }).code;

        const importI18n = hasImportI18n ? '' : `import { i18n } from 'i18n';\n`
        code = `${importI18n}${code}`
    }

    return code;
}

/**
 * 更新 i18n 字典
 */
export async function updateI18nMap() {
    console.log('开始更新 i18n 字典...');

    // 递归遍历指定类型的文件
    const files = await glob(`**/*.{ts,tsx}`, {
        cwd: rootDir,
        ignore: [
            '**/*.d.ts',
            '**/*/mockData.ts',
        ]
    });

    checkHasJSXText(files)
    collectI18n(files)

    const code = `export default ${JSON.stringify(i18nMap, null, 4)}`
    fs.writeFileSync(outputFile, code);

    console.log('i18n 字典更新完成');
}

/**
 * [vite插件] - i18n抽取 & 替换处理
 * @returns 
 */
export default function i18nPlugin() {
    return {
        name: 'i18n-plugin',

        buildStart() {
            updateI18nMap()
        },
    
        transform(src: string, id: string) {
            // 排除非 src 目录下的文件
            if (!/.*\bsrc\b.*\.(ts|tsx)$/g.test(id)) {
                return
            }

            // 将代码中的 中文 替换 i18n 变量
            src = replaceI18nByCode(src)

            return {
                code: src,
                map: null // 如果可行将提供 source map
            }
        },
    }
}