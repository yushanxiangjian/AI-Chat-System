<template>
  <div class='chat-container'>
    <div class='chat-header'>
      <h2>AI 聊天系统</h2>
    </div>
    <div class='chat-messages' ref='msgContainer'>
      <div v-for='(msg, index) in chat' :key='index' :class='[\"message\", msg.role]'>
        <div class='message-content'>{{ msg.content }}</div>
      </div>
    </div>
    <div class='chat-input'>
      <textarea v-model='input' @keydown.enter.exact.prevent='send' placeholder='请输入消息...'></textarea>
      <button :disabled='loading' @click='send'>{{ loading ? '发送中...' : '发送' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { askChat } from '../api/chat'

const chat = ref([])
const input = ref('')
const loading = ref(false)
const msgContainer = ref(null)

const send = async () => {
  if (!input.value.trim()) return
  chat.value.push({ role: 'user', content: input.value })
  loading.value = true
  try {
    const res = await askChat(chat.value)
    chat.value.push({ role: 'assistant', content: res })
    await nextTick()
    msgContainer.value.scrollTop = msgContainer.value.scrollHeight
  } catch (e) {
    chat.value.push({ role: 'assistant', content: '出错了，请稍后重试。' })
  }
  loading.value = false
  input.value = ''
}
</script>

<style scoped>
.chat-container {
  width: 600px;
  margin: 20px auto;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  height: 600px;
}
.chat-header {
  background: #2e8b57;
  color: white;
  padding: 10px;
  text-align: center;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #f9f9f9;
}
.message {
  margin-bottom: 10px;
}
.message.user .message-content {
  background: #0084ff;
  color: white;
  padding: 8px;
  border-radius: 10px;
  max-width: 70%;
  align-self: flex-end;
}
.message.assistant .message-content {
  background: #e5e5ea;
  color: black;
  padding: 8px;
  border-radius: 10px;
  max-width: 70%;
  align-self: flex-start;
}
.chat-input {
  display: flex;
  padding: 10px;
  background: #eee;
}
textarea {
  flex: 1;
  resize: none;
  height: 50px;
  padding: 8px;
}
button {
  width: 80px;
  margin-left: 10px;
}
</style>
