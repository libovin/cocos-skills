/**
 * Component Property Definitions
 * 组件属性定义表，用于验证 set-property 命令的属性名
 */

export interface PropertyDefinition {
  name: string;
  type: string;
  description: string;
}

export interface ComponentDefinition {
  type: string;
  description: string;
  properties: PropertyDefinition[];
}

export const componentProperties: ComponentDefinition[] = [
  {
    type: 'cc.Node',
    description: '节点属性',
    properties: [
      { name: 'position', type: 'cc.Vec3', description: '世界坐标位置' },
      { name: 'scale', type: 'cc.Vec3', description: '缩放' },
      { name: 'angle', type: 'cc.Vec3', description: '旋转角度' },
      { name: 'layer', type: 'cc.Enum', description: '层级' },
      { name: 'mobility', type: 'cc.Enum', description: '移动性 (0=Static, 1=Stationary, 2=Movable)' },
      { name: 'name', type: 'cc.String', description: '节点名称' },
      { name: 'active', type: 'cc.Boolean', description: '是否激活' },
      { name: 'parent', type: 'cc.Node', description: '父节点' },
    ],
  },
  {
    type: 'cc.UITransform',
    description: 'UI 变换组件',
    properties: [
      { name: 'contentSize', type: 'cc.Size', description: '内容尺寸' },
      { name: 'anchorPoint', type: 'cc.Vec2', description: '锚点' },
      { name: 'priority', type: 'cc.Number', description: '渲染优先级' },
    ],
  },
  {
    type: 'cc.Sprite',
    description: '精灵渲染组件',
    properties: [
      { name: 'color', type: 'cc.Color', description: '颜色' },
      { name: 'spriteFrame', type: 'cc.SpriteFrame', description: '精灵帧' },
      { name: 'type', type: 'cc.Enum', description: '精灵类型 (0=SIMPLE, 1=SLICED, 2=TILED, 3=FILLED)' },
      { name: 'fillType', type: 'cc.Enum', description: '填充类型 (0=HORIZONTAL, 1=VERTICAL, 2=RADIAL)' },
      { name: 'fillCenter', type: 'cc.Vec2', description: '填充中心' },
      { name: 'fillStart', type: 'cc.Number', description: '填充起始角度 (0-1)' },
      { name: 'fillRange', type: 'cc.Number', description: '填充范围 (-1 到 1)' },
      { name: 'trim', type: 'cc.Boolean', description: '是否裁剪' },
      { name: 'grayscale', type: 'cc.Boolean', description: '是否使用灰度' },
      { name: 'sizeMode', type: 'cc.Enum', description: '尺寸模式 (0=CUSTOM, 1=TRIMMED, 2=RAW)' },
      { name: 'spriteAtlas', type: 'cc.SpriteAtlas', description: '精灵图集' },
      { name: 'customMaterial', type: 'cc.Material', description: '自定义材质' },
      { name: 'sharedMaterials', type: 'cc.Array', description: '材质数组' },
    ],
  },
  {
    type: 'cc.Label',
    description: '文本渲染组件',
    properties: [
      { name: 'string', type: 'cc.String', description: '文本内容' },
      { name: 'fontSize', type: 'cc.Number', description: '字体大小' },
      { name: 'color', type: 'cc.Color', description: '文字颜色' },
      { name: 'lineHeight', type: 'cc.Number', description: '行高' },
      { name: 'horizontalAlign', type: 'cc.Enum', description: '水平对齐 (0=左, 1=中, 2=右)' },
      { name: 'verticalAlign', type: 'cc.Enum', description: '垂直对齐 (0=顶, 1=中, 2=底)' },
      { name: 'spacingX', type: 'cc.Number', description: '字符间距' },
      { name: 'overflow', type: 'cc.Enum', description: '溢出模式 (0=NONE, 1=CLAMP, 2=SHRINK, 3=RESIZE_HEIGHT)' },
      { name: 'enableWrapText', type: 'cc.Boolean', description: '是否自动换行' },
      { name: 'useSystemFont', type: 'cc.Boolean', description: '是否使用系统字体' },
      { name: 'fontFamily', type: 'cc.String', description: '字体名称' },
      { name: 'font', type: 'cc.Font', description: '字体资源' },
      { name: 'cacheMode', type: 'cc.Enum', description: '缓存模式 (0=NONE, 1=BITMAP, 2=CHAR)' },
      { name: 'isBold', type: 'cc.Boolean', description: '是否粗体' },
      { name: 'isItalic', type: 'cc.Boolean', description: '是否斜体' },
      { name: 'isUnderline', type: 'cc.Boolean', description: '是否下划线' },
      { name: 'underlineHeight', type: 'cc.Number', description: '下划线高度' },
      { name: 'enableOutline', type: 'cc.Boolean', description: '是否启用描边' },
      { name: 'outlineColor', type: 'cc.Color', description: '描边颜色' },
      { name: 'outlineWidth', type: 'cc.Number', description: '描边宽度' },
      { name: 'enableShadow', type: 'cc.Boolean', description: '是否启用阴影' },
      { name: 'shadowColor', type: 'cc.Color', description: '阴影颜色' },
      { name: 'shadowOffset', type: 'cc.Vec2', description: '阴影偏移' },
      { name: 'shadowBlur', type: 'cc.Number', description: '阴影模糊' },
    ],
  },
  {
    type: 'cc.Button',
    description: '按钮交互组件',
    properties: [
      { name: 'interactable', type: 'cc.Boolean', description: '是否可交互' },
      { name: 'transition', type: 'cc.Enum', description: '过渡类型 (0=无, 1=颜色, 2=精灵, 3=缩放)' },
      { name: 'normalColor', type: 'cc.Color', description: '普通状态颜色' },
      { name: 'pressedColor', type: 'cc.Color', description: '按下状态颜色' },
      { name: 'hoverColor', type: 'cc.Color', description: '悬停状态颜色' },
      { name: 'disabledColor', type: 'cc.Color', description: '禁用状态颜色' },
      { name: 'normalSprite', type: 'cc.SpriteFrame', description: '普通状态精灵帧' },
      { name: 'pressedSprite', type: 'cc.SpriteFrame', description: '按下状态精灵帧' },
      { name: 'hoverSprite', type: 'cc.SpriteFrame', description: '悬停状态精灵帧' },
      { name: 'disabledSprite', type: 'cc.SpriteFrame', description: '禁用状态精灵帧' },
      { name: 'duration', type: 'cc.Number', description: '过渡持续时间' },
      { name: 'zoomScale', type: 'cc.Number', description: '缩放比例' },
      { name: 'target', type: 'cc.Node', description: '目标节点' },
      { name: 'clickEvents', type: 'cc.Array', description: '点击事件数组' },
    ],
  },
  {
    type: 'cc.Widget',
    description: 'UI 对齐组件',
    properties: [
      { name: 'top', type: 'cc.Number', description: '上边距' },
      { name: 'bottom', type: 'cc.Number', description: '下边距' },
      { name: 'left', type: 'cc.Number', description: '左边距' },
      { name: 'right', type: 'cc.Number', description: '右边距' },
      { name: 'horizontalCenter', type: 'cc.Number', description: '水平中心偏移' },
      { name: 'verticalCenter', type: 'cc.Number', description: '垂直中心偏移' },
      { name: 'isAbsoluteTop', type: 'cc.Boolean', description: '上边距是否绝对值' },
      { name: 'isAbsoluteBottom', type: 'cc.Boolean', description: '下边距是否绝对值' },
      { name: 'isAbsoluteLeft', type: 'cc.Boolean', description: '左边距是否绝对值' },
      { name: 'isAbsoluteRight', type: 'cc.Boolean', description: '右边距是否绝对值' },
      { name: 'isAbsoluteHorizontalCenter', type: 'cc.Boolean', description: '水平中心偏移是否绝对值' },
      { name: 'isAbsoluteVerticalCenter', type: 'cc.Boolean', description: '垂直中心偏移是否绝对值' },
      { name: 'target', type: 'cc.Node', description: '对齐目标节点' },
      { name: 'alignMode', type: 'cc.Number', description: '对齐模式' },
    ],
  },
  {
    type: 'cc.Layout',
    description: '自动布局组件',
    properties: [
      { name: 'type', type: 'cc.Enum', description: '布局类型 (0=无, 1=水平, 2=垂直, 3=网格)' },
      { name: 'resizeMode', type: 'cc.Enum', description: '缩放模式 (0=无, 1=子节点, 2=容器)' },
      { name: 'cellSize', type: 'cc.Size', description: '单元格大小' },
      { name: 'startAxis', type: 'cc.Enum', description: '起始轴 (0=水平, 1=垂直)' },
      { name: 'horizontalDirection', type: 'cc.Enum', description: '水平方向 (0=左到右, 1=右到左)' },
      { name: 'verticalDirection', type: 'cc.Enum', description: '垂直方向 (0=上到下, 1=下到上)' },
      { name: 'paddingLeft', type: 'cc.Number', description: '左内边距' },
      { name: 'paddingRight', type: 'cc.Number', description: '右内边距' },
      { name: 'paddingTop', type: 'cc.Number', description: '上内边距' },
      { name: 'paddingBottom', type: 'cc.Number', description: '下内边距' },
      { name: 'spacingX', type: 'cc.Number', description: '水平间距' },
      { name: 'spacingY', type: 'cc.Number', description: '垂直间距' },
      { name: 'affectedByScale', type: 'cc.Boolean', description: '是否受缩放影响' },
      { name: 'autoResize', type: 'cc.Boolean', description: '是否自动调整大小' },
    ],
  },
  {
    type: 'cc.Mask',
    description: '遮罩组件',
    properties: [
      { name: 'type', type: 'cc.Enum', description: '遮罩类型 (0=矩形, 1=椭圆, 2=图像)' },
      { name: 'inverted', type: 'cc.Boolean', description: '是否反转' },
      { name: 'segments', type: 'cc.Number', description: '椭圆分段数' },
      { name: 'spriteFrame', type: 'cc.SpriteFrame', description: '遮罩图像' },
    ],
  },
 
];

export const componentPropertyMap = new Map<string, Set<string>>(
  componentProperties.map((comp) => [comp.type, new Set(comp.properties.map((p) => p.name))])
);

export function isBuiltinComponent(componentType: string): boolean {
  return componentPropertyMap.has(componentType);
}

export function isValidProperty(componentType: string, propertyName: string): boolean {
  const props = componentPropertyMap.get(componentType);
  if (!props) {
    return true;
  }
  return props.has(propertyName);
}

export function getComponentDefinition(componentType: string): ComponentDefinition | undefined {
  return componentProperties.find((comp) => comp.type === componentType);
}

export function getSupportedComponents(): string[] {
  return componentProperties.map((comp) => comp.type);
}

export function getPropertiesForComponent(componentType: string): PropertyDefinition[] {
  const comp = getComponentDefinition(componentType);
  return comp ? comp.properties : [];
}
