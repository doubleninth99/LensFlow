# LensFlow - 镜头流

面向独立摄影师的轻量级 CRM 小程序

## 项目概述

LensFlow 是一款专为独立摄影师设计的客户关系管理小程序，帮助摄影师更好地管理客户、展示作品风格、处理订单交付。

### 当前版本

**v1.0.0** - 客户侧风格确认落地页

## 技术栈

- **框架**: Uni-app + Vue 3
- **样式**: Tailwind CSS + SCSS
- **数据**: 本地 JSON 模拟
- **部署**: 微信小程序

## 功能特性

### 客户侧 - 风格确认落地页

- **沉浸式封面**: 满屏大图展示，引导用户开启审美之旅
- **风格列表**: 非对称排版的风格卡片展示
- **多选交互**: 点击选中/取消，呼吸灯边框效果
- **全屏图库**: 横滑浏览作品详情
- **毛玻璃效果**: 高端质感 UI 设计

## 目录结构

```
LensFlow/
├── pages/
│   └── client/
│       └── moodboard/
│           ├── index.vue              # 主页面
│           └── components/
│               ├── CoverPage.vue      # 封面组件
│               ├── StyleCard.vue      # 风格卡片
│               ├── FixedBar.vue       # 底部固定栏
│               └── GalleryDetail.vue  # 图库详情
├── mock-data/
│   └── styles.json                    # 模拟数据
├── styles/
│   └── theme.css                      # 主题样式
├── App.vue                             # 应用入口
├── main.js                             # 主文件
├── pages.json                          # 页面配置
├── manifest.json                       # 应用配置
├── tailwind.config.js                  # Tailwind 配置
└── package.json                        # 依赖配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产

```bash
npm run build
```

## 设计规范

### 配色方案

- 背景色: `#121212` (深色背景)
- 主文字: `#FFFFFF`
- 次文字: `#E0E0E0`
- 弱文字: `#A0A0A0`

### 交互设计

- 呼吸灯动画: 选中状态边框闪烁效果
- 毛玻璃: `backdrop-filter: blur(10px)`
- 淡入淡出: 平滑的页面切换
- 点击反馈: `scale(0.98)` 缩放效果

## 开发计划

### 已完成

- [x] 项目初始化
- [x] 封面组件
- [x] 风格卡片组件
- [x] 底部固定栏
- [x] 图库详情页
- [x] 主页面布局

### 待开发

- [ ] 摄影师管理端首页
- [ ] 风格管理模块
- [ ] 档期预约模块
- [ ] 项目订单模块
- [ ] 交付中心模块
- [ ] 后端 API 对接

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

Copyright © 2024 LensFlow. All rights reserved.
