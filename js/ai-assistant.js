/* =========================================================
   AI ASSISTANT
   ========================================================= */

const AI_ENDPOINT = 'api/chat';

const AIAssistant = {
  messages: [],
  dataContext: null,

  init(dataContext) {
    this.dataContext = dataContext;
    this.messages = [];

    const assistant = document.getElementById('ai-assistant');
    const header = document.getElementById('ai-header');
    const sendBtn = document.getElementById('ai-send');
    const input = document.getElementById('ai-input');

    header.addEventListener('click', (e) => {
      if (e.target.closest('#ai-input-row')) return;
      assistant.classList.toggle('collapsed');
    });

    sendBtn.addEventListener('click', () => this.send());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.send();
    });
  },

  updateContext(dataContext) {
    this.dataContext = dataContext;
  },

  async send() {
    const input = document.getElementById('ai-input');
    const question = input.value.trim();
    if (!question) return;
    input.value = '';
    this.appendMessage(question, 'user');
    this.appendMessage('Sedang berpikir...', 'ai', true);
    document.getElementById('ai-send').disabled = true;

    try {
      const messages = [
        ...this.messages.slice(-10),
        { role: 'user', content: question }
      ];
      const res = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          context: this.dataContext
        })
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || `Layanan AI gagal (HTTP ${res.status}).`);
      }

      const result = await res.json();
      const answer = result.answer;
      if (typeof answer !== 'string' || !answer.trim()) {
        throw new Error('Layanan AI mengirim jawaban kosong.');
      }
      this.messages = [...messages, { role: 'assistant', content: answer }];
      this.replaceLastLoading(answer);

    } catch (e) {
      console.error(e);
      const message = e instanceof TypeError
        ? 'server chatbot tidak terhubung. Jalankan npm start dan buka http://localhost:3000/map.html.'
        : e.message;
      this.replaceLastLoading('Maaf, ' + message);
    } finally {
      document.getElementById('ai-send').disabled = false;
    }
  },

  appendMessage(text, from, isLoading) {
    const box = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.className = 'ai-msg ai-msg-' + (from === 'user' ? 'user' : 'ai') +
                    (isLoading ? ' loading' : '');
    div.textContent = text;
    div.style.whiteSpace = 'pre-wrap';
    if (isLoading) div.dataset.loading = 'true';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  },

  replaceLastLoading(text) {
    const box = document.getElementById('ai-messages');
    const loading = box.querySelector('.ai-msg-ai.loading');
    if (loading) {
      loading.classList.remove('loading');
      delete loading.dataset.loading;
      loading.textContent = text;
      loading.style.whiteSpace = 'pre-wrap';
    } else {
      this.appendMessage(text, 'ai');
    }
  }
};

window.AIAssistant = AIAssistant;