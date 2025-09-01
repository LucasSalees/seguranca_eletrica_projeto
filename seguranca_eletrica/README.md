# Segurança Elétrica Digital

## Descrição do Projeto

Este é um projeto de extensão universitária desenvolvido para promover a segurança elétrica em comunidades de baixa renda. O site oferece uma cartilha digital interativa e um simulador de ligações seguras para ensinar sobre prevenção de acidentes elétricos e montagem segura de painéis elétricos.

## Características Principais

### 🎯 Objetivos
- Prevenir acidentes elétricos em residências
- Promover conscientização sobre segurança elétrica
- Capacitar moradores para identificar e corrigir problemas básicos
- Oferecer experiência prática através de simulação

### 📱 Tecnologias Utilizadas
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização e animações
- **JavaScript** - Interatividade e funcionalidades
- **Bootstrap 5** - Framework responsivo
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia

### 🎨 Design
- **Inspiração**: Site Tokyo011.com.br (estética vibrante adaptada)
- **Paleta de cores**: Azul elétrico, amarelo alerta, verde segurança
- **Abordagem**: Mobile-first design
- **Acessibilidade**: Alto contraste e suporte a leitores de tela

## Estrutura do Projeto

```
seguranca_eletrica/
├── index.html              # Página principal
├── css/
│   ├── style.css           # Estilos principais
│   ├── module.css          # Estilos dos módulos
│   └── simulator.css       # Estilos do simulador
├── js/
│   ├── main.js            # JavaScript principal
│   ├── module.js          # Funcionalidades dos módulos
│   └── simulator.js       # Lógica do simulador
├── pages/
│   ├── introducao.html    # Módulo de introdução
│   └── simulador.html     # Simulador interativo
├── images/                # Recursos visuais
└── README.md             # Documentação
```

## Funcionalidades

### 1. Cartilha Digital Interativa
- **Módulos educativos**:
  - Introdução à Segurança Elétrica
  - Identificação de Riscos
  - Montagem Segura de Painéis
  - Manutenção Preventiva
- **Recursos**:
  - Conteúdo visual e interativo
  - Quiz no final de cada módulo
  - Sistema de progresso
  - Certificado digital

### 2. Simulador de Ligações Seguras
- **Funcionalidades**:
  - Sistema drag-and-drop
  - 3 níveis de dificuldade
  - Feedback visual (verde/vermelho)
  - Sistema de pontuação
  - Timer e estatísticas
- **Componentes**:
  - Disjuntores e DR
  - Fios (fase, neutro, terra)
  - Tomadas e lâmpadas
  - Conexões de aterramento

### 3. Recursos Adicionais
- Design responsivo (mobile-first)
- Suporte a touch em dispositivos móveis
- Animações CSS suaves
- Sistema de notificações
- Armazenamento local de progresso

## Responsividade

O projeto foi desenvolvido com abordagem mobile-first:

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Otimizações Mobile
- Navegação colapsável
- Botões touch-friendly (mínimo 44px)
- Layouts em coluna única
- Simulador adaptado para touch
- Imagens otimizadas

## Como Usar

### 1. Navegação Principal
- **Início**: Visão geral do projeto
- **Cartilha Digital**: Módulos educativos
- **Simulador**: Prática interativa
- **Sobre**: Informações do projeto

### 2. Cartilha Digital
1. Clique em um módulo para começar
2. Leia o conteúdo e interaja com os elementos
3. Complete o quiz no final
4. Avance para o próximo módulo

### 3. Simulador
1. Escolha o nível de dificuldade
2. Arraste componentes para o painel
3. Conecte os fios corretamente
4. Clique em "Verificar" para avaliar
5. Receba feedback e pontuação

## Instalação e Execução

### Requisitos
- Navegador web moderno
- Servidor web local (opcional)

### Execução Local
1. Clone ou baixe o projeto
2. Abra `index.html` no navegador
3. Ou use um servidor local:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve .
   ```

## Compatibilidade

### Navegadores Suportados
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Dispositivos
- Desktop (Windows, macOS, Linux)
- Tablets (iOS, Android)
- Smartphones (iOS, Android)

## Acessibilidade

### Recursos Implementados
- Navegação por teclado
- Suporte a leitores de tela
- Alto contraste
- Textos alternativos em imagens
- Foco visível em elementos interativos

### Padrões Seguidos
- WCAG 2.1 AA
- Semântica HTML5
- ARIA labels quando necessário

## Performance

### Otimizações
- CSS e JavaScript minificados
- Imagens otimizadas
- Lazy loading de conteúdo
- Cache de recursos estáticos
- Animações otimizadas

### Métricas
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Cumulative Layout Shift: < 0.1

## Segurança

### Medidas Implementadas
- Validação de entrada do usuário
- Sanitização de dados
- CSP (Content Security Policy)
- HTTPS recomendado para produção

## Contribuição

### Como Contribuir
1. Fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Padrões de Código
- Indentação: 4 espaços
- Nomenclatura: camelCase (JS), kebab-case (CSS)
- Comentários em português
- Código limpo e documentado

## Licença

Este projeto é desenvolvido para fins educacionais como parte de um projeto de extensão universitária da UNIP.

## Contato

**Projeto de Extensão - UNIP**
- Curso: Ciência da Computação
- Tema: Segurança Elétrica em Comunidades de Baixa Renda

## Changelog

### v1.0.0 (2025-09-01)
- ✅ Página principal responsiva
- ✅ Cartilha digital interativa
- ✅ Simulador drag-and-drop
- ✅ Sistema de progresso
- ✅ Quiz educativo
- ✅ Design mobile-first
- ✅ Acessibilidade básica

### Próximas Versões
- [ ] Módulos adicionais da cartilha
- [ ] Níveis avançados do simulador
- [ ] Sistema de certificados
- [ ] Modo offline
- [ ] Multilíngue

## Agradecimentos

- Inspiração de design: Tokyo011.com.br
- Ícones: Font Awesome
- Framework: Bootstrap
- Fontes: Google Fonts
- Comunidade: Desenvolvedores open source

