class RunOnServerTools {
  constructor() {
    this.openDialogs = [];
  }

  async run(env) {
      if (!env || !env.container) {
        throw new Error("[RunOnServerTools] run() requires an environment object with a valid container.");
      }
      this.env = env;
      const target = env.container;
      target.innerHTML = '';

      if (typeof DomBasics !== 'undefined' && DomBasics.run) {
        DomBasics.run();
      }

      applyCss(`
        .rost-container {
          padding: 20px;
          background: #0d1117;
          color: #c9d1d9;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .rost-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #30363d;
          padding-bottom: 14px;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .rost-title {
          color: #00f2fe;
          font-size: 1.35rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rost-subtitle {
          color: #8b949e;
          font-size: 0.82rem;
          margin-top: 4px;
          line-height: 1.4;
        }
        .rost-instructions-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }
        .rost-instruct-card {
          background: #161b22;
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.4);
        }
        .rost-instruct-card.llm-card {
          border: 2px solid #e3b341;
          background: linear-gradient(135deg, #1f1a05 0%, #161b22 100%);
        }
        .rost-instruct-card.user-card {
          border: 2px solid #238636;
          background: linear-gradient(135deg, #0d2818 0%, #161b22 100%);
        }
        .rost-instruct-title {
          font-size: 0.95rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rost-instruct-content {
          font-size: 0.78rem;
          line-height: 1.5;
          color: #c9d1d9;
        }
        .rost-instruct-content p {
          margin: 0 0 8px 0;
        }
        .rost-code-snippet {
          background: #070a13;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 8px 10px;
          color: #7ee787;
          font-family: monospace;
          font-size: 0.75rem;
          white-space: pre-wrap;
          word-break: break-all;
          margin: 6px 0;
        }
        .rost-badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
          font-family: monospace;
        }
        .rost-badge-gold { background: #3d2f00; color: #f0e68c; border: 1px solid #e3b341; }
        .rost-badge-green { background: #0d2818; color: #7ee787; border: 1px solid #238636; }
        .rost-tool-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        .rost-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 10px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .rost-card:hover {
          border-color: #00f2fe;
          transform: translateY(-2px);
        }
        .rost-card h3 {
          color: #00f2fe;
          font-size: 0.95rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rost-card p {
          font-size: 0.76rem;
          color: #8b949e;
          margin: 0;
          line-height: 1.4;
        }
        .rost-btn {
          padding: 8px 14px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-family: monospace;
          font-size: 0.78rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: filter 0.15s ease;
        }
        .rost-btn:hover { filter: brightness(1.15); }
        .rost-btn-primary { background: #238636; color: #fff; }
        .rost-btn-server { background: #b58105; color: #fff; }
        .rost-btn-client { background: #003847; color: #00f2fe; border: 1px solid #00f2fe; }
        .rost-btn-purple { background: #8257e5; color: #fff; }
        .rost-output-pane {
          background: #070a13;
          border: 1px solid #1e293b;
          border-radius: 8px;
          padding: 12px;
          font-family: monospace;
          font-size: 0.78rem;
          color: #7ee787;
          white-space: pre-wrap;
          word-break: break-all;
          max-height: 240px;
          overflow-y: auto;
        }
        .rost-status-bar {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.75rem;
          color: #8b949e;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
      `, 'runOnServerTools-styles');

      target.classList.add('rost-container');

      // Header
      const header = makeElement('div', { className: 'rost-header' },
        makeElement('div', {},
          makeElement('h1', { className: 'rost-title' }, '⚡ RunOnServerTools'),
          makeElement('div', { className: 'rost-subtitle' },
            'Server execution launchpad & scratchpad. Use this clean project when asking an LLM to run backend commands, install packages, or inspect local disks.'
          )
        ),
        makeElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } },
          makeElement('button', {
            className: 'rost-btn rost-btn-server',
            onclick: () => this.copyLlmDirective()
          }, '📋 Copy LLM Directive'),
          makeElement('button', {
            className: 'rost-btn rost-btn-purple',
            onclick: () => this.sendLlmDirectiveToOutbox()
          }, '📤 Send Directive to Outbox')
        )
      );

      // Two Explicit Instructions Cards
      const instructionsRow = makeElement('div', { className: 'rost-instructions-row' },
        // Card 1: AI / LLM Instructions
        makeElement('div', { className: 'rost-instruct-card llm-card' },
          makeElement('div', { className: 'rost-instruct-title', style: { color: '#f0e68c' } },
            '🤖 INSTRUCTIONS FOR THE AI / LLM',
            makeElement('span', { className: 'rost-badge rost-badge-gold' }, 'BYPASS UI')
          ),
          makeElement('div', { className: 'rost-instruct-content' },
            makeElement('p', {},
              makeElement('strong', { style: { color: '#ffec8b' } }, 'You do not need to build or modify any web UI: '),
              'When the user asks you to run server tasks (such as installing npm packages, running git commands, searching directories, or running diagnostic checks), ',
              makeElement('strong', { style: { color: '#ffffff' } }, 'do not write or rewrite HTML, CSS, or UI classes.'),
              ' Simply respond with a privileged server container:'
            ),
            makeElement('pre', { className: 'rost-code-snippet' },
              '<script data-file="RUN: SERVER" data-action="run-server">\n' +
              'const { execSync } = require("child_process");\n' +
              'const out = execSync("npm install package_name", { encoding: "utf8" });\n' +
              'return out;\n' +
              '</' + 'script>'
            ),
            makeElement('p', {},
              'When the user pastes your response into Luno, Luno\'s backend executes the script immediately in Node.js and surfaces stdout and return values directly on the Luno Home page in the Output & Feedback card.'
            ),
            makeElement('p', {},
              'If you need live JavaScript execution in the browser instead of the server, emit: ',
              makeElement('code', { style: { color: '#00f2fe' } }, '<script data-file="RUN: CLIENT" data-action="run-client">')
            )
          )
        ),

        // Card 2: User Instructions
        makeElement('div', { className: 'rost-instruct-card user-card' },
          makeElement('div', { className: 'rost-instruct-title', style: { color: '#7ee787' } },
            '👤 INSTRUCTIONS FOR THE USER',
            makeElement('span', { className: 'rost-badge rost-badge-green' }, 'UNIVERSAL COMMANDS')
          ),
          makeElement('div', { className: 'rost-instruct-content' },
            makeElement('p', {},
              makeElement('strong', { style: { color: '#ffffff' } }, 'Universal Protocol: '),
              'Both ',
              makeElement('code', { style: { color: '#ffec8b' } }, 'RUN: SERVER'),
              ' and ',
              makeElement('code', { style: { color: '#00f2fe' } }, 'RUN: CLIENT'),
              ' work across ',
              makeElement('strong', { style: { color: '#7ee787' } }, 'EVERY project in Luno'),
              '! You do not have to switch to this app for server execution to work. If you are already working inside another app (e.g. Basic3D, MathStorm, or Calculator), server scripts run there just as easily.'
            ),
            makeElement('p', {},
              makeElement('strong', { style: { color: '#ffffff' } }, 'Why use RunOnServerTools? '),
              'This project is a dedicated, neutral launchpad when you just want to run server commands or test scripts with an LLM without touching or cluttering your actual application code.'
            ),
            makeElement('p', {},
              makeElement('strong', { style: { color: '#ffffff' } }, 'Where results appear: '),
              'When you paste the LLM\'s reply into Luno via "Paste from Chatbot", the server output appears on the ',
              makeElement('strong', { style: { color: '#00f2fe' } }, 'Luno Home page'),
              ' inside the glowing Output & Execution Feedback card. You do not even need this preview window open!'
            ),
            makeElement('p', {},
              'The buttons and scratchpad below are optional helpers for manual in-page testing.'
            )
          )
        )
      );

      // Optional Quick Test Tools
      const toolGrid = makeElement('div', { className: 'rost-tool-grid' },
        makeElement('div', { className: 'rost-card' },
          makeElement('h3', {}, '⚡ In-Page Server Console'),
          makeElement('p', {}, 'Manually draft and test Node.js code with fs, child_process, and path access on the host.'),
          makeElement('button', {
            className: 'rost-btn rost-btn-server',
            style: { marginTop: 'auto' },
            onclick: () => this.openServerConsole()
          }, 'Open Server Console')
        ),
        makeElement('div', { className: 'rost-card' },
          makeElement('h3', {}, '🔍 Codebase Grep & Search'),
          makeElement('p', {}, 'Search for regex patterns or text occurrences across project files on the server.'),
          makeElement('button', {
            className: 'rost-btn rost-btn-primary',
            style: { marginTop: 'auto' },
            onclick: () => this.openSearchGrep()
          }, 'Open Grep Tool')
        ),
        makeElement('div', { className: 'rost-card' },
          makeElement('h3', {}, '🖥️ Live Client Runner'),
          makeElement('p', {}, 'Test client-side JavaScript in the browser context with DOM, UITools, and window access.'),
          makeElement('button', {
            className: 'rost-btn rost-btn-client',
            style: { marginTop: 'auto' },
            onclick: () => this.openClientConsole()
          }, 'Open Client Console')
        ),
        makeElement('div', { className: 'rost-card' },
          makeElement('h3', {}, '🩺 Server Diagnostics'),
          makeElement('p', {}, 'Quick inspection of OS, memory usage, Node version, and working directories.'),
          makeElement('button', {
            className: 'rost-btn rost-btn-purple',
            style: { marginTop: 'auto' },
            onclick: () => this.openSystemDiagnostics()
          }, 'Run Diagnostics')
        )
      );

      // In-Page Scratchpad Output
      this.outputSection = makeElement('div', {
        style: {
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }
      },
        makeElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' } },
          makeElement('div', {},
            makeElement('strong', { style: { color: '#00f2fe', fontSize: '0.85rem' } }, '🧪 Optional In-Page Scratchpad Test Output:'),
            makeElement('span', { style: { color: '#8b949e', fontSize: '0.72rem', marginLeft: '6px' } }, '(Chatbot pastes output to Luno Home page)')
          ),
          makeElement('div', { style: { display: 'flex', gap: '6px' } },
            makeElement('button', {
              className: 'rost-btn rost-btn-purple',
              style: { padding: '4px 10px', fontSize: '0.72rem' },
              onclick: () => this.sendOutputToOutbox()
            }, '📤 Send to Outbox'),
            makeElement('button', {
              className: 'rost-btn rost-btn-client',
              style: { padding: '4px 10px', fontSize: '0.72rem' },
              onclick: () => this.copyOutputToClipboard()
            }, '📋 Copy Output')
          )
        ),
        this.outputPre = makeElement('pre', { className: 'rost-output-pane' },
          'Ready. (Note: When you paste chatbot responses into Luno, results appear on Luno\'s main Home page in the Output & Feedback card. This box only displays results from the manual buttons above.)'
        )
      );

      // Status Footer
      const statusBar = makeElement('div', { className: 'rost-status-bar' },
        makeElement('span', {}, 'Target: [RunOnServerTools] • Mode: Privileged Node.js Server Sandbox'),
        this.statusDisplay = makeElement('span', { style: { color: '#3fb950', fontWeight: 'bold' } }, 'Ready')
      );

      target.appendChild(header);
      target.appendChild(instructionsRow);
      target.appendChild(toolGrid);
      target.appendChild(this.outputSection);
      target.appendChild(statusBar);

      this._handleResize = () => {
        if (this.statusDisplay) {
          this.statusDisplay.textContent = `Viewport: ${window.innerWidth}x${window.innerHeight}px`;
        }
      };
      window.addEventListener('resize', this._handleResize);
  }
  async executeServerScript(scriptCode, project = 'RunOnServerTools') {
    this.statusDisplay.textContent = '⚡ Running on server...';
    try {
      const res = await fetch(`/api/save?project=${encodeURIComponent(project)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: [],
          serverScript: scriptCode,
          project: project
        })
      });
      const data = await res.json();
      const output = (data && data.llmFeedback) || JSON.stringify(data, null, 2);
      this.outputPre.textContent = output;
      this.statusDisplay.textContent = data.success ? '✅ Server execution succeeded' : '❌ Server execution returned error';
      return { success: data.success, output };
    } catch (err) {
      const errText = `❌ Server Request Failed: ${err.message}`;
      this.outputPre.textContent = errText;
      this.statusDisplay.textContent = '❌ Server error';
      return { success: false, output: errText };
    }
  }

  async executeClientScript(scriptCode) {
    this.statusDisplay.textContent = '🖥️ Running on client...';
    try {
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const clientFn = new AsyncFunction('UITools', 'RunOnServerTools', 'app', scriptCode);
      const res = await clientFn(globalThis.UITools, this, this);
      const formatted = typeof res === 'object' ? JSON.stringify(res, null, 2) : String(res);
      const output = `🖥️ CLIENT EXECUTION RESULT:\n${formatted !== 'undefined' ? formatted : 'Executed successfully with no return value.'}`;
      this.outputPre.textContent = output;
      this.statusDisplay.textContent = '✅ Client execution succeeded';
      return { success: true, output };
    } catch (err) {
      const errText = `❌ Client Script Error:\n${err.stack || err.message}`;
      this.outputPre.textContent = errText;
      this.statusDisplay.textContent = '❌ Client script error';
      return { success: false, output: errText };
    }
  }

  openServerConsole() {
    const defaultScript = [
      '// Server-side script with Node.js fs, path, process access:',
      'const fs = require("fs");',
      'const path = require("path");',
      '',
      'const webRoot = LunoServer.getWebRootDir();',
      'const projects = fs.readdirSync(webRoot).filter(p => !p.startsWith(".") && fs.statSync(path.join(webRoot, p)).isDirectory());',
      '',
      'return {',
      '  platform: process.platform,',
      '  nodeVersion: process.version,',
      '  webRootDir: webRoot,',
      '  discoveredProjectsCount: projects.length,',
      '  projects: projects.slice(0, 10)',
      '};'
    ].join('\n');

    const wrapper = makeElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' } });

    const recipeSelect = makeElement('select', {
      style: {
        background: '#0d1117',
        color: '#00f2fe',
        border: '1px solid #30363d',
        padding: '6px',
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '0.8rem'
      },
      onchange: (e) => {
        const val = e.target.value;
        if (val === 'info') textarea.value = defaultScript;
        else if (val === 'git') {
          textarea.value = 'const { execSync } = require("child_process");\nreturn {\n  branch: execSync("git branch --show-current", { encoding: "utf8" }).trim(),\n  status: execSync("git status --short", { encoding: "utf8" }).trim()\n};';
        } else if (val === 'files') {
          textarea.value = 'const fs = require("fs");\nconst path = require("path");\nconst files = fs.readdirSync(process.cwd());\nreturn { cwd: process.cwd(), files: files.slice(0, 20) };';
        }
      }
    },
      makeElement('option', { value: 'info' }, '📋 Template: Platform & Projects Info'),
      makeElement('option', { value: 'git' }, '🐙 Template: Git Status & Branch'),
      makeElement('option', { value: 'files' }, '📁 Template: Current Directory Files')
    );

    const textarea = makeElement('textarea', {
      style: {
        width: '100%',
        minHeight: '160px',
        flex: 1,
        background: '#070a13',
        color: '#7ee787',
        border: '1px solid #30363d',
        borderRadius: '6px',
        padding: '8px',
        fontFamily: 'monospace',
        fontSize: '0.8rem',
        resize: 'vertical',
        boxSizing: 'border-box'
      },
      value: defaultScript
    });

    const btnRun = makeElement('button', {
      className: 'rost-btn rost-btn-server',
      onclick: async () => {
        btnRun.textContent = 'Running...';
        btnRun.disabled = true;
        await this.executeServerScript(textarea.value);
        btnRun.textContent = '⚡ Run on Server';
        btnRun.disabled = false;
      }
    }, '⚡ Run on Server');

    const btnCopyContainer = makeElement('button', {
      className: 'rost-btn rost-btn-client',
      onclick: () => {
        const tag = `<` + `script data-file="RUN: SERVER" data-action="run-server">\n${textarea.value}\n<` + `/script>`;
        if (navigator.clipboard) navigator.clipboard.writeText(tag);
        alert('Copied <script data-file="RUN: SERVER"> container tag to clipboard!');
      }
    }, '📋 Copy as Protocol Container');

    wrapper.appendChild(recipeSelect);
    wrapper.appendChild(textarea);
    wrapper.appendChild(makeElement('div', { style: { display: 'flex', gap: '8px' } }, btnRun, btnCopyContainer));

    const dlg = UITools.makeDialog({
      title: '⚡ Server Script Console (RUN: SERVER)',
      size: [560, 380],
      position: [40, 60],
      contentElement: wrapper
    });
    this.openDialogs.push(dlg);
  }

  openSearchGrep() {
    const wrapper = makeElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } });

    const queryInput = makeElement('input', {
      type: 'text',
      placeholder: 'Search term or regex pattern (e.g. UITools, function\\s+\\w+)...',
      value: 'UITools',
      style: {
        background: '#0d1117',
        color: '#00f2fe',
        border: '1px solid #00f2fe',
        padding: '8px',
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '0.82rem'
      }
    });

    const projInput = makeElement('input', {
      type: 'text',
      placeholder: 'Project folder or blank for workspace (e.g. RunOnServerTools, Luno)...',
      value: 'RunOnServerTools',
      style: {
        background: '#0d1117',
        color: '#7ee787',
        border: '1px solid #30363d',
        padding: '6px',
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '0.8rem'
      }
    });

    const btnExec = makeElement('button', {
      className: 'rost-btn rost-btn-primary',
      onclick: async () => {
        const query = queryInput.value.trim();
        const targetProj = projInput.value.trim() || 'RunOnServerTools';
        if (!query) return;

        btnExec.textContent = 'Searching...';
        btnExec.disabled = true;

        const grepScript = `
          const fs = require("fs");
          const path = require("path");
          const query = ${JSON.stringify(query)};
          const proj = ${JSON.stringify(targetProj)};
          const targetDir = LunoServer.resolveProjectBaseDir(proj);

          let matches = [];
          function searchDir(dir) {
            if (!fs.existsSync(dir)) return;
            const items = fs.readdirSync(dir);
            for (const it of items) {
              if (it.startsWith(".") || it === "node_modules") continue;
              const fullP = path.join(dir, it);
              const stat = fs.statSync(fullP);
              if (stat.isDirectory()) {
                searchDir(fullP);
              } else if (/\\.(js|mjs|json|html|css|md|txt)$/i.test(it)) {
                try {
                  const content = fs.readFileSync(fullP, "utf8");
                  const lines = content.split("\\n");
                  lines.forEach((line, idx) => {
                    if (line.includes(query)) {
                      matches.push({
                        file: path.relative(targetDir, fullP).replace(/\\\\/g, "/"),
                        line: idx + 1,
                        text: line.trim().slice(0, 100)
                      });
                    }
                  });
                } catch(e) {}
              }
            }
          }
          searchDir(targetDir);
          return {
            query: query,
            project: proj,
            matchCount: matches.length,
            matches: matches.slice(0, 50)
          };
        `;

        await this.executeServerScript(grepScript, targetProj);
        btnExec.textContent = '🔍 Run Codebase Grep';
        btnExec.disabled = false;
      }
    }, '🔍 Run Codebase Grep');

    wrapper.appendChild(makeElement('label', { style: { fontSize: '0.75rem', color: '#8b949e' } }, 'Search Query:'));
    wrapper.appendChild(queryInput);
    wrapper.appendChild(makeElement('label', { style: { fontSize: '0.75rem', color: '#8b949e' } }, 'Target Project Directory:'));
    wrapper.appendChild(projInput);
    wrapper.appendChild(btnExec);

    const dlg = UITools.makeDialog({
      title: '🔍 Server Codebase Grep',
      size: [480, 260],
      position: [80, 100],
      contentElement: wrapper
    });
    this.openDialogs.push(dlg);
  }

  openClientConsole() {
    const defaultClient = [
      '// Client-side JavaScript running in browser context:',
      'console.log("Hello from Client Runner!");',
      '',
      'return {',
      '  href: window.location.href,',
      '  userAgent: navigator.userAgent,',
      '  openDialogsCount: UITools.allWidgets.length,',
      '  activeWidgets: UITools.activeCount',
      '};'
    ].join('\n');

    const wrapper = makeElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } });

    const textarea = makeElement('textarea', {
      style: {
        width: '100%',
        minHeight: '140px',
        background: '#070a13',
        color: '#00f2fe',
        border: '1px solid #00f2fe',
        borderRadius: '6px',
        padding: '8px',
        fontFamily: 'monospace',
        fontSize: '0.8rem',
        boxSizing: 'border-box'
      },
      value: defaultClient
    });

    const btnRun = makeElement('button', {
      className: 'rost-btn rost-btn-client',
      onclick: async () => {
        await this.executeClientScript(textarea.value);
      }
    }, '🖥️ Run on Client');

    const btnCopy = makeElement('button', {
      className: 'rost-btn rost-btn-purple',
      onclick: () => {
        const tag = `<` + `script data-file="RUN: CLIENT" data-action="run-client">\n${textarea.value}\n<` + `/script>`;
        if (navigator.clipboard) navigator.clipboard.writeText(tag);
        alert('Copied <script data-file="RUN: CLIENT"> container tag to clipboard!');
      }
    }, '📋 Copy as Protocol Container');

    wrapper.appendChild(textarea);
    wrapper.appendChild(makeElement('div', { style: { display: 'flex', gap: '8px' } }, btnRun, btnCopy));

    const dlg = UITools.makeDialog({
      title: '🖥️ Client Script Runner (RUN: CLIENT)',
      size: [520, 300],
      position: [120, 140],
      contentElement: wrapper
    });
    this.openDialogs.push(dlg);
  }

  async openSystemDiagnostics() {
    const script = [
      'const os = require("os");',
      'const process = require("process");',
      'return {',
      '  platform: os.platform(),',
      '  arch: os.arch(),',
      '  release: os.release(),',
      '  uptimeSec: Math.round(process.uptime()),',
      '  nodeVersion: process.version,',
      '  memoryUsage: {',
      '    rssMB: (process.memoryUsage().rss / 1024 / 1024).toFixed(1),',
      '    heapTotalMB: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(1),',
      '    heapUsedMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)',
      '  }',
      '};'
    ].join('\n');

    await this.executeServerScript(script, 'RunOnServerTools');
  }

  sendOutputToOutbox() {
    const text = this.outputPre.textContent;
    if (!text || text.startsWith('Ready')) {
      alert('Output is empty.');
      return;
    }
    if (typeof OutboxQueue !== 'undefined' && OutboxQueue.addBundle) {
      OutboxQueue.addBundle('Server Tools Output', text, { priority: 'high' });
      alert('Output sent to Outbox queue!');
    } else {
      this.copyOutputToClipboard();
    }
  }

  copyOutputToClipboard() {
    const text = this.outputPre.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Copied tool output to clipboard!');
    }
  }

  destroy() {
    if (this._handleResize) {
      window.removeEventListener('resize', this._handleResize);
    }
    if (this.openDialogs) {
      this.openDialogs.forEach(d => {
        try { d.close(); } catch(e){}
      });
      this.openDialogs = [];
    }
  }

  getLlmDirectiveText() {
      const scr = 'scr' + 'ipt';
      return [
        '================================================================================',
        '⚡ SERVER & CLIENT SCRIPT DIRECTIVE: DIRECT EXECUTION VIA LUNO PROTOCOL',
        '================================================================================',
        'DEAR AI/LLM: The user has selected [RunOnServerTools] as an execution launchpad.',
        '',
        'CRITICAL EXECUTION RULES FOR THIS SESSION:',
        '1. BYPASS WEB UI: You do NOT need to write, patch, or modify HTML, CSS, or UI',
        '   methods unless the user specifically asks for front-end interface changes.',
        '',
        '2. DIRECT SERVER EXECUTION (RUN: SERVER):',
        '   When the user asks you to run a server command (such as installing npm packages,',
        '   running git scripts, searching or renaming files, or running shell commands), emit:',
        '',
        '<' + scr + ' data-file="RUN: SERVER" data-action="run-server">',
        'const fs = require("fs");',
        'const path = require("path");',
        'const { execSync } = require("child_process");',
        '',
        '// Run command or Node.js code with full server process access:',
        'const out = execSync("npm list --depth=0", { encoding: "utf8" });',
        'return out;',
        '</' + scr + '>',
        '',
        '3. DIRECT CLIENT EXECUTION (RUN: CLIENT):',
        '   If you need to run live JavaScript in the user\'s browser instead of the server,',
        '   emit a client script container:',
        '',
        '<' + scr + ' data-file="RUN: CLIENT" data-action="run-client">',
        '// Browser JavaScript with window, document, DOM, and UITools access:',
        'console.log("Client execution ready");',
        'return { status: "ok" };',
        '</' + scr + '>',
        '',
        '4. UNIVERSAL LUNO COMPATIBILITY:',
        '   Note that RUN: SERVER and RUN: CLIENT are universal Luno directives that work across',
        '   ANY project in the workspace. RunOnServerTools is simply a neutral starter base.',
        '',
        '5. AUTOMATIC EXECUTION & OUTPUT:',
        '   When the user copies your response and clicks "Paste from Chatbot" in Luno Workspace,',
        '   Luno runs your script and displays the stdout and returned values directly on the',
        '   Luno Home page in the Output & Execution Feedback card.',
        '================================================================================\n'
      ].join('\n');
  }
  copyLlmDirective() {
      const directive = this.getLlmDirectiveText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(directive).then(() => {
          alert('Copied Server Execution Directive to clipboard! You can paste this to your LLM to start.');
        });
      } else {
        prompt('Copy Server Execution Directive:', directive);
      }
  }

  sendLlmDirectiveToOutbox() {
      const directive = this.getLlmDirectiveText();
      if (typeof OutboxQueue !== 'undefined' && OutboxQueue.addBundle) {
        OutboxQueue.addBundle('Server Execution Directive', directive, { priority: 'high' });
        alert('Sent Server Execution Directive directly to Outbox!');
      } else {
        this.copyLlmDirective();
      }
  }
}

globalThis.RunOnServerTools = RunOnServerTools;
if (typeof module !== 'undefined' && module.exports) module.exports = RunOnServerTools;