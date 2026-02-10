/**
 * Asset Database module action details
 */
export const assetDbDetails = {
    'query-ready': {
        description: '查询资源数据库是否准备就绪',
        parameters: [],
        examples: [
            'cocos-skills asset-db query-ready',
        ],
        notes: '返回布尔值，表示资源数据库是否可以接受请求。在执行资源操作前建议先检查此状态',
    },
    'create-asset': {
        description: '创建新资源文件（自动生成默认数据）',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '资源文件路径，如 db://assets/prefabs/Test.prefab' },
        ],
        examples: [
            'cocos-skills asset-db create-asset db://assets/prefabs/Test.prefab',
            'cocos-skills asset-db create-asset db://assets/scenes/Test.scene',
            'cocos-skills asset-db create-asset db://assets/materials/Test.mtl',
            'cocos-skills asset-db create-asset db://assets/physics/Test.pmtl',
            'cocos-skills asset-db create-asset db://assets/animations/Test.anim',
        ],
        notes: '系统会根据文件扩展名自动生成默认的 JSON 数据。支持的文件类型：.prefab、.scene、.material、.mtl、.pmtl、.anim、.animask、.pac、.labelatlas',
    },
    'import-asset': {
        description: '导入外部资源到项目',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '目标资源路径（db://assets/...）' },
            { name: 'importPath', type: 'string', required: true, description: '源文件路径（本地绝对路径或 URL）' },
        ],
        examples: [
            'cocos-skills asset-db import-asset db://assets/textures/sprite.png "C:\\\\Users\\\\username\\\\Pictures\\\\sprite.png"',
            'cocos-skills asset-db import-asset db://assets/audio/bgm.mp3 "D:/Music/bgm.mp3"',
        ],
        notes: '支持的格式: .png, .jpg, .mp3, .wav, .json, .prefab 等。导入后自动生成 .meta 文件',
    },
    'copy-asset': {
        description: '复制资源文件（包含 meta 文件）',
        parameters: [
            { name: 'source', type: 'string', required: true, description: '源资源路径' },
            { name: 'target', type: 'string', required: true, description: '目标资源路径' },
        ],
        examples: [
            'cocos-skills asset-db copy-asset db://assets/prefabs/Old.prefab db://assets/prefabs/New.prefab',
            'cocos-skills asset-db copy-asset db://assets/textures/sprite.png db://assets/textures/sprite_copy.png',
        ],
        notes: '复制操作会同时复制 .meta 文件，新的 UUID 会自动生成',
    },
    'move-asset': {
        description: '移动/重命名资源文件',
        parameters: [
            { name: 'source', type: 'string', required: true, description: '源资源路径' },
            { name: 'target', type: 'string', required: true, description: '目标资源路径' },
        ],
        examples: [
            'cocos-skills asset-db move-asset db://assets/prefabs/Old.prefab db://assets/prefabs/New.prefab',
            'cocos-skills asset-db move-asset db://assets/temp/scene.scene db://assets/scenes/Main.scene',
        ],
        notes: '移动操作会自动更新所有引用该资源的地方。谨慎操作，避免破坏引用关系',
    },
    'delete-asset': {
        description: '删除资源文件（包含 meta 文件）',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '要删除的资源路径' },
        ],
        examples: [
            'cocos-skills asset-db delete-asset db://assets/prefabs/Test.prefab',
        ],
        notes: '此操作不可撤销。建议先使用 query-asset-users 检查是否有其他文件引用该资源',
    },
    'open-asset': {
        description: '在编辑器中打开资源（支持 UUID 或路径，自动保存当前场景）',
        parameters: [
            { name: 'uuidOrPath', type: 'string', required: true, description: 'UUID 或路径（db://...）' },
        ],
        examples: [
            'cocos-skills asset-db open-asset db://assets/scenes/Main.scene',
            'cocos-skills asset-db open-asset <uuid>',
        ],
        notes: `自动识别参数格式。与 scene open-scene 功能相同，可互换使用。

自动保存功能：
- 打开资源前会自动检查当前场景是否有未保存的更改
- 如果有未保存的更改，会自动调用 save-scene 保存当前场景
- 然后再打开资源

UUID/路径转换：
- UUID → 路径：asset-db query-url <uuid>
- 路径 → UUID：asset-db query-uuid <path>`,
    },
    'save-asset': {
        description: '保存资源（跳过 API 调用，自动保存当前场景）',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '资源路径' },
        ],
        examples: [
            'cocos-skills asset-db save-asset db://assets/data/config.json',
            'cocos-skills asset-db save-asset db://assets/scenes/New.scene',
        ],
        notes: `此命令已简化为直接返回成功，不会调用保存资源的 API 接口。

自动保存功能：
- 返回成功前会自动检查当前场景是否有未保存的更改
- 如果有未保存的更改，会自动调用 save-scene 保存当前场景
- 然后直接返回成功响应

重要说明：
- 此命令不再实际保存资源文件到磁盘
- 仅用于兼容性，直接返回成功响应
- 如需保存场景内容，请使用 scene save-scene 命令`,
    },
    'save-asset-meta': {
        description: '保存资源的 meta 文件',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '资源路径' },
            { name: 'metaContent', type: 'string', required: true, description: 'meta 文件内容（JSON 字符串）' },
        ],
        examples: [
            'cocos-skills asset-db save-asset-meta db://assets/textures/sprite.png \'{"ver": "1.1.0", "uuid": "..."}\'',
        ],
        notes: 'meta 文件包含资源的导入设置、UUID 等重要信息。第二个参数应为完整的 meta JSON 字符串',
    },
    'reimport-asset': {
        description: '重新导入资源',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '资源路径' },
        ],
        examples: [
            'cocos-skills asset-db reimport-asset db://assets/textures/sprite.png',
            'cocos-skills asset-db reimport-asset db://assets/model.fbx',
        ],
        notes: '强制重新导入资源，在更新导入设置或源文件被外部修改后使用',
    },
    'refresh-asset': {
        description: '刷新资源状态',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '资源路径' },
        ],
        examples: [
            'cocos-skills asset-db refresh-asset db://assets/textures/sprite.png',
        ],
        notes: '检查资源的磁盘状态是否发生变化，但不重新导入',
    },
    'query-asset-info': {
        description: '查询资源详细信息（类型、大小、导入时间等）',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '资源路径或 UUID' },
        ],
        examples: [
            'cocos-skills asset-db query-asset-info db://assets/scenes/Main.scene',
            'cocos-skills asset-db query-asset-info "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6"',
        ],
        notes: '返回资源的完整元数据，包括类型、文件大小、导入时间、依赖项等',
    },
    'query-missing-asset-info': {
        description: '查询缺失资源的信息（引用存在但文件丢失）',
        parameters: [
            { name: 'uuid', type: 'string', required: true, description: '缺失资源的 UUID' },
        ],
        examples: [
            'cocos-skills asset-db query-missing-asset-info "uuid-string-here"',
        ],
        notes: '用于追踪丢失的资源引用，帮助修复资源依赖问题',
    },
    'query-asset-meta': {
        description: '查询资源的 meta 配置数据',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '资源路径或 UUID' },
        ],
        examples: [
            'cocos-skills asset-db query-asset-meta db://assets/textures/sprite.png',
        ],
        notes: '返回 .meta 文件的内容，包含导入设置、裁剪信息、打包选项等',
    },
    'query-asset-users': {
        description: '查询所有引用该资源的文件列表',
        parameters: [
            { name: 'uuid', type: 'string', required: true, description: '资源的 UUID' },
        ],
        examples: [
            'cocos-skills asset-db query-asset-users "uuid-string-here"',
        ],
        notes: '返回场景、预制体等所有引用该资源的文件。删除资源前务必检查此列表',
    },
    'query-asset-dependencies': {
        description: '查询资源依赖的所有其他资源',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '资源路径' },
        ],
        examples: [
            'cocos-skills asset-db query-asset-dependencies db://assets/scenes/Main.scene',
        ],
        notes: '返回该资源直接和间接依赖的所有资源树状结构',
    },
    'query-path': {
        description: '通过 UUID 查询资源的文件系统绝对路径',
        parameters: [
            { name: 'uuid', type: 'string', required: true, description: '资源的 UUID' },
        ],
        examples: [
            'cocos-skills asset-db query-path "uuid-string-here"',
        ],
        notes: '返回文件系统的绝对路径（如 E:\\project\\assets\\prefab.prefab）。如需 db:// 格式，请使用 query-url',
    },
    'query-url': {
        description: '通过 UUID 查询资源的 db:// URL（编辑器内部格式）',
        parameters: [
            { name: 'uuid', type: 'string', required: true, description: '资源的 UUID' },
        ],
        examples: [
            'cocos-skills asset-db query-url "uuid-string-here"',
        ],
        notes: '返回 db:// 格式的 URL（如 db://assets/prefabs/New.prefab）。如需文件系统路径，请使用 query-path',
    },
    'query-uuid': {
        description: '通过路径查询资源的 UUID（支持 db:// 格式或文件系统绝对路径）',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '资源路径，支持 db:// 格式或文件系统绝对路径' },
        ],
        examples: [
            'cocos-skills asset-db query-uuid db://assets/scenes/Main.scene',
            'cocos-skills asset-db query-uuid "E:\\\\cocos-project\\\\assets\\\\scenes\\\\scene.scene"',
            'cocos-skills asset-db query-uuid "/home/user/project/assets/textures/sprite.png"',
        ],
        notes: '每个资源都有唯一的 UUID，用于资源引用和依赖管理。支持 db:// 路径和文件系统绝对路径',
    },
    'query-assets': {
        description: '查询资源列表',
        parameters: [
            { name: 'pattern', type: 'string', required: false, description: '搜索路径，如 db://assets/prefabs 或 db://assets/scenes' },
        ],
        examples: [
            'cocos-skills asset-db query-assets',
            'cocos-skills asset-db query-assets "db://assets/prefabs"',
            'cocos-skills asset-db query-assets "db://assets/scenes"',
            'cocos-skills asset-db query-assets "db://assets/textures"',
        ],
        notes: '不传参数返回所有资源。pattern 参数指定目录路径，会返回该目录及其子目录中的资源',
    },
    'generate-available-url': {
        description: '生成可用的资源 URL（自动处理命名冲突）',
        parameters: [
            { name: 'path', type: 'string', required: true, description: '完整资源路径（含扩展名），如 db://assets/test.png' },
            { name: 'isDirectory', type: 'boolean', required: true, description: '是否为目录（通常传 false）' },
        ],
        examples: [
            'cocos-skills asset-db generate-available-url "db://assets/textures/sprite.png" false',
            'cocos-skills asset-db generate-available-url "db://assets/prefabs/New.prefab" false',
            'cocos-skills asset-db generate-available-url "db://assets/scenes/Main.scene" false',
        ],
        notes: '如果目标路径已存在，会自动添加数字后缀（如 New-001.prefab、New-002.prefab）',
    },
};
//# sourceMappingURL=asset-db.js.map