import { Button, Card, Modal, Tag, Tooltip, message, Image } from "antd";
import { ArrowUpOutlined, CopyOutlined, DeleteFilled, EyeInvisibleOutlined, EyeOutlined, GlobalOutlined, ReadOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Article } from '../../type'
import { TAB_KEY, useArticleDetailStore } from "../ArticleDetail";
import { IMAGES } from "../../../../assets/images";
import useKnowledgeLibStore from "../../KnowledgeLib/store";
import styles from './style.module.less'

import ReactEcharts from "echarts-for-react"
import echarts from "echarts"
import React from 'react'


export default function LabelMind(props: {
    item: {},
}) {
    const { item } = props
    const getOption = ()=>{
        let option = {
           
        };
        option=item;
        return option;
    };

    return (
        <div style={{width:'100%'}}>
            <ReactEcharts option={getOption()}
                style={{ marginTop: 0, height: "800px" }}
            />
        </div>
    )
}