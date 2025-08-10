<template>
    <div class="panel-wrapper">
        <div class="panel">
            <div class="panel__title">Labyrinth</div>
            <div class="panel__actions">
                <button class="btn btn--primary" v-on:click="findBFS">Solve (BFS)</button>
                <button class="btn btn--ghost" v-on:click="findDFS">Solve (DFS)</button>
                <div class="slider" :class="{ 'is-disabled': isBfsRunning || isDfsRunning }">
                    <label for="speed">Step delay: {{ stepDelayMs }} ms</label>
                    <input id="speed" type="range" min="0" max="30" step="1" v-model.number="stepDelayMs" :disabled="isBfsRunning || isDfsRunning" />
                    <label for="path">Path paint delay: {{ pathDelayMs }} ms</label>
                    <input id="path" type="range" min="0" max="50" step="1" v-model.number="pathDelayMs" :disabled="isBfsRunning || isDfsRunning" />
                </div>
                <button class="btn btn--ghost" v-on:click="generate">Generate Maze</button>
                <button class="btn btn--ghost" v-on:click="handleReset">Reset</button>
                <button class="btn btn--ghost" v-on:click="openInstructions">Instructions</button>
            </div>
            <div class="panel__stats">
                <div class="stat"><span class="stat__label">BFS</span><span class="stat__value">{{ formatMs(bfsMs) }}</span></div>
                <div class="stat"><span class="stat__label">DFS</span><span class="stat__value">{{ formatMs(dfsMs) }}</span></div>
            </div>
        </div>
        
        <div v-if="showInstructions" class="overlay" @click="closeInstructions">
            <div class="overlay__panel" role="dialog" aria-modal="true" aria-label="Instructions" @click.stop>
                <div class="overlay__header">
                    <div class="overlay__title">Instructions</div>
                    <button type="button" class="icon-btn" @click.stop.prevent="closeInstructions" aria-label="Close">×</button>
                </div>
                <div class="overlay__content">
                    <ul class="list">
                        <li><strong>Shift + hover</strong>: build walls continuously; edges auto-connect via shortest path.</li>
                        <li><strong>Click edge</strong>: toggle a single wall.</li>
                        <li><strong>Find Path</strong>: run the pathfinder from top-left to bottom-right.</li>
                        <li><strong>Reset</strong>: clear highlights and drawing state.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BFS from '@/services/bfs'
    import DFS from '@/services/dfs'
    import {mapActions, mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'ControlPanel',
        computed: {
            ...mapGetters(['start'])
        },
        methods: {
            ...mapActions(["reset", "generateMaze"]),
            ...mapMutations(['clearDrawState']),
            generate() {
                this.clearDrawState()
                this.generateMaze()
                this.resetTimes()
            },
            handleReset() {
                this.clearDrawState()
                this.reset()
                this.resetTimes()
            },
            async findBFS() {
                if (this.isBfsRunning || this.isDfsRunning) return
                if (this.start && this.start.color !== 0) {
                    this.reset()
                }
                this.bfsMs = 0
                this.isBfsRunning = true
                this.bfsStart = (performance && performance.now ? performance.now() : Date.now())
                await BFS.findPath({ stepDelayMs: this.stepDelayMs, pathDelayMs: this.pathDelayMs })
                const t1 = (performance && performance.now ? performance.now() : Date.now())
                this.bfsMs = Math.max(0, Math.round(t1 - this.bfsStart))
                this.isBfsRunning = false
            },
            async findDFS() {
                if (this.isBfsRunning || this.isDfsRunning) return
                if (this.start && this.start.color !== 0) {
                    this.reset()
                }
                this.dfsMs = 0
                this.isDfsRunning = true
                this.dfsStart = (performance && performance.now ? performance.now() : Date.now())
                await DFS.findPath({ stepDelayMs: this.stepDelayMs, pathDelayMs: this.pathDelayMs })
                const t1 = (performance && performance.now ? performance.now() : Date.now())
                this.dfsMs = Math.max(0, Math.round(t1 - this.dfsStart))
                this.isDfsRunning = false
            },
            openInstructions() {
                this.showInstructions = true
            },
            closeInstructions() {
                this.showInstructions = false
            },
            resetTimes() {
                this.bfsMs = 0
                this.dfsMs = 0
                this.isBfsRunning = false
                this.isDfsRunning = false
                this.bfsStart = null
                this.dfsStart = null
            },
            onTick() {
                const now = (performance && performance.now ? performance.now() : Date.now())
                if (this.isBfsRunning && this.bfsStart != null) {
                    this.bfsMs = Math.max(0, Math.round(now - this.bfsStart))
                }
                if (this.isDfsRunning && this.dfsStart != null) {
                    this.dfsMs = Math.max(0, Math.round(now - this.dfsStart))
                }
            },
            formatMs(value) {
                if (value === null || value === undefined) return '0 ms'
                if (value < 1000) return `${value} ms`
                const secs = (value / 1000).toFixed(2)
                return `${secs} s`
            }
        },
        mounted() {
            window.addEventListener('keyup', (e) => {
                if (e.key === 'Shift') {
                    this.clearDrawState();
                }
                if (e.key === 'Escape') {
                    this.closeInstructions()
                }
            })
            // Use requestAnimationFrame for smoother, longer, drift-free updates
            const loop = () => {
                this.onTick()
                this.rafId = requestAnimationFrame(loop)
            }
            this.rafId = requestAnimationFrame(loop)
        },
        beforeDestroy() {
            if (this.rafId) cancelAnimationFrame(this.rafId)
        },
        data() {
            return {
                showInstructions: false,
                bfsMs: 0,
                dfsMs: 0,
                isBfsRunning: false,
                isDfsRunning: false,
                bfsStart: null,
                dfsStart: null,
                rafId: null,
                stepDelayMs: 1,
                pathDelayMs: 30,
            }
        }
    }
</script>

<style scoped lang="scss">
    .panel-wrapper {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        width: min(360px, 92vw);
    }

    .panel {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 16px;
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(2, 6, 23, 0.06);
        pointer-events: auto; /* keep panel interactive */
        backdrop-filter: blur(6px);
    }

    .panel__title {
        font-weight: 800;
        letter-spacing: 0.2px;
        color: #0f172a;
        font-size: 14px;
        text-transform: uppercase;
    }

    .panel__actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }

    .slider {
        display: grid;
        grid-template-columns: 1fr;
        gap: 6px;
        background: #ffffff;
        border: 1px solid rgba(2, 6, 23, 0.06);
        border-radius: 10px;
        padding: 8px 10px;
    }
    .slider.is-disabled {
        opacity: 0.6;
        filter: grayscale(0.2);
    }
    .slider label {
        font-size: 12px;
        color: #334155;
        font-weight: 600;
    }
    .slider input[type="range"] {
        width: 100%;
    }

    .panel__stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 4px;
    }
    .stat {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
        border: 1px solid rgba(2, 6, 23, 0.06);
        border-radius: 10px;
        padding: 6px 10px;
    }
    .stat__label {
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.3px;
        color: #334155;
        text-transform: uppercase;
    }
    .stat__value {
        font-weight: 700;
        color: #0f172a;
    }

    .btn {
        appearance: none;
        border: none;
        outline: none;
        cursor: pointer;
        font-weight: 700;
        border-radius: 12px;
        padding: 10px 16px;
        transition: transform 0.06s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease;
        box-shadow: 0 2px 0 rgba(2, 6, 23, 0.06);
        letter-spacing: 0.2px;
        width: 100%;
        text-align: center;
    }

    .btn:active {
        transform: translateY(1px);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    }

    .btn--primary {
        background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%);
        color: #fff;
    }
    .btn--primary:hover {
        box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
        transform: translateY(-1px);
    }

    .btn--ghost {
        background: #ffffff;
        color: #0f172a;
        border: 1px solid rgba(2, 6, 23, 0.1);
    }
    .btn--ghost:hover {
        background: #f1f5f9;
    }

    /* Overlay and drawer */
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.35);
        z-index: 2000;
        display: flex;
        justify-content: flex-end; /* right side drawer */
        backdrop-filter: blur(2px);
    }

    .overlay__panel {
        height: 100vh;
        width: min(420px, 96vw);
        background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        box-shadow: -8px 0 30px rgba(2, 6, 23, 0.18);
        padding: 24px 24px 28px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        border-left: 1px solid rgba(2, 6, 23, 0.06);
        animation: drawer-in 180ms cubic-bezier(0.2, 0.8, 0.2, 1) 1;
    }

    .overlay__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(2, 6, 23, 0.06);
    }

    .overlay__title {
        font-weight: 800;
        color: #0f172a;
        letter-spacing: 0.2px;
    }

    .overlay__content {
        color: #0f172a;
        font-size: 14px;
        line-height: 1.6;
    }

    .list {
        margin: 0;
        padding-left: 16px;
    }
    .list li { margin: 8px 0; }

    .icon-btn {
        border: 1px solid rgba(2, 6, 23, 0.08);
        background: #ffffff;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        padding: 6px 10px;
        color: #0f172a;
        border-radius: 10px;
        box-shadow: 0 1px 0 rgba(2, 6, 23, 0.06);
    }
    .icon-btn:hover {
        background: #f1f5f9;
    }

    @keyframes drawer-in {
        from { transform: translateX(12px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
</style>
