import styles from './style.module.less';
import { create } from 'zustand';
import useGlobalStore from "@/store";
import React, { useEffect, useState, useCallback } from 'react';
import { 
  Layout, 
  Button, 
  List, 
  Modal, 
  Form, 
  Input, 
  message, 
  Spin, 
  Popconfirm, 
  Space,
  Tag as AntTag,
  Checkbox,
  Input as AntInput,
  Tabs,
  Drawer
} from 'antd';

import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  SearchOutlined,
  NodeIndexOutlined,
  ClusterOutlined,
  AppstoreOutlined 
} from '@ant-design/icons';

import MemoizedMindMap from "../../../components/MemoizedMindMap";
import { MindMapProps } from "../../../components/MindMap/MindMapProps";
import { fetchAllLabelMind, fetchGetLabelMindMarkDownData1, fetchGetLabelMindMarkDownData2
  , fetchGetUserAllLabel, fetchUpdateLabelSet,fetchAddLabelSet,fetchDelLabelSet } from "@/service";

const { Sider, Content } = Layout;
const { Search } = AntInput;

export interface Tag {
  infoLabelSetGuid: string;
  labelWord: string;
  labelRemark: string;
  isUser: boolean;
  websites?: Website[];
}

export interface Website {
  id: number;
  title: string;
  url: string;
}

export type LabelMindStore = {
  allLabelMind: (params: { userGuid: string }) => Promise<any>,
  mindMapProps: MindMapProps;
  setMindMapProps: (props: Partial<MindMapProps>) => void;
  data: any;
  data1: any;
  data2: any;
}

export const useLabelMindStore = create<LabelMindStore>((set) => ({
  allLabelMind: async (params) => {
    const { userGuid } = useGlobalStore.getState();
    const data = null;
    const data1 = await fetchGetLabelMindMarkDownData1({ userGuid });
    const data2 = await fetchGetLabelMindMarkDownData2({ userGuid });
    set({ data, data1, data2 });
  },
  mindMapProps: {
    markdown: '',
    className: 'label-manage-mindmap',
    style: {
      border: '1px solid #eee',
    },
    showToolbar: true,
    autoFit: true,
    spacingHorizontal: 80,
    spacingVertical: 5,
  },
  setMindMapProps: (props) => 
    set((state) => ({
      mindMapProps: { ...state.mindMapProps, ...props }
    })),
  data: null,
  data1: null,
  data2: null
}));

// Memoized TabContent component to prevent unnecessary re-renders
const TabContent = React.memo<{
  type: string;
  tags: Tag[];
  loading: boolean;
  data?: string;
}>(({ type, tags, loading, data }) => {
  const { mindMapProps } = useLabelMindStore();

  if (!data) {
    return (
      <div className="tab-content">
        <Spin spinning={loading}>
          <div>No mind map data available</div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <Spin spinning={loading}>
        <div className="markmap-container">
          <MemoizedMindMap
            {...mindMapProps}
            markdown={data}
            style={{
              ...mindMapProps.style,
            }}
          />
        </div>
      </Spin>
    </div>
  );
});

export default function LabelSet() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const { allLabelMind, data1, data2 } = useLabelMindStore();

  // Memoized callback functions
  const filterTags = useCallback((search: string) => {
    const filtered = tags.filter(tag => 
      tag.labelWord.toLowerCase().includes(search.toLowerCase()) ||
      tag.labelRemark.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTags(filtered);
  }, [tags]);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const { userGuid } = useGlobalStore.getState();
      const data = await fetchGetUserAllLabel({ userGuid });
      setTags(data);
    } catch (error) {
      message.error('获取标签失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTagSubmit = useCallback(async (values: {
    labelWord: string;
    labelRemark: string;
    isUser: boolean;
  }) => {
    setLoading(true);
    try {
      debugger;
      const { userGuid } = useGlobalStore.getState();
      if (editingTag) {        
        await fetchUpdateLabelSet({
          userGuid: userGuid,
          infoLabelSetGuid: editingTag.infoLabelSetGuid,
          labelWord: values.labelWord,
          labelRemark: values.labelRemark,
          isUser: values.isUser
        });
      } else {
        await fetchAddLabelSet({
          userGuid: userGuid,
          infoLabelSetGuid: "",
          labelWord: values.labelWord,
          labelRemark: values.labelRemark,
          isUser: values.isUser
        });
      }
      message.success(`${editingTag ? '编辑' : '新增'}标签成功`);
      setIsModalVisible(false);
      fetchTags();
    } catch (error) {
      message.error(`${editingTag ? '编辑' : '新增'}标签失败`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [editingTag, fetchTags]);

  const handleDeleteTag = useCallback(async (tag: Tag) => {
    setLoading(true);
    debugger;
    try {
      await fetchDelLabelSet({        
        infoLabelSetGuid: tag.infoLabelSetGuid,       
      });        
      message.success('删除标签成功');
      fetchTags();
    } catch (error) {
      message.error('删除标签失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [fetchTags]);

  const openEditModal = useCallback((tag: Tag | null = null) => {
    setEditingTag(tag);
    if (tag) {
      form.setFieldsValue(tag);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  }, [form]);

  // Effects
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    filterTags(searchText);
  }, [tags, searchText, filterTags]);

  useEffect(() => {
    const { userGuid } = useGlobalStore.getState();
    allLabelMind({ userGuid });
  }, [allLabelMind]);

  // Memoized tab items
  const tabItems = React.useMemo(() => [
    {
      key: 'hierarchy',
      label: (
        <span>
          <NodeIndexOutlined />
          Title-Label-KeyWord
        </span>
      ),
      children: (
        <TabContent 
          type="hierarchy" 
          tags={filteredTags}
          loading={!data1}
          data={data1}
        />
      ),
    },
    {
      key: 'category',
      label: (
        <span>
          <ClusterOutlined />
          Label-Title
        </span>
      ),
      children: (
        <TabContent 
          type="category" 
          tags={filteredTags}
          loading={!data2}
          data={data2}
        />
      ),
    }
  ], [filteredTags, data1, data2]);

  return (
    <Layout className="tag-management">
      <Sider width={300} theme="light" className="tag-sider">
        <div className="tag-header">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openEditModal()}
          >
            Add Tag
          </Button>
          <Search
            placeholder="Search Label"
            allowClear
            onChange={e => setSearchText(e.target.value)}
            className="tag-search"
          />
        </div>
        
        <Spin spinning={loading}>
          <List
            className="tag-list"
            dataSource={filteredTags}
            renderItem={tag => (
              <List.Item
                className="tag-item"
                actions={[
                  <Button
                    key="edit"
                    icon={<EditOutlined />}
                    type="text"
                    onClick={() => openEditModal(tag)}
                  />,
                  <Popconfirm
                    key="delete"
                    title="确定要删除这个标签吗？"
                    onConfirm={() => handleDeleteTag(tag)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      type="text"
                      danger
                    />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span>{tag.labelWord}</span>
                    </Space>
                  }
                  description={
                    <div className="tag-meta-content">
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>
      </Sider>

      <Content className="tag-content">
        <Tabs
          defaultActiveKey="hierarchy"
          items={tabItems}
          className="tag-tabs"
          type="card"
        />
      </Content>

      <Modal
        title={editingTag ? '编辑标签' : '新增标签'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={handleTagSubmit}
          layout="vertical"
          initialValues={{ isUser: true }}
        >
          <Form.Item
            name="labelWord"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="labelRemark"
            label="标签描述"
          >
            <Input.TextArea />
          </Form.Item>
          
          {/* <Form.Item
            name="isUser"
            valuePropName="checked"
          >
            <Checkbox>MyTab</Checkbox>
          </Form.Item> */}
        </Form>
      </Modal>
    </Layout>
  );
}