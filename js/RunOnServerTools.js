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
          .rost-instruct-card.linux-card {
            border: 2px solid #00f2fe;
            background: linear-gradient(135deg, #002233 0%, #161b22 100%);
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
          .rost-badge-cyan { background: #003847; color: #00f2fe; border: 1px solid #00f2fe; }
          .rost-badge-gold { background: #3d2f00; color: #f0e68c; border: 1px solid #e3b341; }
          .rost-badge-green { background: #0d2818; color: #7ee787; border: 1px solid #238636; }
          .rost-tool-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
              'Server execution launchpad, remote Ubuntu setup & command supervisor.'
            )
          ),
          makeElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } },
            makeElement('button', {
              className: 'rost-btn rost-btn-client',
              onclick: () => this.openLinuxSetupTool()
            }, '🐧 Setup Ubuntu Machine (1-Tap)'),
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

        // Instructions Row: Linux Setup + AI Protocol + User Protocol
        const instructionsRow = makeElement('div', { className: 'rost-instructions-row' },
          // Card 1: Linux Remote Setup
          makeElement('div', { className: 'rost-instruct-card linux-card' },
            makeElement('div', { className: 'rost-instruct-title', style: { color: '#00f2fe' } },
              '🐧 UBUNTU LINUX AUTOMATED PROVISIONING',
              makeElement('span', { className: 'rost-badge rost-badge-cyan' }, 'ZERO-TYPING')
            ),
            makeElement('div', { className: 'rost-instruct-content' },
              makeElement('p', {},
                makeElement('strong', { style: { color: '#ffffff' } }, '1 single paste on Ubuntu does everything: '),
                'Open the terminal on your fresh Ubuntu machine and paste this one command. It will install Git, Node 22 LTS, OpenSSH server, clone all repos, and launch Luno:'
              ),
              makeElement('pre', {
                id: 'rost-linux-oneliner-display',
                className: 'rost-code-snippet',
                style: { color: '#00f2fe', cursor: 'pointer' },
                title: 'Click to copy 1-liner',
                onclick: () => this.copyLinuxOneLiner()
              }, 'curl -sSL http://' + (window.location.hostname || 'localhost') + ':8080/setup-linux.sh | bash'),
              makeElement('div', { style: { display: 'flex', gap: '8px', marginTop: '6px' } },
                makeElement('button', {
                  className: 'rost-btn rost-btn-client',
                  style: { padding: '4px 10px', fontSize: '0.72rem' },
                  onclick: () => this.copyLinuxOneLiner()
                }, '📋 Copy Ubuntu 1-Liner'),
                makeElement('button', {
                  className: 'rost-btn rost-btn-purple',
                  style: { padding: '4px 10px', fontSize: '0.72rem' },
                  onclick: () => this.openLinuxSetupTool()
                }, '🔍 Test Linux Bridge')
              )
            )
          ),

          // Card 2: AI / LLM Instructions
          makeElement('div', { className: 'rost-instruct-card llm-card' },
            makeElement('div', { className: 'rost-instruct-title', style: { color: '#f0e68c' } },
              '🤖 INSTRUCTIONS FOR THE AI / LLM',
              makeElement('span', { className: 'rost-badge rost-badge-gold' }, 'BYPASS UI')
            ),
            makeElement('div', { className: 'rost-instruct-content' },
              makeElement('p', {},
                makeElement('strong', { style: { color: '#ffec8b' } }, 'Bypass all front-end UI: '),
                'When the user asks you to run server tasks (installing npm packages, running git commands, searching directories, or running diagnostic checks), ',
                makeElement('strong', { style: { color: '#ffffff' } }, 'do not write or rewrite HTML, CSS, or UI classes.'),
                ' Respond with a privileged server container:'
              ),
              makeElement('pre', { className: 'rost-code-snippet' },
                '<script data-file="RUN: SERVER" data-action="run-server">\n' +
                'const { execSync } = require("child_process");\n' +
                'const out = execSync("git status", { encoding: "utf8" });\n' +
                'return out;\n' +
                '</' + 'script>'
              )
            )
          ),

          // Card 3: User Instructions
          makeElement('div', { className: 'rost-instruct-card user-card' },
            makeElement('div', { className: 'rost-instruct-title', style: { color: '#7ee787' } },
              '👤 INSTRUCTIONS FOR THE USER',
              makeElement('span', { className: 'rost-badge rost-badge-green' }, 'UNIVERSAL')
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
                '.'
              ),
              makeElement('p', {},
                makeElement('strong', { style: { color: '#ffffff' } }, 'Where results appear: '),
                'When you paste the LLM\'s reply into Luno via "Paste from Chatbot", the server output appears on the ',
                makeElement('strong', { style: { color: '#00f2fe' } }, 'Luno Home page'),
                ' in the glowing Output & Execution Feedback card.'
              )
            )
          )
        );

        // Tool Grid
        const toolGrid = makeElement('div', { className: 'rost-tool-grid' },
          makeElement('div', { className: 'rost-card' },
            makeElement('h3', {}, '🐧 Linux Remote Manager'),
            makeElement('p', {}, 'Inspect IP, test SSH connection, and run commands on the Linux machine from your Mac.'),
            makeElement('button', {
              className: 'rost-btn rost-btn-client',
              style: { marginTop: 'auto' },
              onclick: () => this.openLinuxSetupTool()
            }, 'Open Linux Bridge')
          ),
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
            'Ready.'
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

  async executeServerScript(scriptCode, project = 'RunOnServerTools', targetHost = null) {
      const host = targetHost || this.activeTargetHost || window.location.origin;
      this.statusDisplay.textContent = `⚡ Running on ${host}...`;
      try {
        const targetUrl = `${host.replace(/\/$/, '')}/api/save?project=${encodeURIComponent(project)}`;
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Luno-Client': '1' },
          body: JSON.stringify({
            files: [],
            serverScript: scriptCode,
            project: project
          })
        });
        const data = await res.json();
        const output = (data && data.llmFeedback) || JSON.stringify(data, null, 2);
        this.outputPre.textContent = `[Node: ${host}]\n${output}`;
        this.statusDisplay.textContent = data.success ? `✅ Execution on ${host} succeeded` : `❌ Execution on ${host} returned error`;
        return { success: data.success, output };
      } catch (err) {
        const errText = `❌ Request to ${host} Failed: ${err.message}`;
        this.outputPre.textContent = errText;
        this.statusDisplay.textContent = `❌ ${host} unreachable`;
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

  async openLinuxSetupTool() {
        const macHost = window.location.hostname || 'localhost';
        const macPort = window.location.port || '8080';
        const savedLinuxIp = localStorage.getItem('luno_linux_node_ip') || '';

        const wrapper = makeElement('div', {
          style: { display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', fontFamily: 'monospace' }
        });

        const infoBox = makeElement('div', {
          style: { background: '#0d1117', border: '1px solid #00f2fe', borderRadius: '6px', padding: '10px', fontSize: '0.78rem', color: '#c9d1d9', lineHeight: '1.45' }
        },
          makeElement('strong', { style: { color: '#00f2fe', display: 'block', marginBottom: '4px' } }, '🐧 Ubuntu Machine Automated Setup (USB or Network):'),
          'Method A (Network): Run the 1-liner below in Ubuntu terminal.\n' +
          'Method B (USB Stick): Click "Prepare USB Setup Script", put your LunoProjects folder on the USB drive, plug it into the Ubuntu machine, and run bash /media/$USER/*/setup_from_usb.sh.'
        );

        const targetRow = makeElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' } },
          makeElement('span', { style: { color: '#8b949e', fontWeight: 'bold' } }, 'Linux Machine IP:'),
          makeElement('input', {
            id: 'rost-linux-ip-input',
            type: 'text',
            value: savedLinuxIp,
            placeholder: 'e.g. 192.168.1.120',
            style: {
              flex: 1,
              background: '#070a13',
              color: '#7ee787',
              border: '1px solid #238636',
              borderRadius: '4px',
              padding: '4px 8px',
              fontFamily: 'monospace',
              fontSize: '0.78rem'
            },
            oninput: (e) => {
              const ip = e.target.value.trim();
              localStorage.setItem('luno_linux_node_ip', ip);
              this.activeLinuxIp = ip;
            }
          })
        );

        const cmdBox = makeElement('pre', {
          id: 'rost-linux-cmd-box',
          style: {
            background: '#070a13',
            border: '1px solid #238636',
            borderRadius: '6px',
            padding: '10px',
            color: '#7ee787',
            fontSize: '0.8rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            margin: '0'
          }
        });

        const updateCmd = (ip) => {
          const host = ip || macHost;
          cmdBox.textContent = `curl -sSL http://${host}:${macPort}/setup-linux.sh | bash`;
        };
        updateCmd(macHost !== 'localhost' && macHost !== '127.0.0.1' ? macHost : '');

        // Query server for local network IP
        try {
          const res = await fetch('/api/lan-info');
          const data = await res.json();
          if (data && data.primaryIp) {
            updateCmd(data.primaryIp);
          }
        } catch(e) {}

        const btnRow = makeElement('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
          makeElement('button', {
            className: 'rost-btn rost-btn-client',
            style: { flex: 1 },
            onclick: () => this.downloadUsbSetupScript()
          }, '💾 Download USB setup_from_usb.sh'),
          makeElement('button', {
            className: 'rost-btn rost-btn-primary',
            style: { flex: 1 },
            onclick: () => {
              if (navigator.clipboard) navigator.clipboard.writeText(cmdBox.textContent);
              alert('Copied 1-liner to clipboard! Paste it into your Ubuntu terminal.');
            }
          }, '📋 Copy Network 1-Liner'),
          makeElement('button', {
            className: 'rost-btn rost-btn-server',
            style: { flex: 1 },
            onclick: async () => {
              const inp = document.getElementById('rost-linux-ip-input');
              const targetIp = (inp ? inp.value.trim() : '') || savedLinuxIp;
              if (!targetIp) {
                alert('Please enter your Linux machine IP first.');
                return;
              }
              this.statusDisplay.textContent = `⚡ Pinging ${targetIp}...`;
              const out = await this.executeServerScript(`
                const { execSync } = require("child_process");
                try {
                  const res = execSync("ping -c 2 -W 1 ${targetIp}", { encoding: "utf8" });
                  return { success: true, ping: res };
                } catch(e) {
                  return { success: false, error: e.message };
                }
              `, 'RunOnServerTools');
            }
          }, '🔍 Ping Linux Host')
        );

        const multiNodeRow = makeElement('div', {
          style: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #21262d' }
        },
          makeElement('strong', { style: { color: '#00f2fe', fontSize: '0.75rem' } }, 'Active Script Target:'),
          makeElement('button', {
            className: 'rost-btn',
            style: { padding: '4px 8px', fontSize: '0.72rem', background: '#003847', color: '#00f2fe', border: '1px solid #00f2fe' },
            onclick: () => {
              this.activeTargetHost = window.location.origin;
              alert(`Set active script target to LOCAL (${window.location.origin})`);
            }
          }, 'Local Machine (Mac)'),
          makeElement('button', {
            className: 'rost-btn',
            style: { padding: '4px 8px', fontSize: '0.72rem', background: '#271052', color: '#d2a8ff', border: '1px solid #8257e5' },
            onclick: () => {
              const inp = document.getElementById('rost-linux-ip-input');
              const targetIp = (inp ? inp.value.trim() : '') || savedLinuxIp;
              if (!targetIp) { alert('Enter Linux IP first'); return; }
              this.activeTargetHost = `http://${targetIp}:8080`;
              alert(`Set active script target to REMOTE LINUX (http://${targetIp}:8080)`);
            }
          }, 'Remote Linux Machine')
        );

        wrapper.appendChild(infoBox);
        wrapper.appendChild(targetRow);
        wrapper.appendChild(makeElement('strong', { style: { color: '#8b949e', fontSize: '0.72rem' } }, '1-Liner to paste on Linux:'));
        wrapper.appendChild(cmdBox);
        wrapper.appendChild(btnRow);
        wrapper.appendChild(multiNodeRow);

        const dlg = UITools.makeDialog({
          title: '🐧 Ubuntu Machine Setup & Cross-Network Bridge',
          size: [600, 420],
          position: [60, 70],
          contentElement: wrapper
        });
        this.openDialogs.push(dlg);
    }
  copyLinuxOneLiner() {
      const el = document.getElementById('rost-linux-oneliner-display');
      const text = el ? el.textContent : `curl -sSL http://${window.location.hostname || 'localhost'}:8080/setup-linux.sh | bash`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          alert('Copied Ubuntu setup command to clipboard!\n\nPaste this into your Ubuntu terminal.');
        });
      } else {
        prompt('Copy Ubuntu Setup Command:', text);
      }
    }

  downloadUsbSetupScript() {
      const script = `#!/usr/bin/env bash
  # ==============================================================================
  # 🌙 LUNO WORKSPACE - AUTOMATED USB SETUP FOR UBUNTU LINUX
  # Plug in USB drive, open terminal, and run:
  #   bash /media/$USER/*/setup_from_usb.sh
  # ==============================================================================
  set -e

  C_CYAN='\\033[0;36m'
  C_GREEN='\\033[0;32m'
  C_YELLOW='\\033[1;33m'
  C_RESET='\\033[0m'

  echo -e "\${C_CYAN}================================================================\${C_RESET}"
  echo -e "\${C_CYAN}🌙 Setting up Luno Workspace from USB Drive on Ubuntu\${C_RESET}"
  echo -e "\${C_CYAN}================================================================\${C_RESET}"

  SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
  TARGET_DIR="\$HOME/source/LunoProjects"

  # 1. Install prerequisites (Node, Git, Build tools, OpenSSH)
  echo -e "\\n\${C_YELLOW}[1/4] Installing Git, Node.js 22 LTS & OpenSSH Server...\${C_RESET}"
  sudo apt update
  sudo apt install -y curl git build-essential openssh-server net-tools ufw

  if ! command -v node &> /dev/null || [[ "$(node -v)" != v2* ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
  fi

  # Enable SSH and firewall ports
  sudo systemctl enable --now ssh
  sudo ufw allow 22/tcp || true
  sudo ufw allow 8080/tcp || true

  # 2. Copy workspace from USB drive
  echo -e "\\n\${C_YELLOW}[2/4] Copying projects to \$TARGET_DIR...\${C_RESET}"
  mkdir -p "\$HOME/source"

  if [ -d "\$SCRIPT_DIR/LunoProjects" ]; then
    cp -r "\$SCRIPT_DIR/LunoProjects" "\$HOME/source/"
  elif [ -d "\$SCRIPT_DIR/Luno" ]; then
    mkdir -p "\$TARGET_DIR"
    cp -r "\$SCRIPT_DIR"/* "\$TARGET_DIR/" 2>/dev/null || true
  else
    mkdir -p "\$TARGET_DIR"
    cp -r "\$SCRIPT_DIR"/* "\$TARGET_DIR/" 2>/dev/null || true
  fi

  # 3. Ensure Luno dependencies
  cd "\$TARGET_DIR/Luno"
  if [ ! -d "node_modules" ]; then
    npm install --no-audit --no-fund 2>/dev/null || true
  fi

  # 4. Extract Machine IP & launch
  LOCAL_IP=$(hostname -I | awk '{print $1}')
  echo -e "\\n\${C_GREEN}================================================================\${C_RESET}"
  echo -e "\${C_GREEN}✅ Setup Complete!\${C_RESET}"
  echo -e "• Linux Machine IP: \${C_CYAN}\$LOCAL_IP\${C_RESET}"
  echo -e "• From your Mac, open: \${C_CYAN}http://\$LOCAL_IP:8080\${C_RESET}"
  echo -e "• SSH from Mac:        \${C_CYAN}ssh \$USER@\$LOCAL_IP\${C_RESET}"
  echo -e "\${C_GREEN}================================================================\${C_RESET}"
  echo -e "\\n\${C_YELLOW}🚀 Starting Luno Server...\${C_RESET}\\n"

  node server.js
  `;

      const blob = new Blob([script], { type: 'text/x-shellscript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'setup_from_usb.sh';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
      alert('Downloaded setup_from_usb.sh!\n\nSave this file to the root of your USB drive alongside your LunoProjects folder.');
    }
}

globalThis.RunOnServerTools = RunOnServerTools;
if (typeof module !== 'undefined' && module.exports) module.exports = RunOnServerTools;