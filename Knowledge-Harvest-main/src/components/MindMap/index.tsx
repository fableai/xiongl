import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'
import React,{ useEffect, useRef } from 'react'
import styles from './style.module.less'

import { Toolbar } from 'markmap-toolbar';
import 'markmap-toolbar/dist/style.css';

import { MindMapProps } from './MindMapProps';
/**
 * 脑图
 * @param props 
 * @returns 
 */
// export default function MindMap(props: { markdown: string }) {
export default function MindMap(props: MindMapProps) {    
    const { markdown = '', className, style } = props; // 设置默认值
    
    const ref = useRef<any>()
    const markmap = useRef<Markmap>()

    const refToolbar = useRef<HTMLDivElement>();

    useEffect(() => {
      if (!ref.current || !markdown) return; // 添加数据检查

      try{
        const transformer = new Transformer();
        const { root, features } = transformer.transform(markdown);
debugger;
        setTimeout(() => {
            if (!markmap.current) {
                // markmap.current = Markmap.create(ref.current!, {
                //     spacingHorizontal:80,   // 水平间距
                //     spacingVertical:5,      // 垂直间距
                //     autoFit: true,          // 是否自动适应
                //     zoom: true,
                // }, null)

                // renderToolbar(markmap.current, refToolbar.current);

                // 创建配置对象
                const options: MarkmapOptions = {
                  spacingHorizontal: 80,
                  spacingVertical: 5,
                  autoFit: true,
                  zoom: true,
                  // onclick: (node) => {
                  //     // 调用传入的点击回调
                  //     console.log('Node clicked:', node); // 添加调试日志
                  //     onNodeClick?.(node);
                  // }
              };

              // 创建新实例
              markmap.current = Markmap.create(ref.current!, options, null);
              renderToolbar(markmap.current, refToolbar.current);                


              // // 绑定点击事件
              // const svg = ref.current;
              // svg.querySelectorAll('.markmap-node').forEach(node => {
              //   node.addEventListener('click', (e) => {
              //     const nodeData = (e.currentTarget as any).__data__;
              //     if (nodeData) {
              //       console.log('Node clicked (direct):', nodeData); // 添加调试日志
              //       onNodeClick?.(nodeData);
              //     }
              //   });
              // });              
            }

            markmap.current.setData(root);
            // markmap.current.fit();
        }, 0)
      }
      catch(error){
        console.error('Error rendering mindmap:', error);
      }
    
    }, [markdown]);

    // 如果没有数据，显示占位内容
    if (!markdown) {
      return <div>No data available</div>;
    }

    const showToolbar = true;
    return (
        // <React.Fragment>
        // <svg className={styles["mind-map"]} ref={ref} style={{ width: '100%', height: '60vh' }}></svg>
        // {/* <div className="absolute bottom-1 right-1" ref={refToolbar}></div> */}
        // </React.Fragment>        

        <div className={styles.mindMapContainer}>
        <svg
          className={`${styles.mindMap} ${className || ''}`}
          ref={ref}
          style={{
            width: '100%',
            // height: '60vh',
            height: '1000px',
            // minHeight: '300px',
            // maxHeight: '800px',
            ...style                //会覆盖此处样式   
          }}
        />
        {/* {showToolbar && (
          <div 
            className={styles.toolbarContainer} 
            ref={refToolbar}
          />
        )} */}
      </div>

    )
}


function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
    while (wrapper?.firstChild) wrapper.firstChild.remove();
    if (mm && wrapper) {
      const toolbar = new Toolbar();
      toolbar.attach(mm);
      // Register custom buttons
      toolbar.register({
        id: 'alert',
        title: 'Click to show an alert',
        content: 'Alert',
        onClick: () => alert('You made it!'),
      });
      toolbar.setItems([...Toolbar.defaultItems, 'alert']);
      wrapper.append(toolbar.render());
    }
  }