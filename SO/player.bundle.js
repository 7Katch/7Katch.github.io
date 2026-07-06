// node_modules/@motion-canvas/core/lib/events/EventDispatcherBase.js
var EventDispatcherBase = class {
  constructor() {
    this.subscribable = new Subscribable(this);
    this.subscribers = /* @__PURE__ */ new Set();
  }
  /**
   * {@inheritDoc Subscribable.subscribe}
   */
  subscribe(handler) {
    this.subscribers.add(handler);
    return () => this.unsubscribe(handler);
  }
  /**
   * {@inheritDoc Subscribable.unsubscribe}
   */
  unsubscribe(handler) {
    this.subscribers.delete(handler);
  }
  /**
   * Unsubscribe all subscribers from the event.
   */
  clear() {
    this.subscribers.clear();
  }
  notifySubscribers(value) {
    return [...this.subscribers].map((handler) => handler(value));
  }
};
var Subscribable = class {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  /**
   * Subscribe to the event.
   *
   * @param handler - The handler to invoke when the event occurs.
   *
   * @returns A callback function that cancels the subscription.
   */
  subscribe(handler) {
    return this.dispatcher.subscribe(handler);
  }
  /**
   * Unsubscribe from the event.
   *
   * @param handler - The handler to unsubscribe.
   */
  unsubscribe(handler) {
    this.dispatcher.unsubscribe(handler);
  }
};

// node_modules/@motion-canvas/core/lib/events/AsyncEventDispatcher.js
var AsyncEventDispatcher = class extends EventDispatcherBase {
  async dispatch(value) {
    await Promise.all(this.notifySubscribers(value));
  }
};

// node_modules/@motion-canvas/core/lib/events/EventDispatcher.js
var EventDispatcher = class extends EventDispatcherBase {
  dispatch(value) {
    this.notifySubscribers(value);
  }
};

// node_modules/@motion-canvas/core/lib/events/FlagDispatcher.js
var FlagDispatcher = class extends EventDispatcherBase {
  constructor() {
    super(...arguments);
    this.value = false;
  }
  /**
   * Notify all current and future subscribers.
   */
  raise() {
    if (!this.value) {
      this.value = true;
      this.notifySubscribers();
    }
  }
  /**
   * Stop notifying future subscribers.
   */
  reset() {
    this.value = false;
  }
  /**
   * Are subscribers being notified?
   */
  isRaised() {
    return this.value;
  }
  subscribe(handler) {
    const unsubscribe = super.subscribe(handler);
    if (this.value) {
      handler();
    }
    return unsubscribe;
  }
};

// node_modules/@motion-canvas/core/lib/events/ValueDispatcher.js
var ValueDispatcher = class extends EventDispatcherBase {
  /**
   * {@inheritDoc SubscribableValueEvent.current}
   */
  get current() {
    return this.value;
  }
  /**
   * Set the current value of this dispatcher.
   *
   * @remarks
   * Setting the value will immediately notify all subscribers.
   *
   * @param value - The new value.
   */
  set current(value) {
    this.value = value;
    this.notifySubscribers(value);
  }
  /**
   * @param value - The initial value.
   */
  constructor(value) {
    super();
    this.value = value;
    this.subscribable = new SubscribableValueEvent(this);
  }
  /**
   * {@inheritDoc SubscribableValueEvent.subscribe}
   */
  subscribe(handler, dispatchImmediately = true) {
    const unsubscribe = super.subscribe(handler);
    if (dispatchImmediately) {
      handler(this.value);
    }
    return unsubscribe;
  }
};
var SubscribableValueEvent = class extends Subscribable {
  /**
   * Get the most recent value of this dispatcher.
   */
  get current() {
    return this.dispatcher.current;
  }
  /**
   * Subscribe to the event.
   *
   * Subscribing will immediately invoke the handler with the most recent value.
   *
   * @param handler - The handler to invoke when the event occurs.
   * @param dispatchImmediately - Whether the handler should be immediately
   *                              invoked with the most recent value.
   *
   * @returns Callback function that cancels the subscription.
   */
  subscribe(handler, dispatchImmediately = true) {
    return this.dispatcher.subscribe(handler, dispatchImmediately);
  }
};

// node_modules/@motion-canvas/core/lib/utils/DetailedError.js
var DetailedError = class extends Error {
  constructor(props, remarks) {
    if (typeof props === "string") {
      super(props);
      this.remarks = remarks;
    } else {
      super(props.message);
      this.remarks = props.remarks;
      this.object = props.object;
      this.durationMs = props.durationMs;
      this.inspect = props.inspect;
    }
  }
};

// node_modules/@motion-canvas/core/lib/utils/Semaphore.js
var Semaphore = class {
  constructor() {
    this.resolveCurrent = null;
    this.current = null;
  }
  async acquire() {
    while (this.current) {
      await this.current;
    }
    this.current = new Promise((resolve) => {
      this.resolveCurrent = resolve;
    });
  }
  release() {
    this.current = null;
    this.resolveCurrent?.();
    this.resolveCurrent = null;
  }
};

// node_modules/@motion-canvas/core/lib/utils/useScene.js
var SceneStack = [];
function useScene() {
  const scene = SceneStack.at(-1);
  if (!scene) {
    throw new Error("The scene is not available in the current context.");
  }
  return scene;
}
function useLogger() {
  return SceneStack.at(-1)?.logger ?? console;
}

// node_modules/@motion-canvas/core/lib/utils/useThread.js
var ThreadStack = [];
function useThread() {
  const thread = ThreadStack.at(-1);
  if (!thread) {
    throw new DetailedError("The thread is not available in the current context.", "<p><code>useThread()</code> can only be called from within generator functions.\n      It&#39;s not available during rendering.</p>\n");
  }
  return thread;
}

// node_modules/@motion-canvas/core/lib/utils/errorToLog.js
function errorToLog(error) {
  return {
    message: error.message,
    stack: error.stack,
    remarks: error.remarks
  };
}

// node_modules/@motion-canvas/core/lib/app/PlaybackManager.js
var PlaybackState;
(function(PlaybackState2) {
  PlaybackState2[PlaybackState2["Playing"] = 0] = "Playing";
  PlaybackState2[PlaybackState2["Rendering"] = 1] = "Rendering";
  PlaybackState2[PlaybackState2["Paused"] = 2] = "Paused";
  PlaybackState2[PlaybackState2["Presenting"] = 3] = "Presenting";
})(PlaybackState || (PlaybackState = {}));
var PlaybackManager = class {
  constructor() {
    this.frame = 0;
    this.speed = 1;
    this.fps = 30;
    this.duration = 0;
    this.finished = false;
    this.slides = [];
    this.previousScene = null;
    this.state = PlaybackState.Paused;
    this.currentSceneReference = null;
    this.scenes = new ValueDispatcher([]);
  }
  /**
   * Triggered when the active scene changes.
   *
   * @eventProperty
   */
  get onSceneChanged() {
    if (this.currentSceneReference === null) {
      throw new Error("PlaybackManager has not been properly initialized");
    }
    return this.currentSceneReference.subscribable;
  }
  /**
   * Triggered when the scenes get recalculated.
   *
   * @remarks
   * This event indicates that the timing of at least one scene has changed.
   *
   * @eventProperty
   */
  get onScenesRecalculated() {
    return this.scenes.subscribable;
  }
  get currentScene() {
    if (this.currentSceneReference === null) {
      throw new Error("PlaybackManager has not been properly initialized");
    }
    return this.currentSceneReference.current;
  }
  set currentScene(scene) {
    if (!scene) {
      throw new Error("Invalid scene.");
    }
    this.currentSceneReference ?? (this.currentSceneReference = new ValueDispatcher(scene));
    this.currentSceneReference.current = scene;
  }
  setup(scenes) {
    this.scenes.current = scenes;
    this.currentScene = scenes[0];
  }
  async progress() {
    this.finished = await this.next();
    return this.finished;
  }
  async seek(frame) {
    if (frame <= this.frame || this.currentScene.isCached() && this.currentScene.lastFrame < frame) {
      const scene = this.findBestScene(frame);
      if (scene !== this.currentScene) {
        this.previousScene = null;
        this.currentScene = scene;
        this.frame = this.currentScene.firstFrame;
        await this.currentScene.reset();
      } else if (this.frame >= frame) {
        this.previousScene = null;
        this.frame = this.currentScene.firstFrame;
        await this.currentScene.reset();
      }
    }
    this.finished = false;
    while (this.frame < frame && !this.finished) {
      this.finished = await this.next();
    }
    return this.finished;
  }
  async goBack() {
    let target = this.currentScene.slides.getCurrent();
    if (target && this.currentScene.slides.isWaiting()) {
      const index = this.slides.indexOf(target);
      target = this.slides[index - 1];
    }
    await this.seekSlide(target);
  }
  async goForward() {
    const current = this.currentScene.slides.getCurrent();
    const index = this.slides.indexOf(current);
    await this.seekSlide(this.slides[index + 1]);
  }
  async goTo(slideId) {
    await this.seekSlide(this.slides.find((slide) => slide.id === slideId));
  }
  async seekSlide(slide = null) {
    if (!slide)
      return;
    const { id, scene } = slide;
    if (this.currentScene !== scene || this.currentScene.slides.didHappen(id)) {
      this.previousScene = null;
      this.currentScene = scene;
      this.frame = this.currentScene.firstFrame;
      this.currentScene.slides.setTarget(id);
      await this.currentScene.reset();
    }
    this.finished = false;
    this.currentScene.slides.setTarget(id);
    while (!this.currentScene.slides.isWaitingFor(id) && !this.finished) {
      this.finished = await this.next();
    }
    this.currentScene.slides.setTarget(null);
    return this.finished;
  }
  async reset() {
    this.previousScene = null;
    this.currentScene = this.scenes.current[0];
    this.frame = 0;
    this.finished = false;
    await this.currentScene.reset();
  }
  reload(description) {
    this.scenes.current.forEach((scene) => scene.reload(description));
  }
  async recalculate() {
    this.previousScene = null;
    this.slides = [];
    const speed = this.speed;
    this.frame = 0;
    this.speed = 1;
    const scenes = [];
    try {
      for (const scene of this.scenes.current) {
        await scene.recalculate((frame) => {
          this.frame = frame;
        });
        this.slides.push(...scene.slides.onChanged.current);
        scenes.push(scene);
      }
    } finally {
      this.speed = speed;
    }
    this.scenes.current = scenes;
    this.duration = this.frame;
  }
  async next() {
    if (this.previousScene) {
      await this.previousScene.next();
      if (this.currentScene.isFinished()) {
        this.previousScene = null;
      }
    }
    this.frame += this.speed;
    if (this.currentScene.isFinished()) {
      return true;
    }
    await this.currentScene.next();
    if (this.previousScene && this.currentScene.isAfterTransitionIn()) {
      this.previousScene = null;
    }
    if (this.currentScene.canTransitionOut()) {
      this.previousScene = this.currentScene;
      const nextScene = this.getNextScene(this.previousScene);
      if (nextScene) {
        this.currentScene = nextScene;
        await this.currentScene.reset(this.previousScene);
      }
      if (!nextScene || this.currentScene.isAfterTransitionIn()) {
        this.previousScene = null;
      }
    }
    return this.currentScene.isFinished();
  }
  findBestScene(frame) {
    let lastScene = this.scenes.current[0];
    for (const scene of this.scenes.current) {
      if (!scene.isCached() || scene.lastFrame > frame) {
        return scene;
      }
      lastScene = scene;
    }
    return lastScene;
  }
  getNextScene(scene) {
    const scenes = this.scenes.current;
    if (!scene) {
      return scenes[0];
    }
    const index = scenes.findIndex((s) => s === scene);
    if (index < 0) {
      return null;
    }
    return scenes[index + 1] ?? null;
  }
};

// node_modules/@motion-canvas/core/lib/app/PlaybackStatus.js
var PlaybackStatus = class {
  constructor(playback) {
    this.playback = playback;
  }
  /**
   * Convert seconds to frames using the current framerate.
   *
   * @param seconds - The seconds to convert.
   */
  secondsToFrames(seconds) {
    return Math.ceil(seconds * this.playback.fps);
  }
  /**
   * Convert frames to seconds using the current framerate.
   *
   * @param frames - The frames to convert.
   */
  framesToSeconds(frames) {
    return frames / this.playback.fps;
  }
  get time() {
    return this.framesToSeconds(this.playback.frame);
  }
  get frame() {
    return this.playback.frame;
  }
  get speed() {
    return this.playback.speed;
  }
  get fps() {
    return this.playback.fps;
  }
  get state() {
    return this.playback.state;
  }
  /**
   * The time passed since the last frame in seconds.
   */
  get deltaTime() {
    return this.framesToSeconds(1) * this.speed;
  }
};

// node_modules/@motion-canvas/core/lib/media/AudioManager.js
var AudioManager = class {
  get onDataChanged() {
    return this.data.subscribable;
  }
  constructor(logger) {
    this.logger = logger;
    this.data = new ValueDispatcher(null);
    this.context = new AudioContext();
    this.audioElement = new Audio();
    this.source = null;
    this.error = false;
    this.abortController = null;
    this.offset = 0;
    if (import.meta.hot) {
      import.meta.hot.on("motion-canvas:assets", ({ urls }) => {
        if (this.source && urls.includes(this.source)) {
          this.setSource(this.source);
        }
      });
    }
  }
  getTime() {
    return this.toAbsoluteTime(this.audioElement.currentTime);
  }
  setTime(value) {
    this.audioElement.currentTime = this.toRelativeTime(value);
  }
  setOffset(value) {
    this.offset = value;
  }
  setMuted(isMuted) {
    this.audioElement.muted = isMuted;
  }
  setVolume(volume) {
    this.audioElement.volume = volume;
  }
  setSource(src) {
    this.source = src;
    this.audioElement.src = src;
    this.abortController?.abort();
    this.abortController = new AbortController();
    this.loadData(this.abortController.signal).catch((e2) => {
      if (e2.name !== "AbortError") {
        this.logger.error(e2);
      }
    });
  }
  isInRange(time) {
    return time >= this.offset && time < this.audioElement.duration;
  }
  toRelativeTime(time) {
    return Math.max(0, time - this.offset);
  }
  toAbsoluteTime(time) {
    return time + this.offset;
  }
  isReady() {
    return this.source && !this.error;
  }
  /**
   * Pause/resume the audio.
   *
   * @param isPaused - Whether the audio should be paused or resumed.
   *
   * @returns `true` if the audio successfully started playing.
   */
  async setPaused(isPaused) {
    if (this.source && this.audioElement.paused !== isPaused) {
      if (isPaused) {
        this.audioElement.pause();
      } else {
        try {
          await this.audioElement.play();
          this.error = false;
          return true;
        } catch (e2) {
          if (!this.error) {
            useLogger().error(e2);
          }
          this.error = true;
        }
      }
    }
    return false;
  }
  async loadData(signal) {
    this.data.current = null;
    if (!this.source) {
      return;
    }
    const response = await fetch(this.source, { signal });
    const rawBuffer = await response.arrayBuffer();
    if (signal.aborted)
      return;
    let audioBuffer;
    try {
      audioBuffer = await this.decodeAudioData(rawBuffer);
    } catch (e2) {
      return;
    }
    if (signal.aborted)
      return;
    const sampleSize = 256;
    const samples = ~~(audioBuffer.length / sampleSize);
    const peaks = [];
    let absoluteMax = 0;
    for (let channelId = 0; channelId < audioBuffer.numberOfChannels; channelId++) {
      const channel = audioBuffer.getChannelData(channelId);
      for (let i = 0; i < samples; i++) {
        const start = ~~(i * sampleSize);
        const end = ~~(start + sampleSize);
        let min = channel[start];
        let max = min;
        for (let j = start; j < end; j++) {
          const value = channel[j];
          if (value > max) {
            max = value;
          }
          if (value < min) {
            min = value;
          }
        }
        if (channelId === 0 || max > peaks[i * 2]) {
          peaks[i * 2] = max;
        }
        if (channelId === 0 || min < peaks[i * 2 + 1]) {
          peaks[i * 2 + 1] = min;
        }
        if (max > absoluteMax) {
          absoluteMax = max;
        }
        if (Math.abs(min) > absoluteMax) {
          absoluteMax = Math.abs(min);
        }
      }
    }
    this.data.current = {
      peaks,
      absoluteMax,
      length: samples,
      sampleRate: audioBuffer.sampleRate / sampleSize * 2
    };
  }
  decodeAudioData(buffer) {
    return new Promise((resolve, reject) => this.context.decodeAudioData(buffer, resolve, reject).catch(reject));
  }
};

// node_modules/@motion-canvas/core/lib/scenes/timeEvents/EditableTimeEvents.js
var EditableTimeEvents = class {
  get onChanged() {
    return this.events.subscribable;
  }
  constructor(scene) {
    this.scene = scene;
    this.events = new ValueDispatcher([]);
    this.registeredEvents = /* @__PURE__ */ new Map();
    this.lookup = /* @__PURE__ */ new Map();
    this.collisionLookup = /* @__PURE__ */ new Set();
    this.previousReference = [];
    this.didEventsChange = false;
    this.preserveTiming = true;
    this.handleReload = () => {
      this.registeredEvents.clear();
      this.collisionLookup.clear();
    };
    this.handleRecalculated = () => {
      this.preserveTiming = true;
      this.events.current = [...this.registeredEvents.values()];
      if (this.didEventsChange || (this.previousReference?.length ?? 0) !== this.events.current.length) {
        this.didEventsChange = false;
        this.previousReference = [...this.registeredEvents.values()].map((event) => ({
          name: event.name,
          targetTime: event.targetTime
        }));
        this.scene.meta.timeEvents.set(this.previousReference);
      }
    };
    this.handleReset = () => {
      this.collisionLookup.clear();
    };
    this.handleMetaChanged = (data) => {
      if (data === this.previousReference)
        return;
      this.previousReference = data;
      this.load(data);
      this.scene.reload();
    };
    this.previousReference = scene.meta.timeEvents.get();
    this.load(this.previousReference);
    scene.onReloaded.subscribe(this.handleReload);
    scene.onRecalculated.subscribe(this.handleRecalculated);
    scene.onReset.subscribe(this.handleReset);
    scene.meta.timeEvents.onChanged.subscribe(this.handleMetaChanged, false);
  }
  set(name, offset, preserve = true) {
    let event = this.lookup.get(name);
    if (!event || event.offset === offset) {
      return;
    }
    this.preserveTiming = preserve;
    event = {
      ...event,
      targetTime: event.initialTime + offset,
      offset
    };
    this.lookup.set(name, event);
    this.registeredEvents.set(name, event);
    this.events.current = [...this.registeredEvents.values()];
    this.didEventsChange = true;
    this.scene.reload();
  }
  register(name, initialTime) {
    if (this.collisionLookup.has(name)) {
      this.scene.logger.error({
        message: `name "${name}" has already been used for another event name.`,
        stack: new Error().stack
      });
      return 0;
    }
    this.collisionLookup.add(name);
    let event = this.lookup.get(name);
    if (!event) {
      this.didEventsChange = true;
      event = {
        name,
        initialTime,
        targetTime: initialTime,
        offset: 0,
        stack: new Error().stack
      };
      this.lookup.set(name, event);
    } else {
      let changed = false;
      const newEvent = { ...event };
      const stack = new Error().stack;
      if (newEvent.stack !== stack) {
        newEvent.stack = stack;
        changed = true;
      }
      if (newEvent.initialTime !== initialTime) {
        newEvent.initialTime = initialTime;
        changed = true;
      }
      const offset = Math.max(0, newEvent.targetTime - newEvent.initialTime);
      if (this.preserveTiming && newEvent.offset !== offset) {
        newEvent.offset = offset;
        changed = true;
      }
      const target = newEvent.initialTime + newEvent.offset;
      if (!this.preserveTiming && newEvent.targetTime !== target) {
        this.didEventsChange = true;
        newEvent.targetTime = target;
        changed = true;
      }
      if (changed) {
        event = newEvent;
        this.lookup.set(name, event);
      }
    }
    this.registeredEvents.set(name, event);
    return event.offset;
  }
  load(events) {
    for (const event of events) {
      if (typeof event.name !== "string") {
        continue;
      }
      const previous = this.lookup.get(event.name) ?? {
        name: event.name,
        initialTime: 0,
        offset: 0
      };
      this.lookup.set(event.name, {
        ...previous,
        targetTime: event.targetTime ?? 0
      });
    }
  }
};

// node_modules/@motion-canvas/core/lib/app/SharedWebGLContext.js
var SOURCE_URL_REGEX = /^\/\/# sourceURL=(.*)$/gm;
var INFO_LOG_REGEX = /ERROR: \d+:(\d+): (.*)/g;
var INFO_TOKEN_REGEX = /^'([^']+)'/;
var SharedWebGLContext = class {
  constructor(logger) {
    this.logger = logger;
    this.gl = null;
    this.currentOwner = null;
    this.programLookup = /* @__PURE__ */ new Map();
  }
  borrow(owner) {
    if (this.currentOwner === owner) {
      return this.gl;
    }
    this.currentOwner?.teardown(this.gl);
    this.currentOwner = owner;
    this.currentOwner.setup(this.getGL());
    return this.gl;
  }
  /**
   * Dispose the WebGL context to free up resources.
   */
  dispose() {
    if (!this.gl) {
      return;
    }
    this.currentOwner?.teardown(this.gl);
    this.currentOwner = null;
    this.gl.useProgram(null);
    for (const { program, fragment, vertex } of this.programLookup.values()) {
      this.gl.deleteProgram(program);
      this.gl.deleteShader(fragment);
      this.gl.deleteShader(vertex);
    }
    this.programLookup.clear();
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.gl.canvas.remove();
    this.gl = null;
  }
  getProgram(fragment, vertex) {
    const key = `${fragment}#${vertex}`;
    if (this.programLookup.has(key)) {
      return this.programLookup.get(key).program;
    }
    const gl = this.getGL();
    const fragmentShader = this.getShader(gl.FRAGMENT_SHADER, fragment);
    const vertexShader = this.getShader(gl.VERTEX_SHADER, vertex);
    if (!fragmentShader || !vertexShader) {
      return null;
    }
    const program = gl.createProgram();
    gl.attachShader(program, fragmentShader);
    gl.attachShader(program, vertexShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      this.logger.error({
        message: "Failed to initialize the shader program.",
        remarks: gl.getProgramInfoLog(program) ?? void 0,
        stack: new Error().stack
      });
      gl.deleteProgram(program);
      return null;
    }
    this.programLookup.set(key, {
      program,
      fragment: fragmentShader,
      vertex: vertexShader
    });
    return program;
  }
  getShader(type, source) {
    const gl = this.getGL();
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      logGlslError(this.logger, log, source);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  getGL() {
    if (this.gl) {
      return this.gl;
    }
    this.gl = document.createElement("canvas").getContext("webgl2", {
      depth: false,
      premultipliedAlpha: false,
      stencil: false,
      powerPreference: "high-performance"
    });
    if (!this.gl) {
      throw new Error("Failed to initialize WebGL.");
    }
    return this.gl;
  }
};
function logGlslError(logger, log, source) {
  let sourceUrl = null;
  SOURCE_URL_REGEX.lastIndex = 0;
  const sourceMatch = SOURCE_URL_REGEX.exec(source);
  if (sourceMatch) {
    const url = new URL(sourceMatch[1], window.location.origin);
    url.searchParams.set("t", Date.now().toString());
    sourceUrl = url.toString();
  }
  if (!log) {
    logger.error({
      message: `Unknown shader compilation error.`,
      stack: fakeStackTrace(sourceUrl, 1, 0)
    });
    return null;
  }
  let logged = false;
  let result;
  while (result = INFO_LOG_REGEX.exec(log)) {
    const [, line, message] = result;
    let column = 0;
    const match = message.match(INFO_TOKEN_REGEX);
    if (match) {
      const tokenLine = source.split("\n")[parseInt(line) - 1];
      const index = tokenLine.indexOf(match[1]);
      if (index !== -1) {
        column = index;
      }
      if (match[1] === "include") {
        const line2 = source.split("\n").find((line3) => line3.startsWith("#include"));
        if (line2) {
          logged = true;
          logger.error({
            message: `Shader compilation error: ${message}`,
            remarks: `<p>The <code>#include</code> directive requires the use of a preprocessor.</p>
<p>Make sure to import the shader from a file:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">import</span> shader <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./shader.glsl&#x27;</span>;</code></pre><p>Do <strong>NOT</strong> use the raw loader:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">import</span> shader <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./shader.glsl?raw&#x27;</span>;</code></pre><p>Do <strong>NOT</strong> use <code>#include</code> in an inline string:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">const</span> shader = <span class="hljs-string">\`\\
#include &quot;example.glsl&quot;
\`</span>;</code></pre><p><a href='https://motioncanvas.io/docs/shaders' target='_blank'>Learn more</a> about working with shaders.</p>
`
          });
          break;
        }
      }
    }
    logged = true;
    logger.error({
      message: `Shader compilation error: ${message}`,
      stack: fakeStackTrace(sourceUrl, line, column)
    });
  }
  if (!logged) {
    logger.error({
      message: `Shader compilation error: ${log}`,
      stack: fakeStackTrace(sourceUrl, 1, 0)
    });
  }
}
function fakeStackTrace(file, line, column) {
  if (!file) {
    return void 0;
  }
  return navigator.userAgent.toLowerCase().includes("chrome") ? `  at (${file}:${line}:${column})` : `@${file}:${line}:${column}`;
}

// node_modules/@motion-canvas/core/lib/app/Player.js
var MAX_AUDIO_DESYNC = 1 / 50;
var Player = class {
  /**
   * Triggered during each iteration of the update loop when the frame is ready
   * to be rendered.
   *
   * @remarks
   * Player does not perform any rendering on its own. For the animation to be
   * visible, another class must subscribe to this event and perform the
   * rendering itself. {@link Stage} can be used to display the animation.
   *
   * @eventProperty
   */
  get onRender() {
    return this.render.subscribable;
  }
  get onStateChanged() {
    return this.playerState.subscribable;
  }
  get onFrameChanged() {
    return this.frame.subscribable;
  }
  get onDurationChanged() {
    return this.duration.subscribable;
  }
  /**
   * Triggered right after recalculation finishes.
   *
   * @remarks
   * Can be used to provide visual feedback.
   *
   * @eventProperty
   */
  get onRecalculated() {
    return this.recalculated.subscribable;
  }
  get startFrame() {
    return Math.min(this.playback.duration, this.status.secondsToFrames(this.startTime));
  }
  get endFrame() {
    return Math.min(this.playback.duration, this.status.secondsToFrames(this.endTime));
  }
  get finished() {
    return this.playback.finished || this.playback.frame >= this.endFrame;
  }
  constructor(project, settings = {}, initialState = {}, initialFrame = -1) {
    this.project = project;
    this.settings = settings;
    this.initialState = initialState;
    this.initialFrame = initialFrame;
    this.render = new AsyncEventDispatcher();
    this.frame = new ValueDispatcher(0);
    this.duration = new ValueDispatcher(0);
    this.recalculated = new EventDispatcher();
    this.lock = new Semaphore();
    this.startTime = 0;
    this.endTime = Infinity;
    this.requestId = null;
    this.renderTime = 0;
    this.requestedSeek = -1;
    this.requestedRender = false;
    this.requestedRecalculation = true;
    this.active = false;
    this.playerState = new ValueDispatcher({
      loop: true,
      muted: true,
      volume: 1,
      speed: 1,
      ...initialState,
      paused: true
    });
    this.sharedWebGLContext = new SharedWebGLContext(this.project.logger);
    this.requestedSeek = initialFrame;
    this.logger = this.project.logger;
    this.playback = new PlaybackManager();
    this.status = new PlaybackStatus(this.playback);
    this.audio = new AudioManager(this.logger);
    this.size = settings.size ?? new Vector2(1920, 1080);
    this.resolutionScale = settings.resolutionScale ?? 1;
    this.startTime = settings.range?.[0] ?? 0;
    this.endTime = settings.range?.[1] ?? Infinity;
    this.playback.fps = settings.fps ?? 60;
    this.audio.setOffset(settings.audioOffset ?? 0);
    if (project.audio) {
      this.audio.setSource(project.audio);
    }
    const scenes = [];
    for (const description of project.scenes) {
      const scene = new description.klass({
        ...description,
        playback: this.status,
        logger: this.project.logger,
        size: this.size,
        resolutionScale: this.resolutionScale,
        timeEventsClass: EditableTimeEvents,
        sharedWebGLContext: this.sharedWebGLContext,
        experimentalFeatures: project.experimentalFeatures
      });
      description.onReplaced?.subscribe((description2) => {
        scene.reload(description2);
      }, false);
      scene.onReloaded.subscribe(() => this.requestRecalculation());
      scene.variables.updateSignals(project.variables ?? {});
      scenes.push(scene);
    }
    this.playback.setup(scenes);
    this.activate();
  }
  async configure(settings) {
    await this.lock.acquire();
    let frame = this.playback.frame;
    let recalculate = false;
    this.startTime = settings.range[0];
    this.endTime = settings.range[1];
    const newFps = Math.max(1, settings.fps);
    if (this.playback.fps !== newFps) {
      const ratio = newFps / this.playback.fps;
      this.playback.fps = newFps;
      frame = Math.floor(frame * ratio);
      recalculate = true;
    }
    if (!settings.size.exactlyEquals(this.size) || settings.resolutionScale !== this.resolutionScale) {
      this.size = settings.size;
      this.resolutionScale = settings.resolutionScale;
      this.playback.reload({
        size: this.size,
        resolutionScale: this.resolutionScale
      });
    }
    if (settings.audioOffset !== void 0) {
      this.audio.setOffset(settings.audioOffset);
    }
    this.lock.release();
    if (recalculate) {
      this.playback.reload();
      this.frame.current = frame;
      this.requestRecalculation();
      this.requestedSeek = frame;
    }
  }
  /**
   * Whether the given frame is inside the animation range.
   *
   * @param frame - The frame to check.
   */
  isInRange(frame) {
    return frame >= 0 && frame <= this.playback.duration;
  }
  /**
   * Whether the given frame is inside the user-defined range.
   *
   * @param frame - The frame to check.
   */
  isInUserRange(frame) {
    return frame >= this.startFrame && frame <= this.endFrame;
  }
  requestSeek(value) {
    this.requestedSeek = this.clampRange(value);
  }
  requestPreviousFrame() {
    this.requestedSeek = this.frame.current - this.playback.speed;
  }
  requestNextFrame() {
    this.requestedSeek = this.frame.current + this.playback.speed;
  }
  requestReset() {
    this.requestedSeek = 0;
  }
  requestRender() {
    this.requestedRender = true;
  }
  toggleLoop(value = !this.playerState.current.loop) {
    if (value !== this.playerState.current.loop) {
      this.playerState.current = {
        ...this.playerState.current,
        loop: value
      };
    }
  }
  togglePlayback(value = this.playerState.current.paused) {
    if (value === this.playerState.current.paused) {
      this.playerState.current = {
        ...this.playerState.current,
        paused: !value
      };
      if (value && !this.playerState.current.loop && this.playback.frame === this.playback.duration) {
        this.requestReset();
      }
    }
  }
  toggleAudio(value = this.playerState.current.muted) {
    if (value === this.playerState.current.muted) {
      this.playerState.current = {
        ...this.playerState.current,
        muted: !value
      };
    }
  }
  setAudioVolume(value) {
    const clampedValue = clamp(0, 1, value);
    if (clampedValue !== this.playerState.current.volume) {
      this.playerState.current = {
        ...this.playerState.current,
        volume: clampedValue
      };
    }
  }
  addAudioVolume(value) {
    this.setAudioVolume(this.playerState.current.volume + value);
  }
  setSpeed(value) {
    if (value !== this.playerState.current.speed) {
      this.playback.speed = value;
      this.playback.reload();
      this.playerState.current = {
        ...this.playerState.current,
        speed: value
      };
      this.requestRecalculation();
    }
  }
  setVariables(variables) {
    for (const scene of this.playback.onScenesRecalculated.current) {
      scene.variables.updateSignals(variables);
    }
  }
  /**
   * Activate the player.
   *
   * @remarks
   * A player needs to be active in order for the update loop to run. Each
   * player is active by default.
   */
  activate() {
    this.active = true;
    this.request();
  }
  /**
   * Deactivate the player.
   *
   * @remarks
   * Deactivating the player prevents its update loop from running. This should
   * be done before disposing the player, to prevent it from running in the
   * background.
   *
   * Just pausing the player does not stop the loop.
   */
  deactivate() {
    this.active = false;
    this.sharedWebGLContext.dispose();
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }
  requestRecalculation() {
    this.requestedRecalculation = true;
    this.request();
  }
  async prepare() {
    const state = {
      ...this.playerState.current,
      seek: this.requestedSeek,
      render: this.requestedRender
    };
    this.requestedSeek = -1;
    this.requestedRender = false;
    if (this.requestedRecalculation) {
      if (state.seek < 0) {
        state.seek = this.playback.frame;
      }
      try {
        await this.playback.recalculate();
        this.duration.current = this.playback.frame;
        this.recalculated.dispatch();
      } catch (e2) {
        this.requestSeek(state.seek);
        throw e2;
      } finally {
        this.requestedRecalculation = false;
      }
    }
    if (!state.loop && this.finished && !state.paused && state.seek < 0 || this.endFrame === this.startFrame) {
      this.togglePlayback(false);
      state.paused = true;
      state.seek = this.endFrame === this.startFrame ? state.seek : this.startFrame;
    }
    if (state.loop && (state.seek > this.endFrame || this.finished && !state.paused) && this.startFrame !== this.endTime) {
      state.seek = this.startFrame;
    }
    const audioPaused = state.paused || this.finished || !this.audio.isInRange(this.status.time);
    if (await this.audio.setPaused(audioPaused)) {
      this.syncAudio(-3);
    }
    this.audio.setMuted(state.muted);
    this.audio.setVolume(state.volume);
    return state;
  }
  async run() {
    const state = await this.prepare();
    const previousState = this.playback.state;
    this.playback.state = state.paused ? PlaybackState.Paused : PlaybackState.Playing;
    if (state.seek >= 0 || !this.isInUserRange(this.status.frame)) {
      const seekFrame = state.seek < 0 ? this.status.frame : state.seek;
      const clampedFrame = this.clampRange(seekFrame);
      this.logger.profile("seek time");
      await this.playback.seek(clampedFrame);
      this.logger.profile("seek time");
      this.syncAudio(-3);
    } else if (state.paused || state.speed === 1 && this.audio.isReady() && this.audio.isInRange(this.status.time) && this.audio.getTime() < this.status.time) {
      if (state.render || state.paused && previousState !== PlaybackState.Paused) {
        await this.render.dispatch();
      }
      if (!state.paused && this.status.time > this.audio.getTime() + MAX_AUDIO_DESYNC) {
        this.syncAudio();
      }
      this.request();
      return;
    } else if (this.audio.isReady() && state.speed === 1 && this.audio.isInRange(this.status.time) && this.status.framesToSeconds(this.playback.frame + 1) < this.audio.getTime() - MAX_AUDIO_DESYNC) {
      const seekFrame = this.status.secondsToFrames(this.audio.getTime());
      await this.playback.seek(seekFrame);
    } else if (this.status.frame < this.endFrame) {
      await this.playback.progress();
      if (state.speed !== 1) {
        this.syncAudio();
      }
    }
    if (!state.paused && this.playback.currentScene.slides.isWaiting()) {
      this.togglePlayback(false);
      state.paused = true;
    }
    await this.render.dispatch();
    this.frame.current = this.playback.frame;
    this.request();
  }
  request() {
    if (!this.active)
      return;
    this.requestId ?? (this.requestId = requestAnimationFrame(async (time) => {
      this.requestId = null;
      if (time - this.renderTime >= 1e3 / (this.status.fps + 5)) {
        this.renderTime = time;
        await this.lock.acquire();
        try {
          await this.run();
        } catch (e2) {
          this.logger.error(e2);
        }
        this.lock.release();
      } else {
        this.request();
      }
    }));
  }
  clampRange(frame) {
    return clamp(this.startFrame, this.endFrame, frame);
  }
  syncAudio(frameOffset = 0) {
    this.audio.setTime(this.status.framesToSeconds(this.playback.frame + frameOffset));
  }
};

// node_modules/@motion-canvas/core/lib/app/Stage.js
var Stage = class {
  get canvasSize() {
    return this.size.scale(this.resolutionScale);
  }
  constructor() {
    this.background = null;
    this.resolutionScale = 1;
    this.colorSpace = "srgb";
    this.size = Vector2.zero;
    this.finalBuffer = document.createElement("canvas");
    this.currentBuffer = document.createElement("canvas");
    this.previousBuffer = document.createElement("canvas");
    const colorSpace = this.colorSpace;
    this.context = getContext({ colorSpace }, this.finalBuffer);
    this.currentContext = getContext({ colorSpace }, this.currentBuffer);
    this.previousContext = getContext({ colorSpace }, this.previousBuffer);
  }
  configure({ colorSpace = this.colorSpace, size = this.size, resolutionScale = this.resolutionScale, background = this.background }) {
    if (colorSpace !== this.colorSpace) {
      this.colorSpace = colorSpace;
      this.context = getContext({ colorSpace }, this.finalBuffer);
      this.currentContext = getContext({ colorSpace }, this.currentBuffer);
      this.previousContext = getContext({ colorSpace }, this.previousBuffer);
    }
    if (!size.exactlyEquals(this.size) || resolutionScale !== this.resolutionScale) {
      this.resolutionScale = resolutionScale;
      this.size = size;
      this.resizeCanvas(this.context);
      this.resizeCanvas(this.currentContext);
      this.resizeCanvas(this.previousContext);
    }
    this.background = typeof background === "string" ? background : background?.serialize() ?? null;
  }
  async render(currentScene, previousScene) {
    const previousOnTop = previousScene ? unwrap(currentScene.previousOnTop) : false;
    if (previousScene) {
      await previousScene.render(this.previousContext);
    }
    await currentScene.render(this.currentContext);
    const size = this.canvasSize;
    this.context.clearRect(0, 0, size.width, size.height);
    if (this.background) {
      this.context.save();
      this.context.fillStyle = this.background;
      this.context.fillRect(0, 0, size.width, size.height);
      this.context.restore();
    }
    if (previousScene && !previousOnTop) {
      this.context.drawImage(this.previousBuffer, 0, 0);
    }
    this.context.drawImage(this.currentBuffer, 0, 0);
    if (previousOnTop) {
      this.context.drawImage(this.previousBuffer, 0, 0);
    }
  }
  resizeCanvas(context) {
    const size = this.canvasSize;
    context.canvas.width = size.width;
    context.canvas.height = size.height;
  }
};

// node_modules/@motion-canvas/core/lib/utils/getContext.js
function getContext(options, canvas = document.createElement("canvas")) {
  const context = canvas.getContext("2d", options);
  if (!context) {
    throw new Error("Could not create a 2D context.");
  }
  return context;
}

// node_modules/@motion-canvas/core/lib/utils/math.js
var RAD2DEG = 180 / Math.PI;
var DEG2RAD = Math.PI / 180;

// node_modules/@motion-canvas/core/lib/utils/useDuration.js
function useDuration(name) {
  const scene = useScene();
  const thread = useThread();
  return scene.timeEvents.register(name, thread.time());
}

// node_modules/@motion-canvas/core/lib/utils/usePlayback.js
var PlaybackStack = [];
function usePlayback() {
  const playback = PlaybackStack.at(-1);
  if (!playback) {
    throw new Error("The playback is not available in the current context.");
  }
  return playback;
}

// node_modules/@motion-canvas/core/lib/decorators/decorate.js
function decorate(fn, ...decorators) {
  const target = { [fn.name]: fn };
  const descriptor = Object.getOwnPropertyDescriptor(target, fn.name);
  if (descriptor) {
    for (let i = decorators.length - 1; i >= 0; i--) {
      decorators[i](target, fn.name, descriptor);
    }
  }
}

// node_modules/@motion-canvas/core/lib/decorators/threadable.js
function threadable(customName) {
  return function(_, propertyKey, descriptor) {
    descriptor.value.prototype.name = customName ?? propertyKey;
    descriptor.value.prototype.threadable = true;
  };
}

// node_modules/@motion-canvas/core/lib/flow/scheduling.js
decorate(waitUntil, threadable());
function* waitUntil(event, after) {
  yield* waitFor(useDuration(event));
  if (after) {
    yield* after;
  }
}
decorate(waitFor, threadable());
function* waitFor(seconds = 0, after) {
  const thread = useThread();
  const step = usePlayback().framesToSeconds(1);
  const targetTime = thread.time() + seconds;
  while (targetTime - step > thread.fixed) {
    yield;
  }
  thread.time(targetTime);
  if (after) {
    yield* after;
  }
}

// node_modules/@motion-canvas/core/lib/flow/run.js
function run(firstArg, runner) {
  let task;
  if (typeof firstArg === "string") {
    task = runner();
    setTaskName(task, firstArg);
  } else {
    task = firstArg();
    setTaskName(task, task);
  }
  return task;
}

// node_modules/@motion-canvas/core/lib/threading/names.js
function setTaskName(task, source) {
  const prototype = Object.getPrototypeOf(task);
  if (!prototype.threadable) {
    prototype.threadable = true;
    prototype.name = typeof source === "string" ? source : getTaskName(source);
  }
}
function getTaskName(task) {
  return Object.getPrototypeOf(task).name ?? null;
}

// node_modules/@motion-canvas/core/lib/tweening/interpolationFunctions.js
function map(from, to, value) {
  return from + (to - from) * value;
}
function clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
}
function arcLerp(value, reverse, ratio) {
  let flip = reverse;
  if (ratio > 1) {
    ratio = 1 / ratio;
  } else {
    flip = !flip;
  }
  const normalized = flip ? Math.acos(clamp(-1, 1, 1 - value)) : Math.asin(value);
  const radians = map(normalized, map(0, Math.PI / 2, value), ratio);
  let xValue = Math.sin(radians);
  let yValue = 1 - Math.cos(radians);
  if (reverse) {
    [xValue, yValue] = [yValue, xValue];
  }
  return new Vector2(xValue, yValue);
}

// node_modules/@motion-canvas/core/lib/tweening/timingFunctions.js
function easeInOutCubic(value, from = 0, to = 1) {
  value = value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
  return map(from, to, value);
}
function createEaseInBack(s = 1.70158) {
  return (value, from = 0, to = 1) => {
    value = (s + 1) * value * value * value - s * value * value;
    return map(from, to, value);
  };
}
function createEaseOutBack(s = 1.70158) {
  return (value, from = 0, to = 1) => {
    value = 1 + (s + 1) * Math.pow(value - 1, 3) + s * Math.pow(value - 1, 2);
    return map(from, to, value);
  };
}
function createEaseInOutBack(s = 1.70158, v = 1.525) {
  return (value, from = 0, to = 1) => {
    value = value < 0.5 ? Math.pow(2 * value, 2) * ((s * v + 1) * 2 * value - s * v) / 2 : (Math.pow(2 * value - 2, 2) * ((s * v + 1) * (value * 2 - 2) + s * v) + 2) / 2;
    return map(from, to, value);
  };
}
function createEaseInElastic(s = 2.094395) {
  return (value, from = 0, to = 1) => {
    value = value === 0 ? 0 : value === 1 ? 1 : -Math.pow(2, 10 * value - 10) * Math.sin((value * 10 - 10.75) * s);
    return map(from, to, value);
  };
}
function createEaseOutElastic(s = 2.094395) {
  return (value, from = 0, to = 1) => {
    value = value === 0 ? 0 : value === 1 ? 1 : Math.pow(2, -10 * value) * Math.sin((value * 10 - 0.75) * s) + 1;
    return map(from, to, value);
  };
}
function createEaseInOutElastic(s = 1.39626) {
  return (value, from = 0, to = 1) => {
    value = value === 0 ? 0 : value === 1 ? 1 : value < 0.5 ? -(Math.pow(2, 20 * value - 10) * Math.sin((20 * value - 11.125) * s)) / 2 : Math.pow(2, -20 * value + 10) * Math.sin((20 * value - 11.125) * s) / 2 + 1;
    return map(from, to, value);
  };
}
function createEaseInBounce(n = 7.5625, d = 2.75) {
  const easeOutBounce2 = createEaseOutBounce(n, d);
  return (value, from = 0, to = 1) => {
    return 1 - easeOutBounce2(1 - value, from, to);
  };
}
function createEaseOutBounce(n = 7.5625, d = 2.75) {
  return (value, from = 0, to = 1) => {
    if (value < 1 / d) {
      value = n * value * value;
    } else if (value < 2 / d) {
      value = n * (value -= 1.505 / d) * value + 0.75;
    } else if (value < 2.5 / d) {
      value = n * (value -= 2.25 / d) * value + 0.9375;
    } else {
      value = n * (value -= 2.625 / d) * value + 0.984375;
    }
    return map(from, to, value);
  };
}
function createEaseInOutBounce(n = 7.5625, d = 2.75) {
  const easeOutBounce2 = createEaseOutBounce(n, d);
  return (value, from = 0, to = 1) => {
    return value < 0.5 ? (1 - easeOutBounce2(1 - 2 * value, from, to)) / 2 : (1 + easeOutBounce2(2 * value - 1, from, to)) / 2;
  };
}
var easeInBack = createEaseInBack();
var easeOutBack = createEaseOutBack();
var easeInOutBack = createEaseInOutBack();
var easeInBounce = createEaseInBounce();
var easeOutBounce = createEaseOutBounce();
var easeInOutBounce = createEaseInOutBounce();
var easeInElastic = createEaseInElastic();
var easeOutElastic = createEaseOutElastic();
var easeInOutElastic = createEaseInOutElastic();

// node_modules/@motion-canvas/core/lib/tweening/tween.js
decorate(tween, threadable());
function* tween(seconds, onProgress, onEnd) {
  const thread = useThread();
  const startTime = thread.time();
  const endTime = thread.time() + seconds;
  onProgress(0, 0);
  while (endTime > thread.fixed) {
    const time = thread.fixed - startTime;
    const value = time / seconds;
    if (time > 0) {
      onProgress(value, time);
    }
    yield;
  }
  thread.time(endTime);
  onProgress(1, seconds);
  onEnd?.(1, seconds);
}

// node_modules/@motion-canvas/core/lib/signals/DependencyContext.js
var DependencyContext = class _DependencyContext {
  static collectPromise(promise, initialValue = null) {
    const handle = {
      promise,
      value: initialValue,
      stack: new Error().stack
    };
    const context = this.collectionStack.at(-1);
    if (context) {
      handle.owner = context.owner;
    }
    promise.then((value) => {
      handle.value = value;
      context?.markDirty();
    });
    this.promises.push(handle);
    return handle;
  }
  static hasPromises() {
    return this.promises.length > 0;
  }
  static async consumePromises() {
    const promises = [...this.promises];
    await Promise.all(promises.map((handle) => handle.promise));
    this.promises = this.promises.filter((v) => !promises.includes(v));
    return promises;
  }
  constructor(owner) {
    this.owner = owner;
    this.dependencies = /* @__PURE__ */ new Set();
    this.event = new FlagDispatcher();
    this.markDirty = () => this.event.raise();
    this.invokable = this.invoke.bind(this);
    Object.defineProperty(this.invokable, "context", {
      value: this
    });
    Object.defineProperty(this.invokable, "toPromise", {
      value: this.toPromise.bind(this)
    });
  }
  invoke() {
  }
  startCollecting() {
    if (_DependencyContext.collectionSet.has(this)) {
      throw new DetailedError("A circular dependency occurred between signals.", `This can happen when signals reference each other in a loop.
        Try using the attached stack trace to locate said loop.`);
    }
    _DependencyContext.collectionSet.add(this);
    _DependencyContext.collectionStack.push(this);
  }
  finishCollecting() {
    _DependencyContext.collectionSet.delete(this);
    if (_DependencyContext.collectionStack.pop() !== this) {
      throw new Error("collectStart/collectEnd was called out of order.");
    }
  }
  clearDependencies() {
    this.dependencies.forEach((dep) => dep.unsubscribe(this.markDirty));
    this.dependencies.clear();
  }
  collect() {
    const signal = _DependencyContext.collectionStack.at(-1);
    if (signal) {
      signal.dependencies.add(this.event.subscribable);
      this.event.subscribe(signal.markDirty);
    }
  }
  dispose() {
    this.clearDependencies();
    this.event.clear();
    this.owner = null;
  }
  async toPromise() {
    do {
      await _DependencyContext.consumePromises();
      this.invokable();
    } while (_DependencyContext.hasPromises());
    return this.invokable;
  }
};
DependencyContext.collectionSet = /* @__PURE__ */ new Set();
DependencyContext.collectionStack = [];
DependencyContext.promises = [];

// node_modules/@motion-canvas/core/lib/signals/symbols.js
var DEFAULT = Symbol.for("@motion-canvas/core/signals/default");

// node_modules/@motion-canvas/core/lib/signals/utils.js
function isReactive(value) {
  return typeof value === "function";
}
function modify(value, modification) {
  return isReactive(value) ? () => modification(value()) : modification(value);
}
function unwrap(value) {
  return isReactive(value) ? value() : value;
}

// node_modules/@motion-canvas/core/lib/signals/SignalContext.js
var SignalContext = class extends DependencyContext {
  constructor(initial, interpolation, owner = void 0, parser = (value) => value, extensions = {}) {
    super(owner);
    this.initial = initial;
    this.interpolation = interpolation;
    this.parser = parser;
    this.tweening = false;
    Object.defineProperty(this.invokable, "reset", {
      value: this.reset.bind(this)
    });
    Object.defineProperty(this.invokable, "save", {
      value: this.save.bind(this)
    });
    Object.defineProperty(this.invokable, "isInitial", {
      value: this.isInitial.bind(this)
    });
    if (this.initial !== void 0) {
      this.current = this.initial;
      this.markDirty();
      if (!isReactive(this.initial)) {
        this.last = this.parse(this.initial);
      }
    }
    this.extensions = {
      getter: this.getter.bind(this),
      setter: this.setter.bind(this),
      tweener: this.tweener.bind(this),
      ...extensions
    };
  }
  toSignal() {
    return this.invokable;
  }
  parse(value) {
    return this.parser(value);
  }
  set(value) {
    this.extensions.setter(value);
    return this.owner;
  }
  setter(value) {
    if (value === DEFAULT) {
      value = this.initial;
    }
    if (this.current === value) {
      return this.owner;
    }
    this.current = value;
    this.clearDependencies();
    if (!isReactive(value)) {
      this.last = this.parse(value);
    }
    this.markDirty();
    return this.owner;
  }
  get() {
    return this.extensions.getter();
  }
  getter() {
    if (this.event.isRaised() && isReactive(this.current)) {
      this.clearDependencies();
      this.startCollecting();
      try {
        this.last = this.parse(this.current());
      } catch (e2) {
        useLogger().error({
          ...errorToLog(e2),
          inspect: this.owner?.key
        });
      }
      this.finishCollecting();
    }
    this.event.reset();
    this.collect();
    return this.last;
  }
  invoke(value, duration, timingFunction = easeInOutCubic, interpolationFunction = this.interpolation) {
    if (value === void 0) {
      return this.get();
    }
    if (duration === void 0) {
      return this.set(value);
    }
    const queue = this.createQueue(timingFunction, interpolationFunction);
    return queue.to(value, duration);
  }
  createQueue(defaultTimingFunction, defaultInterpolationFunction) {
    const initial = this.get();
    const queue = [];
    const task = run("animation chain", function* animate() {
      while (queue.length > 0) {
        yield* queue.shift();
      }
    });
    task.to = (value, duration, timingFunction = defaultTimingFunction, interpolationFunction = defaultInterpolationFunction) => {
      defaultTimingFunction = timingFunction;
      defaultInterpolationFunction = interpolationFunction;
      queue.push(this.tween(value, duration, timingFunction, interpolationFunction));
      return task;
    };
    task.back = (time, timingFunction = defaultTimingFunction, interpolationFunction = defaultInterpolationFunction) => {
      defaultTimingFunction = timingFunction;
      defaultInterpolationFunction = interpolationFunction;
      queue.push(this.tween(initial, time, defaultTimingFunction, defaultInterpolationFunction));
      return task;
    };
    task.wait = (duration) => {
      queue.push(waitFor(duration));
      return task;
    };
    task.run = (generator) => {
      queue.push(generator);
      return task;
    };
    task.do = (callback) => {
      queue.push(run(function* () {
        callback();
      }));
      return task;
    };
    return task;
  }
  *tween(value, duration, timingFunction, interpolationFunction) {
    if (value === DEFAULT) {
      value = this.initial;
    }
    this.tweening = true;
    yield* this.extensions.tweener(value, duration, timingFunction, interpolationFunction);
    this.set(value);
    this.tweening = false;
  }
  *tweener(value, duration, timingFunction, interpolationFunction) {
    const from = this.get();
    yield* tween(duration, (v) => {
      this.set(interpolationFunction(from, this.parse(unwrap(value)), timingFunction(v)));
    });
  }
  dispose() {
    super.dispose();
    this.initial = void 0;
    this.current = void 0;
    this.last = void 0;
  }
  /**
   * Reset the signal to its initial value (if one has been set).
   *
   * @example
   * ```ts
   * const signal = createSignal(7);
   *
   * signal.reset();
   * // same as:
   * signal(7);
   * ```
   */
  reset() {
    if (this.initial !== void 0) {
      this.set(this.initial);
    }
    return this.owner;
  }
  /**
   * Compute the current value of the signal and immediately set it.
   *
   * @remarks
   * This method can be used to stop the signal from updating while keeping its
   * current value.
   *
   * @example
   * ```ts
   * signal.save();
   * // same as:
   * signal(signal());
   * ```
   */
  save() {
    return this.set(this.get());
  }
  /**
   * Check if the signal is currently using its initial value.
   *
   * @example
   * ```ts
   *
   * const signal = createSignal(0);
   * signal.isInitial(); // true
   *
   * signal(5);
   * signal.isInitial(); // false
   *
   * signal(DEFAULT);
   * signal.isInitial(); // true
   * ```
   */
  isInitial() {
    this.collect();
    return this.current === this.initial;
  }
  /**
   * Get the initial value of this signal.
   */
  getInitial() {
    return this.initial;
  }
  /**
   * Get the raw value of this signal.
   *
   * @remarks
   * If the signal was provided with a factory function, the function itself
   * will be returned, without invoking it.
   *
   * This method can be used to create copies of signals.
   *
   * @example
   * ```ts
   * const a = createSignal(2);
   * const b = createSignal(() => a);
   * // b() == 2
   *
   * const bClone = createSignal(b.raw());
   * // bClone() == 2
   *
   * a(4);
   * // b() == 4
   * // bClone() == 4
   * ```
   */
  raw() {
    return this.current;
  }
  /**
   * Is the signal undergoing a tween?
   */
  isTweening() {
    return this.tweening;
  }
};

// node_modules/@motion-canvas/core/lib/signals/CompoundSignalContext.js
var CompoundSignalContext = class extends SignalContext {
  constructor(entries, parser, initial, interpolation, owner = void 0, extensions = {}) {
    var _a;
    super(void 0, interpolation, owner, parser, extensions);
    this.entries = entries;
    this.signals = [];
    this.parser = parser;
    for (const entry of entries) {
      let key;
      let signal;
      if (Array.isArray(entry)) {
        [key, signal] = entry;
        (_a = signal.context).owner ?? (_a.owner = this);
      } else {
        key = entry;
        signal = new SignalContext(modify(initial, (value) => parser(value)[entry]), map, owner ?? this.invokable).toSignal();
      }
      this.signals.push([key, signal]);
      Object.defineProperty(this.invokable, key, { value: signal });
    }
  }
  toSignal() {
    return this.invokable;
  }
  parse(value) {
    return this.parser(value);
  }
  getter() {
    return this.parse(Object.fromEntries(this.signals.map(([key, property]) => [key, property()])));
  }
  setter(value) {
    if (isReactive(value)) {
      for (const [key, property] of this.signals) {
        property(() => this.parser(value())[key]);
      }
    } else {
      const parsed = this.parse(value);
      for (const [key, property] of this.signals) {
        property(parsed[key]);
      }
    }
    return this.owner;
  }
  reset() {
    for (const [, signal] of this.signals) {
      signal.reset();
    }
    return this.owner;
  }
  save() {
    for (const [, signal] of this.signals) {
      signal.save();
    }
    return this.owner;
  }
  isInitial() {
    for (const [, signal] of this.signals) {
      if (!signal.isInitial()) {
        return false;
      }
    }
    return true;
  }
  raw() {
    return Object.fromEntries(this.signals.map(([key, property]) => [key, property.context.raw()]));
  }
};

// node_modules/@motion-canvas/core/lib/signals/Vector2SignalContext.js
var Vector2SignalContext = class extends CompoundSignalContext {
  constructor(entries, parser, initial, interpolation, owner = void 0, extensions = {}) {
    super(entries, parser, initial, interpolation, owner, extensions);
    Object.defineProperty(this.invokable, "edit", {
      value: this.edit.bind(this)
    });
    Object.defineProperty(this.invokable, "mul", {
      value: this.mul.bind(this)
    });
    Object.defineProperty(this.invokable, "div", {
      value: this.div.bind(this)
    });
    Object.defineProperty(this.invokable, "add", {
      value: this.add.bind(this)
    });
    Object.defineProperty(this.invokable, "sub", {
      value: this.sub.bind(this)
    });
    Object.defineProperty(this.invokable, "dot", {
      value: this.dot.bind(this)
    });
    Object.defineProperty(this.invokable, "cross", {
      value: this.cross.bind(this)
    });
    Object.defineProperty(this.invokable, "mod", {
      value: this.mod.bind(this)
    });
  }
  toSignal() {
    return this.invokable;
  }
  edit(callback, duration, timingFunction, interpolationFunction) {
    const newValue = callback(this.get());
    return this.invoke(newValue, duration, timingFunction, interpolationFunction);
  }
  mul(value, duration, timingFunction, interpolationFunction) {
    const callback = (current) => current.mul(value);
    if (duration === void 0)
      return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }
  div(value, duration, timingFunction, interpolationFunction) {
    const callback = (current) => current.div(value);
    if (duration === void 0)
      return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }
  add(value, duration, timingFunction, interpolationFunction) {
    const callback = (current) => current.add(value);
    if (duration === void 0)
      return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }
  sub(value, duration, timingFunction, interpolationFunction) {
    const callback = (current) => current.sub(value);
    if (duration === void 0)
      return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }
  dot(value, duration, timingFunction, interpolationFunction) {
    const callback = (current) => current.dot(value);
    if (duration === void 0)
      return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }
  cross(value, duration, timingFunction, interpolationFunction) {
    const callback = (current) => current.cross(value);
    if (duration === void 0)
      return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }
  mod(value, duration, timingFunction, interpolationFunction) {
    const callback = (current) => current.mod(value);
    if (duration === void 0)
      return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }
};

// node_modules/@motion-canvas/core/lib/types/Type.js
var EPSILON = 1e-6;

// node_modules/@motion-canvas/core/lib/types/Matrix2D.js
var Matrix2D = class _Matrix2D {
  static fromRotation(angle) {
    return _Matrix2D.identity.rotate(angle);
  }
  static fromTranslation(translation) {
    return _Matrix2D.identity.translate(new Vector2(translation));
  }
  static fromScaling(scale) {
    return _Matrix2D.identity.scale(new Vector2(scale));
  }
  get x() {
    return new Vector2(this.values[0], this.values[1]);
  }
  get y() {
    return new Vector2(this.values[2], this.values[3]);
  }
  get scaleX() {
    return this.values[0];
  }
  set scaleX(value) {
    this.values[0] = this.x.normalized.scale(value).x;
  }
  get skewX() {
    return this.values[1];
  }
  set skewX(value) {
    this.values[1] = value;
  }
  get scaleY() {
    return this.values[3];
  }
  set scaleY(value) {
    this.values[3] = this.y.normalized.scale(value).y;
  }
  get skewY() {
    return this.values[2];
  }
  set skewY(value) {
    this.values[2] = value;
  }
  get translateX() {
    return this.values[4];
  }
  set translateX(value) {
    this.values[4] = value;
  }
  get translateY() {
    return this.values[5];
  }
  set translateY(value) {
    this.values[5] = value;
  }
  get rotation() {
    return Vector2.degrees(this.values[0], this.values[1]);
  }
  set rotation(angle) {
    const result = this.rotate(angle - this.rotation);
    this.values[0] = result.values[0];
    this.values[1] = result.values[1];
    this.values[2] = result.values[2];
    this.values[3] = result.values[3];
  }
  get translation() {
    return new Vector2(this.values[4], this.values[5]);
  }
  set translation(translation) {
    const vec = new Vector2(translation);
    this.values[4] = vec.x;
    this.values[5] = vec.y;
  }
  get scaling() {
    return new Vector2(this.values[0], this.values[3]);
  }
  set scaling(value) {
    const scale = new Vector2(value);
    const x = new Vector2(this.values[0], this.values[1]).normalized;
    const y = new Vector2(this.values[2], this.values[3]).normalized;
    this.values[0] = x.x * scale.x;
    this.values[1] = x.y * scale.y;
    this.values[2] = y.x * scale.x;
    this.values[3] = y.y * scale.y;
  }
  /**
   * Get the inverse of the matrix.
   *
   * @remarks
   * If the matrix is not invertible, i.e. its determinant is `0`, this will
   * return `null`, instead.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const inverse = matrix.inverse;
   * // => Matrix2D(
   * //      [-2, 1],
   * //      [1.5, -0.5],
   * //      [1, -2],
   * //   )
   * ```
   */
  get inverse() {
    const aa = this.values[0], ab = this.values[1], ac = this.values[2], ad = this.values[3];
    const atx = this.values[4], aty = this.values[5];
    let det = aa * ad - ab * ac;
    if (!det) {
      return null;
    }
    det = 1 / det;
    return new _Matrix2D(ad * det, -ab * det, -ac * det, aa * det, (ac * aty - ad * atx) * det, (ab * atx - aa * aty) * det);
  }
  /**
   * Get the determinant of the matrix.
   */
  get determinant() {
    return this.values[0] * this.values[3] - this.values[1] * this.values[2];
  }
  get domMatrix() {
    return new DOMMatrix([
      this.values[0],
      this.values[1],
      this.values[2],
      this.values[3],
      this.values[4],
      this.values[5]
    ]);
  }
  constructor(a, b, c2, d, tx, ty) {
    this.values = new Float32Array(6);
    if (arguments.length === 0) {
      this.values = new Float32Array([1, 0, 0, 1, 0, 0]);
      return;
    }
    if (arguments.length === 6) {
      this.values[0] = a;
      this.values[1] = b;
      this.values[2] = c2;
      this.values[3] = d;
      this.values[4] = tx;
      this.values[5] = ty;
      return;
    }
    if (a instanceof DOMMatrix) {
      this.values[0] = a.m11;
      this.values[1] = a.m12;
      this.values[2] = a.m21;
      this.values[3] = a.m22;
      this.values[4] = a.m41;
      this.values[5] = a.m42;
      return;
    }
    if (a instanceof _Matrix2D) {
      this.values = a.values;
      return;
    }
    if (Array.isArray(a)) {
      if (a.length === 2) {
        this.values[0] = a[0];
        this.values[1] = a[1];
        this.values[2] = b[0];
        this.values[3] = b[1];
        this.values[4] = c2[0];
        this.values[5] = c2[1];
        return;
      }
      if (a.length === 3) {
        const x2 = new Vector2(a[0]);
        const y2 = new Vector2(a[1]);
        const z2 = new Vector2(a[2]);
        this.values[0] = x2.x;
        this.values[1] = x2.y;
        this.values[2] = y2.x;
        this.values[3] = y2.y;
        this.values[4] = z2.x;
        this.values[5] = z2.y;
        return;
      }
      this.values[0] = a[0];
      this.values[1] = a[1];
      this.values[2] = a[2];
      this.values[3] = a[3];
      this.values[4] = a[4];
      this.values[5] = a[5];
      return;
    }
    const x = new Vector2(a);
    const y = new Vector2(b);
    const z = new Vector2(c2);
    this.values[0] = x.x;
    this.values[1] = x.y;
    this.values[2] = y.x;
    this.values[3] = y.y;
    this.values[4] = z.x;
    this.values[5] = z.y;
  }
  /**
   * Get the nth component vector of the matrix. Only defined for 0, 1, and 2.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 0],
   *   [0, 0],
   *   [1, 0],
   * );
   *
   * const x = matrix.column(0);
   * // Vector2(1, 0)
   *
   * const y = matrix.column(1);
   * // Vector2(0, 0)
   *
   * const z = matrix.column(1);
   * // Vector2(1, 0)
   * ```
   *
   * @param index - The index of the component vector to retrieve.
   */
  column(index) {
    return new Vector2(this.values[index * 2], this.values[index * 2 + 1]);
  }
  /**
   * Returns the nth row of the matrix. Only defined for 0 and 1.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 0],
   *   [0, 0],
   *   [1, 0],
   * );
   *
   * const firstRow = matrix.column(0);
   * // [1, 0, 1]
   *
   * const secondRow = matrix.column(1);
   * // [0, 0, 0]
   * ```
   *
   * @param index - The index of the row to retrieve.
   */
  row(index) {
    return [this.values[index], this.values[index + 2], this.values[index + 4]];
  }
  /**
   * Returns the matrix product of this matrix with the provided matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [0, 1],
   *   [1, 1],
   * );
   * const b = new Matrix2D(
   *   [2, 1],
   *   [1, 1],
   *   [1, 1],
   * );
   *
   * const result = a.mul(b);
   * // => Matrix2D(
   * //     [2, 5],
   * //     [1, 3],
   * //     [2, 4],
   * //   )
   * ```
   *
   * @param other - The matrix to multiply with
   */
  mul(other) {
    const a0 = this.values[0], a1 = this.values[1], a2 = this.values[2], a3 = this.values[3], a4 = this.values[4], a5 = this.values[5];
    const b0 = other.values[0], b1 = other.values[1], b2 = other.values[2], b3 = other.values[3], b4 = other.values[4], b5 = other.values[5];
    return new _Matrix2D(a0 * b0 + a2 * b1, a1 * b0 + a3 * b1, a0 * b2 + a2 * b3, a1 * b2 + a3 * b3, a0 * b4 + a2 * b5 + a4, a1 * b4 + a3 * b5 + a5);
  }
  /**
   * Rotate the matrix by the provided angle. By default, the angle is
   * provided in degrees.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result = a.rotate(90);
   * // => Matrix2D(
   * //     [3, 4],
   * //     [-1, -2],
   * //     [5, 6],
   * //   )
   *
   * // Provide the angle in radians
   * const result = a.rotate(Math.PI * 0.5, true);
   * // => Matrix2D(
   * //     [3, 4],
   * //     [-1, -2],
   * //     [5, 6],
   * //   )
   * ```
   *
   * @param angle - The angle by which to rotate the matrix.
   * @param degrees - Whether the angle is provided in degrees.
   */
  rotate(angle, degrees = true) {
    if (degrees) {
      angle *= DEG2RAD;
    }
    const a0 = this.values[0], a1 = this.values[1], a2 = this.values[2], a3 = this.values[3], a4 = this.values[4], a5 = this.values[5];
    const s = Math.sin(angle);
    const c2 = Math.cos(angle);
    return new _Matrix2D(a0 * c2 + a2 * s, a1 * c2 + a3 * s, a0 * -s + a2 * c2, a1 * -s + a3 * c2, a4, a5);
  }
  /**
   * Scale the x and y component vectors of the matrix.
   *
   * @remarks
   * If `vec` is provided as a vector, the x and y component vectors of the
   * matrix will be scaled by the x and y parts of the vector, respectively.
   *
   * If `vec` is provided as a scalar, the x and y component vectors will be
   * scaled uniformly by this factor.
   *
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.scale([2, 3]);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [9, 12],
   * //      [5, 6],
   * //    )
   *
   * const result2 = matrix.scale(2);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [6, 8],
   * //      [5, 6],
   * //    )
   * ```
   *
   * @param vec - The factor by which to scale the matrix
   */
  scale(vec) {
    const v = new Vector2(vec);
    return new _Matrix2D(this.values[0] * v.x, this.values[1] * v.x, this.values[2] * v.y, this.values[3] * v.y, this.values[4], this.values[5]);
  }
  /**
   * Multiply each value of the matrix by a scalar.
   *
   * * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.mulScalar(2);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [6, 8],
   * //      [10, 12],
   * //    )
   * ```
   *
   * @param s - The value by which to scale each term
   */
  mulScalar(s) {
    return new _Matrix2D(this.values[0] * s, this.values[1] * s, this.values[2] * s, this.values[3] * s, this.values[4] * s, this.values[5] * s);
  }
  /**
   * Translate the matrix by the dimensions of the provided vector.
   *
   * @remarks
   * If `vec` is provided as a scalar, matrix will be translated uniformly
   * by this factor.
   *
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.translate([2, 3]);
   * // => new Matrix2D(
   * //      [1, 2],
   * //      [3, 4],
   * //      [16, 22],
   * //    )
   *
   * const result2 = matrix.translate(2);
   * // => new Matrix2D(
   * //      [1, 2],
   * //      [3, 4],
   * //      [13, 18],
   * //    )
   * ```
   *
   * @param vec - The vector by which to translate the matrix
   */
  translate(vec) {
    const v = new Vector2(vec);
    return new _Matrix2D(this.values[0], this.values[1], this.values[2], this.values[3], this.values[0] * v.x + this.values[2] * v.y + this.values[4], this.values[1] * v.x + this.values[3] * v.y + this.values[5]);
  }
  /**
   * Add the provided matrix to this matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   * const a = new Matrix2D(
   *   [7, 8],
   *   [9, 10],
   *   [11, 12],
   * );
   *
   * const result = a.add(b);
   * // => Matrix2D(
   * //      [8, 10],
   * //      [12, 14],
   * //      [16, 18],
   * //    )
   * ```
   *
   * @param other - The matrix to add
   */
  add(other) {
    return new _Matrix2D(this.values[0] + other.values[0], this.values[1] + other.values[1], this.values[2] + other.values[2], this.values[3] + other.values[3], this.values[4] + other.values[4], this.values[5] + other.values[5]);
  }
  /**
   * Subtract the provided matrix from this matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   * const a = new Matrix2D(
   *   [7, 8],
   *   [9, 10],
   *   [11, 12],
   * );
   *
   * const result = a.sub(b);
   * // => Matrix2D(
   * //      [-6, -6],
   * //      [-6, -6],
   * //      [-6, -6],
   * //    )
   * ```
   *
   * @param other - The matrix to subract
   */
  sub(other) {
    return new _Matrix2D(this.values[0] - other.values[0], this.values[1] - other.values[1], this.values[2] - other.values[2], this.values[3] - other.values[3], this.values[4] - other.values[4], this.values[5] - other.values[5]);
  }
  toSymbol() {
    return _Matrix2D.symbol;
  }
  toUniform(gl, location) {
    gl.uniformMatrix3fv(location, false, [
      this.values[0],
      this.values[1],
      0,
      this.values[2],
      this.values[3],
      0,
      this.values[4],
      this.values[5],
      1
    ]);
  }
  equals(other, threshold = EPSILON) {
    return Math.abs(this.values[0] - other.values[0]) <= threshold + Number.EPSILON && Math.abs(this.values[1] - other.values[1]) <= threshold + Number.EPSILON && Math.abs(this.values[2] - other.values[2]) <= threshold + Number.EPSILON && Math.abs(this.values[3] - other.values[3]) <= threshold + Number.EPSILON && Math.abs(this.values[4] - other.values[4]) <= threshold + Number.EPSILON && Math.abs(this.values[5] - other.values[5]) <= threshold + Number.EPSILON;
  }
  exactlyEquals(other) {
    return this.values[0] === other.values[0] && this.values[1] === other.values[1] && this.values[2] === other.values[2] && this.values[3] === other.values[3] && this.values[4] === other.values[4] && this.values[5] === other.values[5];
  }
};
Matrix2D.symbol = Symbol.for("@motion-canvas/core/types/Matrix2D");
Matrix2D.identity = new Matrix2D(1, 0, 0, 1, 0, 0);
Matrix2D.zero = new Matrix2D(0, 0, 0, 0, 0, 0);

// node_modules/@motion-canvas/core/lib/types/Origin.js
var Center;
(function(Center2) {
  Center2[Center2["Vertical"] = 1] = "Vertical";
  Center2[Center2["Horizontal"] = 2] = "Horizontal";
})(Center || (Center = {}));
var Direction;
(function(Direction2) {
  Direction2[Direction2["Top"] = 4] = "Top";
  Direction2[Direction2["Bottom"] = 8] = "Bottom";
  Direction2[Direction2["Left"] = 16] = "Left";
  Direction2[Direction2["Right"] = 32] = "Right";
})(Direction || (Direction = {}));
var Origin;
(function(Origin2) {
  Origin2[Origin2["Middle"] = 3] = "Middle";
  Origin2[Origin2["Top"] = 5] = "Top";
  Origin2[Origin2["Bottom"] = 9] = "Bottom";
  Origin2[Origin2["Left"] = 18] = "Left";
  Origin2[Origin2["Right"] = 34] = "Right";
  Origin2[Origin2["TopLeft"] = 20] = "TopLeft";
  Origin2[Origin2["TopRight"] = 36] = "TopRight";
  Origin2[Origin2["BottomLeft"] = 24] = "BottomLeft";
  Origin2[Origin2["BottomRight"] = 40] = "BottomRight";
})(Origin || (Origin = {}));

// node_modules/@motion-canvas/core/lib/types/Vector.js
var Vector2 = class _Vector2 {
  static createSignal(initial, interpolation = _Vector2.lerp, owner) {
    return new Vector2SignalContext(["x", "y"], (value) => new _Vector2(value), initial, interpolation, owner).toSignal();
  }
  static lerp(from, to, value) {
    let valueX;
    let valueY;
    if (typeof value === "number") {
      valueX = valueY = value;
    } else {
      valueX = value.x;
      valueY = value.y;
    }
    return new _Vector2(map(from.x, to.x, valueX), map(from.y, to.y, valueY));
  }
  static arcLerp(from, to, value, reverse = false, ratio) {
    ratio ?? (ratio = from.sub(to).ctg);
    return _Vector2.lerp(from, to, arcLerp(value, reverse, ratio));
  }
  static createArcLerp(reverse, ratio) {
    return (from, to, value) => _Vector2.arcLerp(from, to, value, reverse, ratio);
  }
  /**
   * Interpolates between two vectors on the polar plane by interpolating
   * the angles and magnitudes of the vectors individually.
   *
   * @param from - The starting vector.
   * @param to - The target vector.
   * @param value - The t-value of the interpolation.
   * @param counterclockwise - Whether the vector should get rotated
   *                           counterclockwise. Defaults to `false`.
   * @param origin - The center of rotation. Defaults to the origin.
   *
   * @remarks
   * This function is useful when used in conjunction with {@link rotate} to
   * animate an object's position on a circular arc (see examples).
   *
   * @example
   * Animating an object in a circle around the origin
   * ```tsx
   * circle().position(
   *   circle().position().rotate(180),
   *   1,
   *   easeInOutCubic,
   *   Vector2.polarLerp
   * );
   * ```
   * @example
   * Rotating an object around the point `[-200, 100]`
   * ```ts
   * circle().position(
   *   circle().position().rotate(180, [-200, 100]),
   *   1,
   *   easeInOutCubic,
   *   Vector2.createPolarLerp(false, [-200, 100]),
   * );
   * ```
   * @example
   * Rotating an object counterclockwise around the origin
   * ```ts
   * circle().position(
   *   circle().position().rotate(180),
   *   1,
   *   easeInOutCubic,
   *   Vector2.createPolarLerp(true),
   * );
   * ```
   */
  static polarLerp(from, to, value, counterclockwise = false, origin = _Vector2.zero) {
    from = from.sub(origin);
    to = to.sub(origin);
    const fromAngle = from.degrees;
    let toAngle = to.degrees;
    const isCounterclockwise = fromAngle > toAngle;
    if (isCounterclockwise !== counterclockwise) {
      toAngle = toAngle + (counterclockwise ? -360 : 360);
    }
    const angle = map(fromAngle, toAngle, value) * DEG2RAD;
    const magnitude = map(from.magnitude, to.magnitude, value);
    return new _Vector2(magnitude * Math.cos(angle) + origin.x, magnitude * Math.sin(angle) + origin.y);
  }
  /**
   * Helper function to create a {@link Vector2.polarLerp} interpolation
   * function with additional parameters.
   *
   * @param counterclockwise - Whether the point should get rotated
   *                           counterclockwise.
   * @param center - The center of rotation. Defaults to the origin.
   */
  static createPolarLerp(counterclockwise = false, center = _Vector2.zero) {
    return (from, to, value) => _Vector2.polarLerp(from, to, value, counterclockwise, new _Vector2(center));
  }
  static fromOrigin(origin) {
    const position = new _Vector2();
    if (origin === Origin.Middle) {
      return position;
    }
    if (origin & Direction.Left) {
      position.x = -1;
    } else if (origin & Direction.Right) {
      position.x = 1;
    }
    if (origin & Direction.Top) {
      position.y = -1;
    } else if (origin & Direction.Bottom) {
      position.y = 1;
    }
    return position;
  }
  static fromScalar(value) {
    return new _Vector2(value, value);
  }
  static fromRadians(radians) {
    return new _Vector2(Math.cos(radians), Math.sin(radians));
  }
  static fromDegrees(degrees) {
    return _Vector2.fromRadians(degrees * DEG2RAD);
  }
  /**
   * Return the angle in radians between the vector described by x and y and the
   * positive x-axis.
   *
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   */
  static radians(x, y) {
    return Math.atan2(y, x);
  }
  /**
   * Return the angle in degrees between the vector described by x and y and the
   * positive x-axis.
   *
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   *
   * @remarks
   * The returned angle will be between -180 and 180 degrees.
   */
  static degrees(x, y) {
    return _Vector2.radians(x, y) * RAD2DEG;
  }
  static magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
  }
  static squaredMagnitude(x, y) {
    return x * x + y * y;
  }
  static angleBetween(u, v) {
    return Math.acos(clamp(-1, 1, u.dot(v) / (u.magnitude * v.magnitude))) * (u.cross(v) >= 0 ? 1 : -1);
  }
  get width() {
    return this.x;
  }
  set width(value) {
    this.x = value;
  }
  get height() {
    return this.y;
  }
  set height(value) {
    this.y = value;
  }
  get magnitude() {
    return _Vector2.magnitude(this.x, this.y);
  }
  get squaredMagnitude() {
    return _Vector2.squaredMagnitude(this.x, this.y);
  }
  get normalized() {
    return this.scale(1 / _Vector2.magnitude(this.x, this.y));
  }
  get safe() {
    return new _Vector2(isNaN(this.x) ? 0 : this.x, isNaN(this.y) ? 0 : this.y);
  }
  get flipped() {
    return new _Vector2(-this.x, -this.y);
  }
  get floored() {
    return new _Vector2(Math.floor(this.x), Math.floor(this.y));
  }
  get rounded() {
    return new _Vector2(Math.round(this.x), Math.round(this.y));
  }
  get ceiled() {
    return new _Vector2(Math.ceil(this.x), Math.ceil(this.y));
  }
  get perpendicular() {
    return new _Vector2(this.y, -this.x);
  }
  /**
   * Return the angle in radians between the vector and the positive x-axis.
   */
  get radians() {
    return _Vector2.radians(this.x, this.y);
  }
  /**
   * Return the angle in degrees between the vector and the positive x-axis.
   *
   * @remarks
   * The returned angle will be between -180 and 180 degrees.
   */
  get degrees() {
    return _Vector2.degrees(this.x, this.y);
  }
  get ctg() {
    return this.x / this.y;
  }
  constructor(one, two) {
    this.x = 0;
    this.y = 0;
    if (one === void 0 || one === null) {
      return;
    }
    if (typeof one !== "object") {
      this.x = one;
      this.y = two ?? one;
      return;
    }
    if (Array.isArray(one)) {
      this.x = one[0];
      this.y = one[1];
      return;
    }
    if ("width" in one) {
      this.x = one.width;
      this.y = one.height;
      return;
    }
    this.x = one.x;
    this.y = one.y;
  }
  lerp(to, value) {
    return _Vector2.lerp(this, to, value);
  }
  getOriginOffset(origin) {
    const offset = _Vector2.fromOrigin(origin);
    offset.x *= this.x / 2;
    offset.y *= this.y / 2;
    return offset;
  }
  scale(value) {
    return new _Vector2(this.x * value, this.y * value);
  }
  transformAsPoint(matrix) {
    const m = new Matrix2D(matrix);
    return new _Vector2(this.x * m.scaleX + this.y * m.skewY + m.translateX, this.x * m.skewX + this.y * m.scaleY + m.translateY);
  }
  transform(matrix) {
    const m = new Matrix2D(matrix);
    return new _Vector2(this.x * m.scaleX + this.y * m.skewY, this.x * m.skewX + this.y * m.scaleY);
  }
  mul(possibleVector) {
    const vector = new _Vector2(possibleVector);
    return new _Vector2(this.x * vector.x, this.y * vector.y);
  }
  div(possibleVector) {
    const vector = new _Vector2(possibleVector);
    return new _Vector2(this.x / vector.x, this.y / vector.y);
  }
  add(possibleVector) {
    const vector = new _Vector2(possibleVector);
    return new _Vector2(this.x + vector.x, this.y + vector.y);
  }
  sub(possibleVector) {
    const vector = new _Vector2(possibleVector);
    return new _Vector2(this.x - vector.x, this.y - vector.y);
  }
  dot(possibleVector) {
    const vector = new _Vector2(possibleVector);
    return this.x * vector.x + this.y * vector.y;
  }
  cross(possibleVector) {
    const vector = new _Vector2(possibleVector);
    return this.x * vector.y - this.y * vector.x;
  }
  mod(possibleVector) {
    const vector = new _Vector2(possibleVector);
    return new _Vector2(this.x % vector.x, this.y % vector.y);
  }
  /**
   * Rotate the vector around a point by the provided angle.
   *
   * @param angle - The angle by which to rotate in degrees.
   * @param center - The center of rotation. Defaults to the origin.
   */
  rotate(angle, center = _Vector2.zero) {
    const originVector = new _Vector2(center);
    const matrix = Matrix2D.fromTranslation(originVector).rotate(angle).translate(originVector.flipped);
    return this.transformAsPoint(matrix);
  }
  addX(value) {
    return new _Vector2(this.x + value, this.y);
  }
  addY(value) {
    return new _Vector2(this.x, this.y + value);
  }
  /**
   * Transform the components of the vector.
   *
   * @example
   * Raise the components to the power of 2.
   * ```ts
   * const vector = new Vector2(2, 3);
   * const result = vector.transform(value => value ** 2);
   * ```
   *
   * @param callback - A callback to apply to each component.
   */
  map(callback) {
    return new _Vector2(callback(this.x, 0), callback(this.y, 1));
  }
  toSymbol() {
    return _Vector2.symbol;
  }
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
  toArray() {
    return [this.x, this.y];
  }
  toUniform(gl, location) {
    gl.uniform2f(location, this.x, this.y);
  }
  serialize() {
    return { x: this.x, y: this.y };
  }
  /**
   * Check if two vectors are exactly equal to each other.
   *
   * @remarks
   * If you need to compensate for floating point inaccuracies, use the
   * {@link equals} method, instead.
   *
   * @param other - The vector to compare.
   */
  exactlyEquals(other) {
    return this.x === other.x && this.y === other.y;
  }
  /**
   * Check if two vectors are equal to each other.
   *
   * @remarks
   * This method allows passing an allowed error margin when comparing vectors
   * to compensate for floating point inaccuracies. To check if two vectors are
   * exactly equal, use the {@link exactlyEquals} method, instead.
   *
   * @param other - The vector to compare.
   * @param threshold - The allowed error threshold when comparing the vectors.
   */
  equals(other, threshold = EPSILON) {
    return Math.abs(this.x - other.x) <= threshold + Number.EPSILON && Math.abs(this.y - other.y) <= threshold + Number.EPSILON;
  }
  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }
};
Vector2.symbol = Symbol.for("@motion-canvas/core/types/Vector2");
Vector2.zero = new Vector2();
Vector2.one = new Vector2(1, 1);
Vector2.right = new Vector2(1, 0);
Vector2.left = new Vector2(-1, 0);
Vector2.up = new Vector2(0, 1);
Vector2.down = new Vector2(0, -1);
Vector2.top = new Vector2(0, -1);
Vector2.bottom = new Vector2(0, 1);
Vector2.topLeft = new Vector2(-1, -1);
Vector2.topRight = new Vector2(1, -1);
Vector2.bottomLeft = new Vector2(-1, 1);
Vector2.bottomRight = new Vector2(1, 1);

// node_modules/@motion-canvas/player/dist/main.js
var g = Object.defineProperty;
var p = (o, s, t) => s in o ? g(o, s, { enumerable: true, configurable: true, writable: true, value: t }) : o[s] = t;
var e = (o, s, t) => (p(o, typeof s != "symbol" ? s + "" : s, t), t);
var f = `.initial{display:none}.state-initial .initial{display:block}.loading{display:none}.state-loading .loading{display:block}.ready{display:none}.state-ready .ready{display:block}.error{display:none}.state-error .error{display:block}:host{position:relative;display:block}.overlay{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;opacity:0;background-color:#0000008a;transition:opacity .1s}.overlay.state-ready:not(.auto){cursor:pointer}.overlay.playing:not(.hover):hover{cursor:none}.overlay.hover,.overlay.state-ready:focus-within,.overlay.state-ready:not(.playing){opacity:1}.overlay.hover .button,.overlay.state-ready:focus-within .button,.overlay.state-ready:not(.playing) .button{scale:1;transition:scale .1s ease-out}.overlay.state-loading,.overlay.state-error{opacity:1;transition:opacity 1s}.overlay.state-ready.auto{opacity:0}.button{width:50%;max-width:96px;aspect-ratio:1;scale:.5;transition:scale .1s ease-in,opacity .1s;background-color:transparent;border:none;background-size:100% 100%;background-repeat:no-repeat;opacity:.54;cursor:inherit;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bS0yIDE0LjV2LTlsNiA0LjUtNiA0LjV6Ii8+PC9zdmc+)}.playing .button{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNmZmZmZmYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zy8+PHBhdGggZD0iTTEyLDJDNi40OCwyLDIsNi40OCwyLDEyczQuNDgsMTAsMTAsMTBzMTAtNC40OCwxMC0xMFMxNy41MiwyLDEyLDJ6IE0xMSwxNkg5VjhoMlYxNnogTTE1LDE2aC0yVjhoMlYxNnoiLz48L2c+PC9zdmc+)}.button:focus,.overlay:hover .button{opacity:.87}.auto .button{display:none}.canvas{width:100%;display:block;opacity:0;transition:opacity .1s}.canvas.state-ready{opacity:1}.message{font-family:JetBrains Mono,sans-serif;text-align:center;font-size:20px;padding:8px 16px;margin:16px;border-radius:4px;color:#fff9;background-color:#000000de}.loader{width:50%;max-width:96px;display:none;rotate:-90deg;animation:stroke 2s cubic-bezier(.5,0,.5,1) infinite,rotate 2s linear infinite}@keyframes stroke{0%{stroke-dasharray:5.6548667765px 50.8938009883px;stroke-dashoffset:2.8274333882px}50%{stroke-dasharray:50.8938009883px 5.6548667765px;stroke-dashoffset:-2.8274333882px}to{stroke-dasharray:5.6548667765px 50.8938009883px;stroke-dashoffset:-53.7212343766px}}@keyframes rotate{0%{rotate:-110deg}to{rotate:250deg}}
`;
var I = `<div class="overlay" part="overlay">
  <button
    part="play-button"
    title="Play / Pause"
    class="button ready"
    tabindex="0"
  ></button>
  <div part="message" class="message error">
    An error occurred while loading the animation.
  </div>
  <svg
    part="loader"
    class="loader loading"
    viewBox="0 0 24 24"
    stroke="#ffffff"
    stroke-width="2"
    fill="transparent"
  >
    <circle cx="12" cy="12" r="9" />
  </svg>
</div>
`;
var M = `<style>${f}</style>${I}`;
var c = "motion-canvas-player";
var w = class extends HTMLElement {
  constructor() {
    super();
    e(this, "root");
    e(this, "canvas");
    e(this, "overlay");
    e(this, "button");
    e(this, "state", "initial");
    e(this, "project", null);
    e(this, "player", null);
    e(this, "defaultSettings");
    e(this, "abortController", null);
    e(this, "mouseMoveId", null);
    e(this, "finished", false);
    e(this, "playing", false);
    e(this, "connected", false);
    e(this, "stage", new Stage());
    e(this, "handleMouseMove", () => {
      this.mouseMoveId && clearTimeout(this.mouseMoveId), this.hover && !this.playing && this.setPlaying(true), this.mouseMoveId = window.setTimeout(() => {
        this.mouseMoveId = null, this.updateClass();
      }, 2e3), this.updateClass();
    });
    e(this, "handleMouseLeave", () => {
      this.hover && this.setPlaying(false), this.mouseMoveId && (clearTimeout(this.mouseMoveId), this.mouseMoveId = null, this.updateClass());
    });
    e(this, "handleMouseDown", (t) => {
      t.preventDefault();
    });
    e(this, "handleClick", () => {
      this.auto || (this.handleMouseMove(), this.setPlaying(!this.playing), this.button.animate(
        [
          { scale: "0.9" },
          {
            scale: "1",
            easing: "ease-out"
          }
        ],
        { duration: 200 }
      ));
    });
    e(this, "render", async () => {
      this.player && await this.stage.render(
        this.player.playback.currentScene,
        this.player.playback.previousScene
      );
    });
    this.root = this.attachShadow({ mode: "open" }), this.root.innerHTML = M, this.overlay = this.root.querySelector(".overlay"), this.button = this.root.querySelector(".button"), this.canvas = this.stage.finalBuffer, this.canvas.classList.add("canvas"), this.root.prepend(this.canvas), this.overlay.addEventListener("click", this.handleClick), this.overlay.addEventListener("mousemove", this.handleMouseMove), this.overlay.addEventListener("mouseleave", this.handleMouseLeave), this.button.addEventListener("mousedown", this.handleMouseDown), this.setState(
      "initial"
      /* Initial */
    );
  }
  static get observedAttributes() {
    return ["src", "quality", "width", "height", "auto", "variables"];
  }
  get auto() {
    return !!this.getAttribute("auto");
  }
  get hover() {
    return this.getAttribute("auto") === "hover";
  }
  get quality() {
    const t = this.getAttribute("quality");
    return t ? parseFloat(t) : this.defaultSettings.resolutionScale;
  }
  get width() {
    const t = this.getAttribute("width");
    return t ? parseFloat(t) : this.defaultSettings.size.width;
  }
  get height() {
    const t = this.getAttribute("height");
    return t ? parseFloat(t) : this.defaultSettings.size.height;
  }
  get variables() {
    try {
      const t = this.getAttribute("variables");
      return t ? JSON.parse(t) : {};
    } catch {
      return this.project.logger.warn("Project variables could not be parsed."), {};
    }
  }
  setState(t) {
    this.state = t, this.setPlaying(this.playing);
  }
  setPlaying(t) {
    var a, i;
    this.state === "ready" && (t || this.auto && !this.hover) ? ((a = this.player) == null || a.togglePlayback(true), this.playing = true) : ((i = this.player) == null || i.togglePlayback(false), this.playing = false), this.updateClass();
  }
  updateClass() {
    this.overlay.className = `overlay state-${this.state}`, this.canvas.className = `canvas state-${this.state}`, this.overlay.classList.toggle("playing", this.playing), this.overlay.classList.toggle("auto", this.auto), this.overlay.classList.toggle("hover", this.mouseMoveId !== null), this.connected && (this.mouseMoveId !== null || !this.playing ? this.dataset.overlay = "" : delete this.dataset.overlay);
  }
  async updateSource(t) {
    var r, l, h, d;
    this.setState(
      "initial"
      /* Initial */
    ), (r = this.abortController) == null || r.abort(), this.abortController = new AbortController();
    let a;
    try {
      const n = import(
        /* webpackIgnore: true */
        /* @vite-ignore */
        t
      ), y = new Promise((u) => setTimeout(u, 200));
      await Promise.any([y, n]), this.setState(
        "loading"
        /* Loading */
      ), a = (await n).default;
    } catch (n) {
      console.error(n), this.setState(
        "error"
        /* Error */
      );
      return;
    }
    this.defaultSettings = a.meta.getFullRenderingSettings();
    const i = new Player(a);
    i.setVariables(this.variables), this.finished = false, (l = this.player) == null || l.onRender.unsubscribe(this.render), (h = this.player) == null || h.togglePlayback(false), (d = this.player) == null || d.deactivate(), this.project = a, this.player = i, this.updateSettings(), this.player.onRender.subscribe(this.render), this.player.togglePlayback(this.playing), this.setState(
      "ready"
      /* Ready */
    );
  }
  attributeChangedCallback(t, a, i) {
    var r;
    switch (t) {
      case "auto":
        this.setPlaying(this.playing);
        break;
      case "src":
        this.updateSource(i);
        break;
      case "quality":
      case "width":
      case "height":
        this.updateSettings();
        break;
      case "variables":
        (r = this.player) == null || r.setVariables(this.variables);
    }
  }
  disconnectedCallback() {
    var t, a;
    this.connected = false, (t = this.player) == null || t.deactivate(), (a = this.player) == null || a.onRender.unsubscribe(this.render);
  }
  connectedCallback() {
    var t, a;
    this.connected = true, (t = this.player) == null || t.activate(), (a = this.player) == null || a.onRender.subscribe(this.render);
  }
  updateSettings() {
    const t = {
      ...this.defaultSettings,
      size: new Vector2(this.width, this.height),
      resolutionScale: this.quality
    };
    this.stage.configure(t), this.player.configure(t);
  }
};
customElements.get(c) || customElements.define(c, w);
