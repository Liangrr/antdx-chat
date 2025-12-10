/**
 * 本地化文本配置
 */

export default {
  // 通用
  today: '今天',
  yesterday: '昨天',
  newConversation: '新对话',
  curConversation: '当前',
  rename: '重命名',
  delete: '删除',
  
  // 欢迎页
  welcome: '你好，我是 Ant Design X',
  welcomeDescription: '基于蚂蚁设计，AGI产品新解决方案，打造更好的智能视觉~',
  
  // 热门话题
  hotTopics: '热门话题',
  whatComponentsAreInAntDesignX: 'Ant Design X 中有哪些组件？',
  newAgiHybridInterface: '新的 AGI 混合界面',
  comeAndDiscoverNewDesignParadigm: '快速发现 AI 时代的新设计范式...',
  whatIsAntDesignX: '什么是 Ant Design X?',
  howToQuicklyInstallAndImportComponents: '如何快速安装和导入组件？',
  
  // 设计指南
  designGuide: '设计指南',
  intention: '意图',
  aiUnderstandsUserNeedsAndProvidesSolutions: 'AI理解用户需求并提供解决方案',
  role: '角色',
  aiPublicPersonAndImage: 'AI的公众形象',
  chat: '对话',
  howAICanExpressItselfWayUsersUnderstand: 'AI如何以用户理解的方式表达自己',
  interface: '界面',
  aiBalances: 'AI宿主"聊天"和"执行"行为',
  
  // 输入框提示
  askOrInputUseSkills: '提问或输入 / 使用指令',
  upgrades: '升级',
  components: '组件',
  richGuide: 'RICH 指南',
  installationIntroduction: '安全介绍',
  
  // 附件
  uploadFile: '上传文件',
  uploadFiles: '上传文件',
  dropFileHere: '拖放文件到此处',
  clickOrDragFilesToUpload: '点击或拖拽文件到此处上传',
  
  // 消息状态
  modelIsRunning: '模型运行中',
  modelExecutionCompleted: '模型执行完成',
  executionFailed: '执行失败',
  aborted: '已终止',
  deepThinking: '深度思考中',
  completeThinking: '思考完成',
  
  // 操作
  retry: '重试',
  noData: '暂无数据',
  requestFailedPleaseTryAgain: '请求失败，请重试',
  isMock: '这是模拟操作',
  itIsNowANewConversation: '当前已经是新对话了',
  
  // AI 回复内容
  aiMessage_1: `Ant Design X 是蚂蚁集团推出的 AI 产品设计解决方案，它基于 Ant Design 设计体系，专注于 AGI（人工通用智能）时代的产品设计。

主要特点：
1. **组件丰富**：提供了专门针对 AI 对话场景的组件，如 Bubble、Sender、Conversations 等
2. **开箱即用**：内置了常见的 AI 交互模式和最佳实践
3. **高度可定制**：支持灵活的样式和行为定制
4. **完整生态**：与 Ant Design 生态无缝集成

适用场景：
- AI 聊天机器人
- 智能客服系统
- AI 助手应用
- 对话式界面

通过 Ant Design X，开发者可以快速构建专业、美观的 AI 产品界面。`,

  aiMessage_2: `安装 Ant Design X 非常简单，只需几个步骤：

## 1. 安装依赖

\`\`\`bash
# 使用 npm
npm install antd @ant-design/x

# 使用 pnpm
pnpm add antd @ant-design/x

# 使用 yarn
yarn add antd @ant-design/x
\`\`\`

## 2. 导入组件

\`\`\`tsx
import { Bubble, Sender, Conversations } from '@ant-design/x';
import 'antd/dist/reset.css';
\`\`\`

## 3. 使用组件

\`\`\`tsx
import { Sender } from '@ant-design/x';

function App() {
  return (
    <Sender
      onSubmit={(value) => console.log(value)}
      placeholder="输入消息..."
    />
  );
}
\`\`\`

就这么简单！更多详细信息请查看官方文档。`,
};

