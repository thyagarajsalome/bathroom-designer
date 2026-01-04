import "@testing-library/jest-dom";
import { vi } from "vitest";

// 1. Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 2. Mock URL.createObjectURL
if (typeof window.URL.createObjectURL === "undefined") {
  window.URL.createObjectURL = vi.fn();
}

// 3. Robust WebGL Mock
HTMLCanvasElement.prototype.getContext = vi.fn((type) => {
  if (type === "webgl" || type === "webgl2") {
    return {
      // Essentials
      canvas: document.createElement("canvas"),

      // FIX: Handle specific parameters to return strings instead of 0
      getParameter: vi.fn((param) => {
        // 7938 = VERSION, 35724 = SHADING_LANGUAGE_VERSION
        // 7936 = VENDOR, 7937 = RENDERER
        if (param === 7938) return "WebGL 1.0";
        if (param === 35724) return "WebGL GLSL ES 1.0";
        if (param === 7936) return "WebKit";
        if (param === 7937) return "WebKit WebGL";
        return 0;
      }),

      getExtension: vi.fn().mockReturnValue({
        EXT_texture_filter_anisotropic: {},
      }),

      // Shaders & Programs
      createShader: vi.fn(),
      shaderSource: vi.fn(),
      compileShader: vi.fn(),
      getShaderParameter: vi.fn().mockReturnValue(true),
      createProgram: vi.fn(),
      attachShader: vi.fn(),
      linkProgram: vi.fn(),
      getProgramParameter: vi.fn().mockReturnValue(true),
      useProgram: vi.fn(),

      // Precision (Required for Three.js)
      getShaderPrecisionFormat: vi.fn().mockReturnValue({
        rangeMin: 1,
        rangeMax: 1,
        precision: 1,
      }),

      // Buffers & Drawing
      createBuffer: vi.fn(),
      bindBuffer: vi.fn(),
      bufferData: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      vertexAttribPointer: vi.fn(),
      drawArrays: vi.fn(),
      drawElements: vi.fn(),

      // Textures
      createTexture: vi.fn(),
      bindTexture: vi.fn(),
      texParameteri: vi.fn(),
      texImage2D: vi.fn(),

      // Misc
      clearColor: vi.fn(),
      clear: vi.fn(),
      enable: vi.fn(),
      disable: vi.fn(),
      viewport: vi.fn(),
      getUniformLocation: vi.fn(),
      uniformMatrix4fv: vi.fn(),
    } as unknown as WebGLRenderingContext;
  }
  return null;
}) as any;
