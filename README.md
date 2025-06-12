# 🐕 Aventuras Românticas do Snoopy 💛

Um jogo romântico criado especialmente para  Mendes.

## 🎮 Como Jogar

- Use as setas ← → para mover o Snoopy
- Pressione ESPAÇO para pular
- Colete todas as rosas brancas para completar cada fase
- Encontre o Woodstock na fase final!

## 🚀 Deploy no Vercel

Para fazer deploy no Vercel:

1. **Estrutura dos arquivos:**
   ```
   /
   ├── index.html      # Página principal
   ├── styles.css      # Estilos do jogo
   ├── game.js         # Lógica do jogo
   ├── vercel.json     # Configuração do Vercel
   └── package.json    # Configurações do projeto
   ```

2. **Configuração no Vercel:**
   - Conecte seu repositório GitHub ao Vercel
   - O arquivo `vercel.json` já está configurado para site estático
   - O deploy será automático

3. **Comandos úteis:**
   ```bash
   # Testar localmente
   npx serve .
   
   # Deploy manual (se necessário)
   vercel --prod
   ```

## 🛠️ Solução de Problemas

### Erros comuns do Vercel:

- **FUNCTION_PAYLOAD_TOO_LARGE**: Arquivos muito grandes foram divididos
- **DEPLOYMENT_NOT_FOUND**: Verifique se o `vercel.json` está correto
- **BUILD_FAILED**: Este é um site estático, não precisa de build

### Arquivos otimizados:

- HTML: ~1KB (vs 54KB original)
- CSS: ~3KB (separado do HTML)
- JS: ~2KB (versão simplificada)

## 💕 Sobre o Jogo

Este jogo foi criado com amor para  Mendes, combinando a nostalgia do Snoopy com uma aventura romântica especial.

**Características:**
- 3 fases progressivas
- Carta de amor especial na fase final
- Poema personalizado
- Controles simples e intuitivos

---

*Feito com 💛 por Gustavo Gostosão* 