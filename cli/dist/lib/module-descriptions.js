/**
 * Module and action descriptions for Cocos Creator HTTP API
 */
/**
 * Module descriptions
 */
export const MODULE_DESCRIPTIONS = {
    scene: '场景管理 - 打开、保存场景，创建/删除节点，设置属性等',
    'asset-db': '资源数据库 - 创建、导入、删除、查询资源文件',
    project: '项目设置 - 管理项目配置和设置',
    builder: '构建工具 - 打开构建面板，查询构建状态',
    engine: '引擎信息 - 查询 Cocos Creator 引擎版本和路径',
    information: '信息对话框 - 管理编辑器信息提示框',
    preferences: '偏好设置 - 管理编辑器偏好配置',
    program: '外部程序 - 打开外部程序或 URL',
    programming: '编程设置 - 查询共享设置和插件列表',
    server: '服务器 - 查询 HTTP 服务器 IP 和端口',
    device: '设备 - 查询连接的移动设备信息',
    extension: '扩展 - 创建扩展模板',
};
/**
 * Action descriptions for each module
 */
export const ACTION_DESCRIPTIONS = {
    scene: {
        // 生命周期操作
        'query-is-ready': '查询场景是否准备就绪',
        'open-scene': '打开指定路径的资源文件（支持 .scene、.prefab 等 Cocos 资源文件）',
        'save-scene': '保存当前场景',
        'save-as-scene': '将场景另存为新文件',
        'close-scene': '关闭当前场景',
        'soft-reload': '软重载场景',
        'query-dirty': '查询场景是否已修改',
        // 节点操作
        'create-node': '创建新节点',
        'remove-node': '删除节点',
        'copy-node': '复制节点',
        'cut-node': '剪切节点',
        'paste-node': '粘贴节点',
        'duplicate-node': '复制并粘贴节点',
        'set-parent': '设置节点的父节点',
        'reset-node': '重置节点变换',
        'query-node': '查询节点信息',
        'query-node-tree': '查询场景节点树',
        'query-nodes-by-asset-uuid': '查询使用指定资源的节点',
        'restore-prefab': '恢复预制体实例',
        // 组件操作
        'create-component': '添加组件到节点',
        'remove-component': '从节点移除组件',
        'reset-component': '重置组件属性',
        'execute-component-method': '调用组件方法',
        'execute-scene-script': '执行场景脚本',
        'query-component': '查询组件的详细信息',
        'query-components': '查询所有可用的组件类列表',
        'query-classes': '查询可用组件类',
        'query-component-has-script': '查询节点是否有脚本组件',
        // 属性操作
        'set-property': '设置节点或组件属性值',
        'reset-property': '重置属性为默认值',
        'move-array-element': '移动数组元素位置',
        'remove-array-element': '删除数组元素',
        // 查询
        'query-scene-bounds': '查询场景的边界信息',
        'is-native': '查询节点是否为原生对象',
        // Gizmo 操作
        'change-gizmo-tool': '切换 Gizmo 工具',
        'query-gizmo-tool-name': '查询当前 Gizmo 工具名称',
        'change-gizmo-pivot': '切换 Gizmo 中心点',
        'query-gizmo-pivot': '查询当前 Gizmo 中心点',
        'change-gizmo-coordinate': '切换 Gizmo 坐标系',
        'query-gizmo-coordinate': '查询当前 Gizmo 坐标系',
        'change-is2D': '切换 2D/3D 模式',
        'query-is2D': '查询是否为 2D 模式',
        'set-grid-visible': '设置网格可见性',
        'query-is-grid-visible': '查询网格是否可见',
        'set-icon-gizmo-3d': '设置图标 Gizmo 3D 模式',
        'query-is-icon-gizmo-3d': '查询图标 Gizmo 是否为 3D',
        'set-icon-gizmo-size': '设置图标 Gizmo 大小',
        'query-icon-gizmo-size': '查询图标 Gizmo 大小',
        'snapshot': '创建场景快照',
        'snapshot-abort': '中止快照操作',
        // 相机操作
        'focus-camera': '聚焦相机到节点',
        'align-with-view': '对齐视图到选中的节点',
        'align-view-with-node': '对齐节点到当前视图',
    },
    'asset-db': {
        // 状态
        'query-ready': '查询资源数据库是否准备就绪',
        // 资源操作
        'create-asset': '创建新资源文件',
        'import-asset': '导入外部资源',
        'copy-asset': '复制资源文件',
        'move-asset': '移动资源文件',
        'delete-asset': '删除资源文件',
        // 资源编辑
        'open-asset': '在编辑器中打开资源',
        'save-asset': '保存资源',
        'save-asset-meta': '保存资源 meta 文件',
        'reimport-asset': '重新导入资源',
        'refresh-asset': '刷新资源',
        // 查询
        'query-asset-info': '查询资源详细信息',
        'query-missing-asset-info': '查询缺失资源信息',
        'query-asset-meta': '查询资源 meta 数据',
        'query-asset-users': '查询使用该资源的文件',
        'query-asset-dependencies': '查询资源依赖项',
        'query-path': '查询资源的文件系统绝对路径',
        'query-url': '查询资源的 db:// URL（编辑器内部格式）',
        'query-uuid': '查询资源的 UUID（支持 db:// 格式或绝对路径）',
        'query-assets': '查询资源列表',
        'generate-available-url': '生成可用的资源 URL',
    },
    project: {
        'open-settings': '打开项目设置面板',
        'query-config': '查询项目配置',
        'set-config': '设置项目配置值',
    },
    builder: {
        'open': '打开构建面板',
        'query-worker-ready': '查询构建 worker 是否准备就绪',
    },
    engine: {
        'query-info': '查询引擎信息',
        'query-engine-info': '查询引擎详细信息和路径',
    },
    information: {
        'query-information': '查询信息对话框内容',
        'open-information-dialog': '打开信息对话框',
        'has-dialog': '检查是否存在信息对话框',
        'close-dialog': '关闭信息对话框',
    },
    preferences: {
        'open-settings': '打开偏好设置面板',
        'query-config': '查询偏好设置配置',
        'set-config': '设置偏好配置值',
    },
    program: {
        'query-program-info': '查询外部程序信息',
        'open-program': '打开外部程序',
        'open-url': '在浏览器中打开 URL',
    },
    programming: {
        'query-shared-settings': '查询共享编程设置',
        'query-sorted-plugins': '查询排序后的插件列表',
    },
    server: {
        'query-ip-list': '查询服务器可用 IP 列表',
        'query-port': '查询服务器端口号',
    },
    device: {
        'query': '查询连接的移动设备信息',
    },
    extension: {
        'create-extension-template': '创建扩展模板',
    },
};
//# sourceMappingURL=module-descriptions.js.map