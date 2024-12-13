import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Test from "./pages/Test";
import Pricing from "./pages/Pricing";

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Workbench = lazy(() => import('./pages/Workbench'));
const KnowledgeLib = lazy(() => import('./pages/Workbench/KnowledgeLib'));
const LabelManage = lazy(() => import('./pages/Workbench/LabelManage'));
const LabelSet = lazy(() => import('./pages/Workbench/LabelSet'));
const SharePage = lazy(() => import('./pages/SharePage'));

export enum RouteNames {
    Root = '/app',
    // 登录
    Login = '/app/login',
    // 测试
    Test = '/app/test',
    // 定价
    Pricing = '/app/pricing',
    // 工作台
    Workbench = '/app/workbench',
    // 知识库
    KnowledgeLib = '/app/workbench/knowledgeLib',
    LabelManage = '/app/workbench/LabelManage',
    LabelSet = '/app/workbench/LabelSet',
    // 分享页面
    Share = '/app/share/:id'  
}

export const Routers: RouteObject[] = [
    {
        path: RouteNames.Root,
        Component: LandingPage
    },
    {
        path: RouteNames.Login,
        Component: Login
    },
    {
        path: RouteNames.Test,
        Component: Test
    },
    {
        path: RouteNames.Pricing,
        Component: Pricing
    },
    {
        path: RouteNames.Workbench,
        Component: Workbench,
        children: [
            {
                path: RouteNames.KnowledgeLib,
                Component: KnowledgeLib,
            },
            {
                path: RouteNames.LabelManage,
                Component: LabelManage
            },
            {
                path: RouteNames.LabelSet,
                Component: LabelSet
            }            
        ]
    },
    {
        path: RouteNames.Share,
        Component: SharePage
    }
]