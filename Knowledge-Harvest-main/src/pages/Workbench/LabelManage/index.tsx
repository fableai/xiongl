import styles from './style.module.less'
// import ReactEcharts from "echarts-for-react"
// import echarts from "echarts"
import { create } from 'zustand'
import useGlobalStore from "@/store";
import React, { useEffect, useState } from 'react';
import LabelMind from '../components/LabelMind';
import MindMap from "../../../components/MindMap";
import {MindMapProps} from "../../../components/MindMap/MindMapProps";

import { fetchAllLabelMind,fetchGetLabelMindMarkDownData1,fetchGetLabelMindMarkDownData2 } from "@/service";

// 扩展 LabelMindStore 接口，包含 mindMapProps
export type LabelMindStore = {
  allLabelMind: (params: { userGuid: string }) => Promise<any>,
  mindMapProps: MindMapProps; // 使用 MindMapProps 类型
  setMindMapProps: (props: Partial<MindMapProps>) => void; // 添加更新 mindMapProps 的方法
  data: any // 存储从fetchAllLabelMind获取的数据
  data1: any // 存储从fetchGetLabelMindMarkDownData1获取的数据
  data2: any // 存储从fetchGetLabelMindMarkDownData2获取的数据
}

/**
 * [状态] - 获取整体脑图数据
 */
export const useLabelMindStore = create<LabelMindStore>((set) => ({
  allLabelMind: async (params) => {
    const { userGuid } = useGlobalStore.getState();
    // const data = await fetchAllLabelMind({ userGuid });    
    const data = null;
    const data1 = await fetchGetLabelMindMarkDownData1({ userGuid });
    const data2 = await fetchGetLabelMindMarkDownData2({ userGuid });
    set({ data,data1,data2 }); // 将数据存储在store中
  },  
  // 初始化 mindMapProps
  mindMapProps: {
    markdown: '',
    className: 'label-manage-mindmap',
    style: {
      // height: '70vh',
      // height: '500vh',
      border: '1px solid #eee',
      // borderRadius: '8px',
    },
    showToolbar: true,
    autoFit: true,
    spacingHorizontal: 80,
    spacingVertical: 5,
  },
  // 更新 mindMapProps 的方法
  setMindMapProps: (props) => 
    set((state) => ({
      mindMapProps: { ...state.mindMapProps, ...props }
    })),  
  data: null, // 初始数据
  data1: null, // 初始数据
  data2: null // 初始数据
}));

export default function LabelManage() {
  const [option, setOption] = useState<any>({});
  const { allLabelMind, 
    data,
    data1,
    data2,
    mindMapProps, 
    setMindMapProps 
   } = useLabelMindStore();  
  
  
  useEffect(() => {
    // 假设你有一个userGuid
    const { userGuid } = useGlobalStore.getState();
    allLabelMind({ userGuid });
  }, [allLabelMind]);

  // 当 data1 更新时，更新 mindMapProps
  // useEffect(() => {
  //   if (data1) {
  //     setMindMapProps({ markdown: data1 });
  //   }
  // }, [data1, setMindMapProps]);

  useEffect(() => {
    if (data2) {
      setMindMapProps({ markdown: data2 });
    }
  }, [data2, setMindMapProps]);

  //ECharts
  // useEffect(() => {
  //   if (data) {
  //     setOption(() => ({
  //       tooltip: {
  //         trigger: 'item',
  //         triggerOn: 'mousemove'
  //       },
  //       series: [
  //         {
  //           type: 'tree',            
  //           data: [data], // 使用从store中获取的数据
  //           // initialTreeDepth: 999,//全部展开
  //           top: '1%',
  //           left: '7%',
  //           bottom: '1%',
  //           right: '20%',
  //           symbolSize: 7,
  //           label: {
  //             position: 'left',
  //             verticalAlign: 'middle',
  //             align: 'right',
  //             fontSize: 15
  //           },
  //           leaves: {
  //             label: {
  //               position: 'right',
  //               verticalAlign: 'middle',
  //               align: 'left'
  //             }
  //           },
  //           emphasis: {
  //             focus: 'descendant'
  //           },
  //           expandAndCollapse: true,
  //           animationDuration: 550,
  //           animationDurationUpdate: 750,
  //           lineStyle: {
  //             color: '#ccc',
  //             // color: 'blue',
  //             width: 5, // 设置线条宽度              
  //             length: 2, // 连接线的第一段长度
  //             length2: 2, // 连接线的第二段长度
  //             curveness: 0.5 // 设置线条的曲率，值越小线条越直
  //           },
  //           // nodeGap: 1 // 设置节点之间的间距            
  //           levels: [
  //             {
  //               nodeGap: 100
  //             },
  //             {
  //               nodeGap: 200
  //             },
  //             // ... 可以为更多层级设置不同的 nodeGap
  //           ],
  //           width:1000
  //         }
  //       ]
  //     }));
  //   }
  // }, [data]);

    return (
        // <LabelMind item={option} />
        // <MindMap
        //   markdown={data1 ?? ''}
        // />
        <div className={styles.labelManageContainer}>
        <MindMap
          {...mindMapProps}
          style={{
            ...mindMapProps.style,
            // 可以在这里添加额外的样式覆盖
          }}
        />
      </div>        
    )
    // return <div>LabelManage2</div>
}