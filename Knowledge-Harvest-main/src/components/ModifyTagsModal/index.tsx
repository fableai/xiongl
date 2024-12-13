// ModifyTagsModal/index.tsx
import React, { useState } from 'react';
import { Modal, Button, Select, Tag, Space } from 'antd';

const ModifyTagsModal = ({ visible, onClose, currentTags, availableTags, onUpdateTags }) => {
    const [tags, setTags] = useState(currentTags);

    const handleReplaceTag = (oldTag, newTag) => {
        setTags(tags.map(tag => (tag === oldTag ? newTag : tag)));
    };

    const handleDeleteTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleAddTag = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleSave = () => {
        onUpdateTags(tags);
        onClose();
    };

    return (
        <Modal
            title="修改标签"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={handleSave}>Save</Button>,
            ]}
        >
            <div>
                <h3>Current Tags:</h3>
                {tags.map(tag => (
                    <Space key={tag}>
                        <Tag closable onClose={() => handleDeleteTag(tag)}>
                            {tag}
                        </Tag>
                        <Select
                            defaultValue={tag}
                            onChange={(value) => handleReplaceTag(tag, value)}
                            style={{ width: 120 }}
                        >
                            {availableTags.map(availableTag => (
                                <Select.Option key={availableTag} value={availableTag}>
                                    {availableTag}
                                </Select.Option>
                            ))}
                        </Select>
                    </Space>
                ))}
            </div>
            <div>
                <h3>Add Tag:</h3>
                <Select
                    onChange={handleAddTag}
                    style={{ width: 200 }}
                    placeholder="选择标签"
                >
                    {availableTags.map(availableTag => (
                        <Select.Option key={availableTag} value={availableTag}>
                            {availableTag}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </Modal>
    );
};

export default ModifyTagsModal;