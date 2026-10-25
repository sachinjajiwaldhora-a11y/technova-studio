(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/track/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TrackPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modals$2f$StatusTrackerModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/modals/StatusTrackerModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$canvas$2f$Scene3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/canvas/Scene3D.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-client] (ecmascript) <export default as ArrowLeft>");
;
var _s = __turbopack_context__.k.signature();
// FILE PATH: app/track/page.tsx
'use client';
;
;
;
;
;
function TrackContent() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const initialCode = searchParams.get('code') || searchParams.get('id') || '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "relative min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$canvas$2f$Scene3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/track/page.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-6 left-6 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.push('/'),
                    className: "flex items-center space-x-2 border border-white/20 bg-black/60 px-4 py-2 font-mono text-xs text-zinc-300 hover:text-white hover:border-red-500 transition-colors hud-clip",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            className: "w-3.5 h-3.5"
                        }, void 0, false, {
                            fileName: "[project]/app/track/page.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "RETURN TO HOME MATRIX"
                        }, void 0, false, {
                            fileName: "[project]/app/track/page.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/track/page.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/track/page.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modals$2f$StatusTrackerModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: true,
                onClose: ()=>router.push('/'),
                initialCode: initialCode
            }, void 0, false, {
                fileName: "[project]/app/track/page.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/track/page.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_s(TrackContent, "+JhyKI/TCt/o3i650dm/GAytAZk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TrackContent;
function TrackPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-black text-white p-8 font-mono text-xs",
            children: "INITIALIZING SPRINT TELEMETRY..."
        }, void 0, false, {
            fileName: "[project]/app/track/page.tsx",
            lineNumber: 39,
            columnNumber: 25
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrackContent, {}, void 0, false, {
            fileName: "[project]/app/track/page.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/track/page.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c1 = TrackPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "TrackContent");
__turbopack_context__.k.register(_c1, "TrackPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/canvas/Scene3D.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Scene3D
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-e51d7528.esm.js [app-client] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// FILE PATH: components/canvas/Scene3D.tsx
'use client';
;
;
;
function HolographicNexusCore() {
    _s();
    const outerGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const innerCore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ring1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ring2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])({
        "HolographicNexusCore.useFrame": (state, delta)=>{
            if (outerGroup.current) {
                outerGroup.current.rotation.y += delta * 0.18;
                outerGroup.current.rotation.x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(outerGroup.current.rotation.x, state.mouse.y * 0.35, 0.05);
                outerGroup.current.rotation.z = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(outerGroup.current.rotation.z, -state.mouse.x * 0.35, 0.05);
            }
            if (innerCore.current) {
                innerCore.current.rotation.y -= delta * 0.45;
                innerCore.current.rotation.z += delta * 0.25;
            }
            if (ring1.current) {
                ring1.current.rotation.x += delta * 0.3;
            }
            if (ring2.current) {
                ring2.current.rotation.y -= delta * 0.4;
            }
        }
    }["HolographicNexusCore.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: outerGroup,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("icosahedronGeometry", {
                        args: [
                            2.25,
                            2
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#dc2626",
                        wireframe: true,
                        transparent: true,
                        opacity: 0.28,
                        emissive: "#dc2626",
                        emissiveIntensity: 0.4
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/canvas/Scene3D.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: innerCore,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("octahedronGeometry", {
                        args: [
                            1.35,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#ffffff",
                        wireframe: true,
                        transparent: true,
                        opacity: 0.18
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/canvas/Scene3D.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("icosahedronGeometry", {
                        args: [
                            0.55,
                            0
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#ef4444",
                        emissive: "#dc2626",
                        emissiveIntensity: 1.6,
                        wireframe: true
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/canvas/Scene3D.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: ring1,
                rotation: [
                    Math.PI / 3,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                        args: [
                            2.85,
                            0.008,
                            16,
                            120
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#dc2626",
                        transparent: true,
                        opacity: 0.55
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/canvas/Scene3D.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: ring2,
                rotation: [
                    -Math.PI / 4,
                    Math.PI / 6,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                        args: [
                            3.2,
                            0.005,
                            16,
                            120
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#ffffff",
                        transparent: true,
                        opacity: 0.2
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/canvas/Scene3D.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/canvas/Scene3D.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(HolographicNexusCore, "usRcvHhZPnB06IqOk2WYgNtfSGw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$e51d7528$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"]
    ];
});
_c = HolographicNexusCore;
function Scene3D() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-0 pointer-events-none overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -top-32 -left-32 w-[38rem] h-[38rem] rounded-full bg-red-600/15 blur-[150px] animate-pulse"
            }, void 0, false, {
                fileName: "[project]/components/canvas/Scene3D.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-[28%] -right-24 w-[32rem] h-[44rem] rounded-full bg-red-700/12 blur-[170px]"
            }, void 0, false, {
                fileName: "[project]/components/canvas/Scene3D.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -bottom-40 left-[22%] w-[45rem] h-[28rem] rounded-full bg-red-900/20 blur-[160px]"
            }, void 0, false, {
                fileName: "[project]/components/canvas/Scene3D.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
                camera: {
                    position: [
                        0,
                        0,
                        6.5
                    ],
                    fov: 45
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                        intensity: 0.6
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                        position: [
                            5,
                            5,
                            5
                        ],
                        intensity: 2.5,
                        color: "#dc2626"
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                        position: [
                            -5,
                            -5,
                            -3
                        ],
                        intensity: 1.2,
                        color: "#ffffff"
                    }, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HolographicNexusCore, {}, void 0, false, {
                        fileName: "[project]/components/canvas/Scene3D.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/canvas/Scene3D.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030303_90%)]"
            }, void 0, false, {
                fileName: "[project]/components/canvas/Scene3D.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/canvas/Scene3D.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_c1 = Scene3D;
var _c, _c1;
__turbopack_context__.k.register(_c, "HolographicNexusCore");
__turbopack_context__.k.register(_c1, "Scene3D");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/modals/StatusTrackerModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatusTrackerModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.mjs [app-client] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.mjs [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square.mjs [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// FILE PATH: components/modals/StatusTrackerModal.tsx
'use client';
;
;
;
function StatusTrackerModal({ isOpen, onClose, initialCode = '' }) {
    _s();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialCode);
    const [searched, setSearched] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [matchedInquiry, setMatchedInquiry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [matchedProject, setMatchedProject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cachedSession, setCachedSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load initial code or stored session on open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StatusTrackerModal.useEffect": ()=>{
            if (isOpen) {
                if ("TURBOPACK compile-time truthy", 1) {
                    try {
                        const raw = localStorage.getItem('technova_client_session');
                        if (raw) {
                            const parsed = JSON.parse(raw);
                            setCachedSession(parsed);
                            if (!initialCode && parsed.sessionCode) {
                                performSearch(parsed.sessionCode);
                                return;
                            }
                        }
                    } catch  {
                    // ignore
                    }
                }
                if (initialCode) {
                    setSearchQuery(initialCode);
                    performSearch(initialCode);
                }
            }
        }
    }["StatusTrackerModal.useEffect"], [
        isOpen,
        initialCode
    ]);
    if (!isOpen) return null;
    function performSearch(queryToUse) {
        const q = (queryToUse ?? searchQuery).trim().toLowerCase();
        if (!q) return;
        setSearched(true);
        const inquiries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].INQUIRIES, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEED_INQUIRIES"]);
        const projects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].PROJECTS, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEED_PROJECTS"]);
        // 1. Try matching inquiry by trackingCode, email, or id
        const foundInq = inquiries.find((i)=>i.trackingCode && i.trackingCode.toLowerCase() === q || i.id && i.id.toLowerCase() === q || i.email && i.email.toLowerCase() === q);
        // 2. Try matching project by trackingCode, client contact email, or id
        let foundPrj = projects.find((p)=>p.trackingCode && p.trackingCode.toLowerCase() === q || p.clientInfo?.trackingCode && p.clientInfo.trackingCode.toLowerCase() === q || p.id && p.id.toLowerCase() === q || p.clientInfo?.contact && p.clientInfo.contact.toLowerCase() === q);
        // If an inquiry was found and it links to a project, resolve that project
        if (foundInq?.convertedToProjectId && !foundPrj) {
            foundPrj = projects.find((p)=>p.id === foundInq.convertedToProjectId);
        }
        // Vice versa: if project found, check if it maps to an inquiry
        if (foundPrj && !foundInq) {
            const mappedInq = inquiries.find((i)=>i.convertedToProjectId === foundPrj?.id || foundPrj?.trackingCode && i.trackingCode === foundPrj.trackingCode);
            if (mappedInq) setMatchedInquiry(mappedInq);
        }
        setMatchedInquiry(foundInq || null);
        setMatchedProject(foundPrj || null);
    }
    // Calculate life-cycle step
    // 1: INTAKE_RECEIVED, 2: SCOPING, 3: PROPOSAL/LOCK, 4: ACTIVE_DEV, 5: COMPLETED
    let currentStep = 1;
    if (matchedProject) {
        if (matchedProject.status === 'COMPLETED' || matchedProject.status === 'ARCHIVED') {
            currentStep = 5;
        } else if (matchedProject.status === 'REVIEW') {
            currentStep = 5;
        } else if (matchedProject.status === 'ACTIVE') {
            currentStep = 4;
        } else if (matchedProject.status === 'SCOPING') {
            currentStep = 3;
        }
    } else if (matchedInquiry) {
        if (matchedInquiry.status === 'LOCKED_DEAL') {
            currentStep = 3;
        } else if (matchedInquiry.status === 'PROPOSAL_SENT') {
            currentStep = 3;
        } else if (matchedInquiry.status === 'CALL_SCHEDULED') {
            currentStep = 2;
        } else {
            currentStep = 1;
        }
    }
    const projectPct = matchedProject ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectProgress"])(matchedProject) : currentStep * 20;
    const steps = [
        {
            num: '01',
            title: 'TRANSMITTED',
            desc: 'Inquiry Queued in Intake Matrix'
        },
        {
            num: '02',
            title: 'SCOPING & ARCHITECTURE',
            desc: 'Discovery Call & Tech Specs'
        },
        {
            num: '03',
            title: 'PROPOSAL LOCKED',
            desc: 'Sprint Roadmap & Engagement Signed'
        },
        {
            num: '04',
            title: 'ACTIVE DEV BUILD',
            desc: 'Core Engineering & Shader Pass'
        },
        {
            num: '05',
            title: 'DEPLOYED / LIVE',
            desc: 'Final Audit & Production Release'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[8600] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full max-w-2xl border border-red-500/50 bg-[#060606] p-6 sm:p-8 shadow-[0_0_80px_rgba(220,38,38,0.25)] hud-clip my-8 max-h-[92vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                        className: "w-5 h-5"
                    }, void 0, false, {
                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                        lineNumber: 149,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                    lineNumber: 145,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-2 text-red-500 font-mono text-[10px] tracking-[0.25em] uppercase",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                            className: "w-3.5 h-3.5 animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "CLIENT SPRINT RADAR // LIVE TELEMETRY"
                        }, void 0, false, {
                            fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                    lineNumber: 153,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "mt-2 text-2xl font-extrabold tracking-tight text-white uppercase",
                    children: "TRACK INQUIRY & SPRINT PROGRESS"
                }, void 0, false, {
                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1 text-xs text-zinc-400 font-light",
                    children: "Enter your Session Tracking Code or Email to inspect real-time intake status, engineering milestones, and live preview deployments."
                }, void 0, false, {
                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: (e)=>{
                        e.preventDefault();
                        performSearch();
                    },
                    className: "mt-5 space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center border border-white/20 bg-black/80 px-3 py-1.5 focus-within:border-red-500 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "w-4 h-4 text-red-500 shrink-0 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value),
                                    placeholder: "e.g. NV-INQ-1042 or your email address",
                                    className: "w-full bg-transparent font-mono text-xs text-white placeholder-zinc-500 focus:outline-none py-2"
                                }, void 0, false, {
                                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "shrink-0 font-mono text-[10px] bg-red-600 hover:bg-red-500 text-white px-4 py-2 uppercase tracking-wider transition-colors",
                                    children: "LOCATE"
                                }, void 0, false, {
                                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center gap-2 pt-1 font-mono text-[9px] text-zinc-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "QUICK DEMO:"
                                }, void 0, false, {
                                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>{
                                        setSearchQuery('NV-INQ-1042');
                                        performSearch('NV-INQ-1042');
                                    },
                                    className: "border border-red-500/30 bg-red-950/20 px-2 py-0.5 text-red-400 hover:bg-red-600/20 transition-colors",
                                    children: "NV-INQ-1042 (Live Project)"
                                }, void 0, false, {
                                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this),
                                cachedSession?.sessionCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>{
                                        setSearchQuery(cachedSession.sessionCode);
                                        performSearch(cachedSession.sessionCode);
                                    },
                                    className: "border border-cyan-500/30 bg-cyan-950/20 px-2 py-0.5 text-cyan-400 hover:bg-cyan-600/20 transition-colors",
                                    children: [
                                        "LAST SESSION (",
                                        cachedSession.sessionCode,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                    lineNumber: 204,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this),
                searched && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 space-y-6",
                    children: !matchedInquiry && !matchedProject ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-white/10 bg-white/[0.02] p-6 text-center space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "w-8 h-8 text-amber-500 mx-auto"
                            }, void 0, false, {
                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                lineNumber: 223,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-mono text-xs text-white uppercase tracking-wider",
                                children: "NO TRANSMISSION RECORD FOUND"
                            }, void 0, false, {
                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                lineNumber: 224,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-zinc-400 max-w-sm mx-auto",
                                children: [
                                    'No active inquiry or project matched "',
                                    searchQuery,
                                    '". Please verify your tracking code or contact studio operations directly.'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                lineNumber: 227,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                        lineNumber: 222,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-white/15 bg-white/[0.02] p-4 hud-clip",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-[9px] text-red-500 uppercase tracking-widest",
                                                        children: "CLIENT DOSSIER"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-lg font-bold text-white",
                                                        children: matchedInquiry?.company || matchedProject?.clientInfo?.company || 'Confidential Client'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 240,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-zinc-400",
                                                        children: [
                                                            "Lead: ",
                                                            matchedInquiry?.clientName || matchedProject?.clientInfo?.clientName,
                                                            " //",
                                                            ' ',
                                                            matchedInquiry?.email || matchedProject?.clientInfo?.contact
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 243,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 236,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-[9px] text-zinc-500 uppercase tracking-widest block",
                                                        children: "CODE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 249,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-sm font-bold text-red-400",
                                                        children: matchedInquiry?.trackingCode || matchedProject?.trackingCode || searchQuery.toUpperCase()
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 248,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 235,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 font-mono text-[9px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-zinc-500 block",
                                                        children: "SCOPE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 260,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white font-bold truncate block",
                                                        children: matchedInquiry?.scope || matchedProject?.type || 'Custom Engineering'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 259,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-zinc-500 block",
                                                        children: "BUDGET TIER"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 266,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white font-bold block",
                                                        children: matchedInquiry?.budget || matchedProject?.clientInfo?.budget || 'Tier 1'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 267,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 265,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-zinc-500 block",
                                                        children: "SUBMITTED"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 272,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white block",
                                                        children: matchedInquiry?.submittedAt ? new Date(matchedInquiry.submittedAt).toLocaleDateString() : 'Active'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 271,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-zinc-500 block",
                                                        children: "EST. DELIVERY"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-cyan-400 font-bold block",
                                                        children: matchedProject?.dueDate || matchedInquiry?.preferredCallDate || '30 Days'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 279,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 258,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                lineNumber: 234,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-white/10 bg-black/60 p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-[9px] text-zinc-400 uppercase tracking-widest",
                                                children: "PIPELINE LIFECYCLE TRACKER"
                                            }, void 0, false, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 291,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-[10px] text-emerald-400 font-bold",
                                                children: [
                                                    "STAGE 0",
                                                    currentStep,
                                                    " // ",
                                                    steps[currentStep - 1].title
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 294,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 290,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-5 gap-2",
                                        children: steps.map((st, idx)=>{
                                            const stepIndex = idx + 1;
                                            const isComplete = stepIndex < currentStep;
                                            const isCurrent = stepIndex === currentStep;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `border p-2.5 transition-all ${isCurrent ? 'border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : isComplete ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-white/5 bg-white/[0.01] opacity-50'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-mono text-[9px] text-zinc-500 font-bold",
                                                                children: st.num
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                                lineNumber: 317,
                                                                columnNumber: 29
                                                            }, this),
                                                            isComplete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                className: "w-3.5 h-3.5 text-emerald-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                                lineNumber: 321,
                                                                columnNumber: 31
                                                            }, this) : isCurrent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-2 h-2 rounded-full bg-red-500 animate-ping"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 31
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 316,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `font-mono text-[9px] font-bold uppercase leading-tight ${isCurrent ? 'text-white' : isComplete ? 'text-emerald-300' : 'text-zinc-500'}`,
                                                        children: st.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 326,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[8px] text-zinc-400 font-light mt-1 line-clamp-2",
                                                        children: st.desc
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, st.num, true, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 306,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 299,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                lineNumber: 289,
                                columnNumber: 17
                            }, this),
                            matchedProject ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-cyan-500/40 bg-cyan-950/10 p-5 space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center justify-between gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                                        className: "w-4 h-4 text-cyan-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 347,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                        className: "font-mono text-sm font-bold text-white uppercase",
                                                        children: [
                                                            "ACTIVE SPRINT ENGINE: ",
                                                            matchedProject.title
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 348,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 346,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-[9px] border border-cyan-400 bg-cyan-500/20 px-2 py-0.5 text-cyan-300 uppercase",
                                                children: matchedProject.status
                                            }, void 0, false, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 352,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 345,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-zinc-300 font-light leading-relaxed",
                                        children: matchedProject.description
                                    }, void 0, false, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 357,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between font-mono text-[10px] mb-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-zinc-400",
                                                        children: "OVERALL SPRINT COMPLETION"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 364,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `font-bold ${projectPct === 100 ? 'text-emerald-400' : 'text-cyan-400'}`,
                                                        children: [
                                                            projectPct,
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 365,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 363,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/10",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `h-full transition-all duration-700 ease-out ${projectPct === 100 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : projectPct >= 80 ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]' : projectPct >= 50 ? 'bg-amber-400' : 'bg-red-500'}`,
                                                    style: {
                                                        width: `${projectPct}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                    lineNumber: 374,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 373,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 362,
                                        columnNumber: 21
                                    }, this),
                                    matchedProject.milestones && matchedProject.milestones.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-t border-white/10 pt-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-[9px] text-zinc-400 uppercase tracking-widest block mb-2",
                                                children: "VERIFIED MILESTONES"
                                            }, void 0, false, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 392,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                                                children: matchedProject.milestones.map((ms)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `flex items-center space-x-2 text-xs p-2 border ${ms.completed ? 'border-emerald-500/30 bg-emerald-950/20 text-zinc-200' : 'border-white/5 bg-black/40 text-zinc-500'}`,
                                                        children: [
                                                            ms.completed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"], {
                                                                className: "w-3.5 h-3.5 text-emerald-400 shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                                lineNumber: 406,
                                                                columnNumber: 33
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                                                className: "w-3.5 h-3.5 text-zinc-600 shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                                lineNumber: 408,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: ms.completed ? '' : 'line-through opacity-70',
                                                                children: ms.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                                lineNumber: 410,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, ms.id, true, {
                                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                        lineNumber: 397,
                                                        columnNumber: 29
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 395,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 391,
                                        columnNumber: 23
                                    }, this),
                                    matchedProject.liveUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: matchedProject.liveUrl,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "inline-flex items-center space-x-2 border border-cyan-400 bg-cyan-600/30 px-5 py-2.5 font-mono text-xs text-white uppercase hover:bg-cyan-600 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                    lineNumber: 428,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "ACCESS LIVE PREVIEW ENGINE"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                    lineNumber: 429,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                            lineNumber: 422,
                                            columnNumber: 25
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 421,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                lineNumber: 344,
                                columnNumber: 19
                            }, this) : /* Inquiry awaiting project conversion */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-amber-500/30 bg-amber-950/10 p-4 space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 438,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "INTAKE REVIEW & SCOPING IN PROGRESS"
                                            }, void 0, false, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 439,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 437,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-zinc-300 font-light leading-relaxed",
                                        children: "Your inquiry is being evaluated by our systems architects. A technical scoping call or customized engineering roadmap is being sequenced. You will receive an encrypted communication shortly."
                                    }, void 0, false, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 441,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                lineNumber: 436,
                                columnNumber: 19
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `mailto:ops@technovastudio.dev?subject=Inquiry%20Status%20Update%20//%20${matchedInquiry?.trackingCode || searchQuery}`,
                                        className: "flex items-center space-x-2 border border-white/20 px-4 py-2 text-zinc-300 hover:text-white hover:border-red-500 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                className: "w-3.5 h-3.5 text-red-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 453,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "CONTACT SPRINT LEAD"
                                            }, void 0, false, {
                                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                                lineNumber: 454,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 449,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setSearched(false);
                                            setSearchQuery('');
                                            setMatchedInquiry(null);
                                            setMatchedProject(null);
                                        },
                                        className: "text-zinc-500 hover:text-zinc-300 underline text-[10px]",
                                        children: "SEARCH ANOTHER CODE"
                                    }, void 0, false, {
                                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                        lineNumber: 456,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                                lineNumber: 448,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                        lineNumber: 232,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/modals/StatusTrackerModal.tsx",
                    lineNumber: 220,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/modals/StatusTrackerModal.tsx",
            lineNumber: 144,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/modals/StatusTrackerModal.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
_s(StatusTrackerModal, "dZvqLDhFcLX4DXIFW1vNnoObPWo=");
_c = StatusTrackerModal;
var _c;
__turbopack_context__.k.register(_c, "StatusTrackerModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_ROLE_PERMISSIONS",
    ()=>DEFAULT_ROLE_PERMISSIONS,
    "INITIAL_LEADS",
    ()=>INITIAL_LEADS,
    "SEED_ANNOUNCEMENTS",
    ()=>SEED_ANNOUNCEMENTS,
    "SEED_CMS",
    ()=>SEED_CMS,
    "SEED_INQUIRIES",
    ()=>SEED_INQUIRIES,
    "SEED_JOIN_REQUESTS",
    ()=>SEED_JOIN_REQUESTS,
    "SEED_MEMBERS",
    ()=>SEED_MEMBERS,
    "SEED_PROJECTS",
    ()=>SEED_PROJECTS,
    "SEED_SHEETS",
    ()=>SEED_SHEETS,
    "STORAGE_KEYS",
    ()=>STORAGE_KEYS,
    "getProjectProgress",
    ()=>getProjectProgress,
    "getStore",
    ()=>getStore,
    "initStore",
    ()=>initStore,
    "setStore",
    ()=>setStore,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// FILE PATH: lib/store.ts
// TECHNOVA STUDIO // COMPLETE DATA STORE & SCHEMA
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey) : null;
function getProjectProgress(project) {
    if (project.status === 'COMPLETED' || project.status === 'ARCHIVED') {
        return 100;
    }
    // Base progress based on pipeline status
    const statusBase = {
        INQUIRY: 15,
        SCOPING: 35,
        ACTIVE: 65,
        REVIEW: 88,
        COMPLETED: 100,
        ARCHIVED: 100
    };
    const base = statusBase[project.status] ?? 20;
    // If milestones exist, blend milestone completion into the status range
    if (project.milestones && project.milestones.length > 0) {
        const doneCount = project.milestones.filter((m)=>m.completed).length;
        const ratio = doneCount / project.milestones.length;
        if (project.status === 'ACTIVE') {
            return Math.round(50 + ratio * 30);
        } else if (project.status === 'SCOPING') {
            return Math.round(25 + ratio * 20);
        } else if (project.status === 'REVIEW') {
            return Math.round(85 + ratio * 10);
        }
    }
    return base;
}
// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT RBAC PERMISSIONS (All ON by default, manager can toggle)
// ─────────────────────────────────────────────────────────────────────────────
const ALL_ON = {
    canViewAllProjects: true,
    canViewOwnProjects: true,
    canCreateProject: true,
    canEditAnyProject: true,
    canEditOwnProject: true,
    canDeleteProject: true,
    canAssignMembers: true,
    canUpdateProjectStatus: true,
    canConvertInquiryToProject: true,
    canViewClientFinancials: true,
    canCreateMilestone: true,
    canCompleteMilestone: true,
    canLogHours: true,
    canAddProjectLinks: true,
    canAddComments: true,
    canViewAllMembers: true,
    canViewMemberDossier: true,
    canWriteManagerNotes: true,
    canReadManagerNotes: true,
    canEditMemberRoles: true,
    canOnboardMembers: true,
    canChangePasswords: true,
    canToggleMemberPermissions: true,
    canViewAllInquiries: true,
    canCreateInquiry: true,
    canUpdateInquiryStatus: true,
    canViewLeadFinancials: true,
    canViewAnalytics: true,
    canViewRevenueMetrics: true,
    canViewTeamMetrics: true,
    canPostAnnouncements: true,
    canPinAnnouncements: true,
    canManagePortfolioCMS: true,
    canManageAboutUs: true,
    canManageBookingSettings: true,
    canViewDataSheets: true,
    canEditDataSheets: true,
    canCreateDataSheets: true
};
const DEFAULT_ROLE_PERMISSIONS = [
    {
        roleId: 'manager',
        label: 'Manager / Tech Lead',
        permissions: {
            ...ALL_ON
        },
        lastUpdatedBy: 'system',
        lastUpdatedAt: new Date().toISOString()
    },
    {
        roleId: 'working_member',
        label: 'Working Member',
        permissions: {
            ...ALL_ON
        },
        lastUpdatedBy: 'system',
        lastUpdatedAt: new Date().toISOString()
    },
    {
        roleId: 'member',
        label: 'New Member (Restricted)',
        permissions: {
            ...ALL_ON
        },
        lastUpdatedBy: 'system',
        lastUpdatedAt: new Date().toISOString()
    }
];
const SEED_MEMBERS = [
    {
        id: 'usr-01',
        name: 'Aryan Kapoor',
        email: 'admin@technovastudio.dev',
        password: 'NOVA-ADMIN-KEY',
        role: 'admin',
        department: 'Management',
        skills: [
            'WebGL',
            'Architecture',
            'Business Dev',
            'GLSL',
            'Next.js'
        ],
        clearanceCode: 'LVL-09-OMEGA',
        photoInitials: 'AK',
        accentColor: '#dc2626',
        privateNotes: '',
        managerNotes: '',
        activeProjectIds: [
            'prj-001',
            'prj-003'
        ],
        metrics: {
            tasksCompleted: 34,
            tasksOverdue: 2,
            avgCompletionDays: 2.8,
            hoursLoggedTotal: 312,
            deliveryRatePct: 94
        },
        createdAt: '2025-01-10',
        lastActive: new Date().toISOString()
    },
    {
        id: 'usr-02',
        name: 'Riya Sharma',
        email: 'manager@technovastudio.dev',
        password: 'NOVA-MGR-KEY',
        role: 'manager',
        department: 'Fullstack Engineering',
        skills: [
            'React',
            'Three.js',
            'Node.js',
            'System Design',
            'Rust WASM'
        ],
        clearanceCode: 'LVL-07-SIGMA',
        photoInitials: 'RS',
        accentColor: '#7c3aed',
        privateNotes: '',
        managerNotes: '',
        activeProjectIds: [
            'prj-001',
            'prj-002'
        ],
        metrics: {
            tasksCompleted: 28,
            tasksOverdue: 1,
            avgCompletionDays: 3.2,
            hoursLoggedTotal: 284,
            deliveryRatePct: 97
        },
        createdAt: '2025-01-15',
        lastActive: new Date().toISOString()
    },
    {
        id: 'usr-03',
        name: 'Dev Malhotra',
        email: 'core@technovastudio.dev',
        password: 'NOVA-CORE-KEY',
        role: 'working_member',
        department: 'WebGL & Graphics',
        skills: [
            'GLSL',
            'WebGL',
            'Three.js',
            'Shader Writing',
            'Canvas API'
        ],
        clearanceCode: 'LVL-05-ALPHA',
        photoInitials: 'DM',
        accentColor: '#0891b2',
        privateNotes: 'Working on Q1 shader optimization. Need to check render pipeline for mobile.',
        managerNotes: '',
        activeProjectIds: [
            'prj-001'
        ],
        metrics: {
            tasksCompleted: 19,
            tasksOverdue: 0,
            avgCompletionDays: 2.1,
            hoursLoggedTotal: 198,
            deliveryRatePct: 100
        },
        createdAt: '2025-02-01',
        lastActive: new Date().toISOString()
    },
    {
        id: 'usr-04',
        name: 'Priya Nair',
        email: 'recruit@technovastudio.dev',
        password: 'NOVA-INIT-KEY',
        role: 'member',
        department: 'Growth & Sales',
        skills: [
            'Lead Generation',
            'Cold Outreach',
            'Market Research',
            'CRM'
        ],
        clearanceCode: 'LVL-01-RESTRICTED',
        photoInitials: 'PN',
        accentColor: '#059669',
        privateNotes: '',
        managerNotes: '',
        activeProjectIds: [
            'prj-002'
        ],
        metrics: {
            tasksCompleted: 6,
            tasksOverdue: 1,
            avgCompletionDays: 4.0,
            hoursLoggedTotal: 52,
            deliveryRatePct: 86
        },
        createdAt: '2025-02-18',
        lastActive: new Date().toISOString()
    }
];
const SEED_PROJECTS = [
    {
        id: 'prj-001',
        title: 'Aetherius Quantum — WebGL Telemetry Engine',
        description: 'Real-time spatial command interface rendering live satellite orbital mechanics directly inside a zero-latency WebGL browser viewport. Client requires 120 FPS locked on high-end displays.',
        source: 'CLIENT_INQUIRY',
        type: 'DEV_BUILD',
        status: 'ACTIVE',
        priority: 'CRITICAL',
        trackingCode: 'NV-INQ-1042',
        clientInfo: {
            clientName: 'Vikramaditya Rao',
            company: 'Aetherius Quantum Systems',
            contact: 'v.rao@aetherius.io',
            trackingCode: 'NV-INQ-1042',
            budget: '$45,000',
            expectedRevenue: 45000,
            followUpDate: '2025-04-01',
            leadSource: 'REFERRAL'
        },
        assignedMemberIds: [
            'usr-02',
            'usr-03'
        ],
        managerId: 'usr-02',
        createdBy: 'usr-01',
        startDate: '2025-02-15',
        dueDate: '2025-04-30',
        estimatedHours: 320,
        actualHours: 148,
        resourceLinks: [
            {
                id: 'lnk-01',
                label: 'Figma Wireframes',
                url: 'https://figma.com/file/demo',
                type: 'figma'
            },
            {
                id: 'lnk-02',
                label: 'GitHub Repo',
                url: 'https://github.com/technovastudio/aetherius-gl',
                type: 'repo'
            },
            {
                id: 'lnk-03',
                label: 'Staging Deploy',
                url: 'https://aetherius-staging.vercel.app',
                type: 'live_demo'
            }
        ],
        milestones: [
            {
                id: 'ms-01',
                title: 'Core WebGL Canvas Setup',
                completed: true,
                createdAt: '2025-02-16'
            },
            {
                id: 'ms-02',
                title: 'Particle System Architecture',
                completed: true,
                createdAt: '2025-02-20'
            },
            {
                id: 'ms-03',
                title: 'GLSL Shader Optimization Pass',
                completed: false,
                createdAt: '2025-03-01'
            },
            {
                id: 'ms-04',
                title: 'Client Review & QA',
                completed: false,
                createdAt: '2025-04-10'
            },
            {
                id: 'ms-05',
                title: 'Production Deployment',
                completed: false,
                createdAt: '2025-04-28'
            }
        ],
        comments: [
            {
                id: 'cmt-01',
                authorId: 'usr-02',
                authorName: 'Riya Sharma',
                text: 'Initial WebGL canvas is rendering at 118 FPS on M2. Need to optimize for Windows GPU.',
                createdAt: '2025-02-25T10:30:00Z'
            },
            {
                id: 'cmt-02',
                authorId: 'usr-03',
                authorName: 'Dev Malhotra',
                text: 'Found bottleneck in fragment shader — switching to instanced rendering. ETA 2 days.',
                createdAt: '2025-03-02T14:15:00Z'
            }
        ],
        hourLogs: [
            {
                id: 'hl-01',
                memberId: 'usr-03',
                memberName: 'Dev Malhotra',
                hours: 48,
                description: 'Core WebGL setup + particle system',
                date: '2025-02-20'
            },
            {
                id: 'hl-02',
                memberId: 'usr-02',
                memberName: 'Riya Sharma',
                hours: 100,
                description: 'Architecture, client calls, code review',
                date: '2025-03-01'
            }
        ],
        tags: [
            'WebGL',
            'GLSL',
            'Client',
            'High-Priority'
        ],
        liveUrl: 'https://aetherius-staging.vercel.app',
        repoUrl: 'https://github.com/technovastudio/aetherius-gl',
        createdAt: '2025-02-14T09:00:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'prj-002',
        title: 'Q2 Lead Generation — FinTech & Defense AI Verticals',
        description: 'Systematic outreach campaign targeting 200+ FinTech startups and Defense AI companies in US & EU markets. Building contact database and sequenced cold email strategy.',
        source: 'INTERNAL_TEAM',
        type: 'LEAD_GEN',
        status: 'ACTIVE',
        priority: 'HIGH',
        assignedMemberIds: [
            'usr-04'
        ],
        managerId: 'usr-02',
        createdBy: 'usr-02',
        startDate: '2025-03-01',
        dueDate: '2025-04-15',
        estimatedHours: 80,
        actualHours: 22,
        resourceLinks: [
            {
                id: 'lnk-04',
                label: 'Target Companies Sheet',
                url: 'https://docs.google.com/spreadsheets/d/demo',
                type: 'sheet'
            },
            {
                id: 'lnk-05',
                label: 'Outreach Email Templates',
                url: 'https://docs.google.com/document/d/demo',
                type: 'doc'
            }
        ],
        milestones: [
            {
                id: 'ms-06',
                title: 'Compile 200 Target Companies',
                completed: true,
                createdAt: '2025-03-02'
            },
            {
                id: 'ms-07',
                title: 'Write 5 Email Template Variants',
                completed: false,
                createdAt: '2025-03-10'
            },
            {
                id: 'ms-08',
                title: 'Launch Sequence — Batch 1 (100 contacts)',
                completed: false,
                createdAt: '2025-03-20'
            }
        ],
        comments: [],
        hourLogs: [
            {
                id: 'hl-03',
                memberId: 'usr-04',
                memberName: 'Priya Nair',
                hours: 22,
                description: 'Research + initial target list compilation',
                date: '2025-03-05'
            }
        ],
        tags: [
            'Lead Gen',
            'Sales',
            'Internal',
            'FinTech'
        ],
        createdAt: '2025-03-01T08:00:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'prj-003',
        title: 'Krypton Defense AI — Spatial Command Interface',
        description: 'Real-Time Spatial Command Interface for defense analytics. Institutional-grade UI with zero-knowledge auth and hardware-accelerated micro-interactions.',
        source: 'CLIENT_INQUIRY',
        type: 'CLIENT_COMMISSION',
        status: 'COMPLETED',
        priority: 'HIGH',
        clientInfo: {
            clientName: 'Elena Rostova',
            company: 'Krypton Defense AI',
            contact: 'e.rostova@krypton.ai',
            budget: '$80,000',
            expectedRevenue: 80000,
            followUpDate: '2025-02-01',
            leadSource: 'COLD_OUTREACH'
        },
        assignedMemberIds: [
            'usr-01',
            'usr-02'
        ],
        managerId: 'usr-01',
        createdBy: 'usr-01',
        startDate: '2025-01-05',
        dueDate: '2025-03-01',
        estimatedHours: 500,
        actualHours: 487,
        resourceLinks: [
            {
                id: 'lnk-06',
                label: 'Live Production',
                url: 'https://krypton-defense.io',
                type: 'live_demo'
            }
        ],
        milestones: [
            {
                id: 'ms-09',
                title: 'Auth System (Zero-Knowledge)',
                completed: true,
                createdAt: '2025-01-08'
            },
            {
                id: 'ms-10',
                title: 'Spatial UI Core',
                completed: true,
                createdAt: '2025-01-20'
            },
            {
                id: 'ms-11',
                title: 'Hardware Acceleration + QA',
                completed: true,
                createdAt: '2025-02-15'
            },
            {
                id: 'ms-12',
                title: 'Production Launch',
                completed: true,
                createdAt: '2025-03-01'
            }
        ],
        comments: [],
        hourLogs: [],
        tags: [
            'Defense',
            'AI',
            'Client',
            'Completed'
        ],
        liveUrl: 'https://krypton-defense.io',
        createdAt: '2025-01-04T09:00:00Z',
        updatedAt: '2025-03-01T17:00:00Z'
    }
];
const SEED_INQUIRIES = [
    {
        id: 'inq-001',
        trackingCode: 'NV-INQ-1042',
        clientName: 'Siddharth Mehra',
        company: 'NovaPulse Analytics',
        email: 'sid@novapulse.io',
        phone: '+91 98100 45567',
        scope: 'AI-driven real-time data visualization dashboard with WebGL animations',
        budget: '$35,000',
        expectedRevenue: 35000,
        leadSource: 'WEBSITE_HUD',
        preferredCallDate: '2025-04-05',
        status: 'NEW_INQUIRY',
        assignedSalesId: 'usr-04',
        dealNotes: 'Founder reached via booking form. Mentioned urgency — Q2 board demo.',
        submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        followUpDate: '2025-04-02'
    },
    {
        id: 'inq-002',
        trackingCode: 'NV-CALL-2098',
        clientName: 'Natasha Voronova',
        company: 'Vertex Capital Partners',
        email: 'n.voronova@vertexcap.com',
        phone: '+44 7700 900456',
        scope: 'Full brand identity redesign + interactive investor portal',
        budget: '$60,000',
        expectedRevenue: 60000,
        leadSource: 'REFERRAL',
        preferredCallDate: '2025-04-08',
        status: 'CALL_SCHEDULED',
        assignedSalesId: 'usr-02',
        dealNotes: 'Referred by Elena Rostova (Krypton client). High intent. Call confirmed April 8.',
        submittedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        followUpDate: '2025-04-08'
    }
];
const INITIAL_LEADS = SEED_INQUIRIES;
const SEED_ANNOUNCEMENTS = [
    {
        id: 'ann-001',
        title: 'SPRINT CALL — FRIDAY 6PM IST',
        content: 'Weekly sprint sync mandatory for all active members. Agenda: Aetherius project milestone review + Q2 lead gen targets. Google Meet link: meet.google.com/nova-sprint-01',
        category: 'MEETING',
        authorId: 'usr-01',
        authorName: 'Aryan Kapoor',
        pinned: true,
        readBy: [
            'usr-01',
            'usr-02'
        ],
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
        id: 'ann-002',
        title: 'IP PROTECTION POLICY UPDATED',
        content: 'All client code, assets, and system architecture documents are under strict NDA. Do not share project details, staging links, or credentials on any public platform including GitHub public repos. Violations will result in immediate clearance revocation.',
        category: 'POLICY',
        authorId: 'usr-01',
        authorName: 'Aryan Kapoor',
        pinned: true,
        readBy: [
            'usr-01'
        ],
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    },
    {
        id: 'ann-003',
        title: 'New tooling: GitHub Copilot seats available',
        content: 'We\'ve purchased 3 GitHub Copilot seats for core devs. DM Admin to get your seat assigned. Priority to active build projects.',
        category: 'GENERAL',
        authorId: 'usr-02',
        authorName: 'Riya Sharma',
        pinned: false,
        readBy: [
            'usr-02'
        ],
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
    }
];
const SEED_SHEETS = [
    {
        id: 'sht-01',
        name: 'Q1_SERVER_TELEMETRY',
        columns: [
            'NODE_ID',
            'REGION',
            'LATENCY',
            'GPU_LOAD',
            'OWNER'
        ],
        rows: [
            {
                NODE_ID: 'NOVA-MUM-01',
                REGION: 'AP-SOUTH',
                LATENCY: '11ms',
                GPU_LOAD: '42%',
                OWNER: 'core@technovastudio.dev'
            },
            {
                NODE_ID: 'NOVA-FRA-02',
                REGION: 'EU-CENTRAL',
                LATENCY: '28ms',
                GPU_LOAD: '67%',
                OWNER: 'admin@technovastudio.dev'
            },
            {
                NODE_ID: 'NOVA-NY-03',
                REGION: 'US-EAST',
                LATENCY: '19ms',
                GPU_LOAD: '55%',
                OWNER: 'manager@technovastudio.dev'
            }
        ],
        createdBy: 'usr-01',
        createdAt: '2025-01-15'
    },
    {
        id: 'sht-02',
        name: 'LEAD_GEN_TRACKER',
        columns: [
            'COMPANY',
            'CONTACT',
            'EMAIL',
            'STATUS',
            'LAST_TOUCH',
            'NOTES'
        ],
        rows: [
            {
                COMPANY: 'Zenith AI Labs',
                CONTACT: 'Priya K.',
                EMAIL: 'priya@zenithai.com',
                STATUS: 'CONTACTED',
                LAST_TOUCH: '2025-03-10',
                NOTES: 'Sent intro email. Awaiting reply.'
            },
            {
                COMPANY: 'QuantumLeap SaaS',
                CONTACT: 'Arjun V.',
                EMAIL: 'arjun@quantumleap.io',
                STATUS: 'REPLIED',
                LAST_TOUCH: '2025-03-12',
                NOTES: 'Positive response. Scheduling call.'
            }
        ],
        createdBy: 'usr-02',
        createdAt: '2025-03-01'
    }
];
const SEED_CMS = {
    aboutUs: {
        heroTagline: 'WE BUILD BEYOND DIGITAL',
        subTagline: 'An elite collective of systems architects and creative technologists.',
        manifesto: 'Technova Studio is not an agency. We are an engineering collective — a unit of high-caliber architects who craft digital experiences that defy conventional browser limits. Every project is custom-engineered from raw shaders, low-level state machines, and precision UI/UX.',
        vision: 'Pioneering zero-latency spatial web experiences and mission-critical digital interfaces for visionary enterprises worldwide.',
        methodology: 'Bespoke GLSL shaders, strict TypeScript type systems, zero-knowledge security, and verified 120 FPS performance standards.',
        securityGuarantee: 'Enterprise NDA enforced on day zero. Zero data leakage, isolated client staging environments, and dedicated engineering clearance.',
        foundedYear: '2024',
        location: 'Remote-First // Global Operations',
        stats: [
            {
                label: 'FPS Locked',
                value: '120'
            },
            {
                label: 'Projects Shipped',
                value: '12+'
            },
            {
                label: 'Uptime',
                value: '99.99%'
            },
            {
                label: 'Countries',
                value: '8+'
            }
        ],
        teamHighlight: 'From WebGL shaders to zero-knowledge auth systems — our team handles the impossible.',
        contactEmail: 'ops@technovastudio.dev'
    },
    portfolioShowcase: [
        {
            id: 'port-01',
            code: 'PRJ // HYPERION-GL',
            title: 'AETHERIUS QUANTUM TELEMETRY',
            category: 'CUSTOM GLSL SHADERS / NEXT.JS / RUST WASM',
            metrics: '120 FPS LOCKED // 1.4M PARTICLES',
            description: 'Real-time spatial command interface rendering live satellite orbital mechanics directly inside a zero-latency WebGL browser viewport.',
            liveUrl: 'https://aetherius-staging.vercel.app',
            featured: true,
            tags: [
                'WebGL',
                'GLSL',
                'Real-Time'
            ],
            thumbnailColor: '#dc2626'
        },
        {
            id: 'port-02',
            code: 'PRJ // KRYPTON-OS',
            title: 'OBSIDIAN FINTECH KERNEL',
            category: 'ZERO-KNOWLEDGE AUTH / SPATIAL UI',
            metrics: '0.02s EXECUTION // INSTITUTIONAL GRADE',
            description: 'Algorithmic liquidity visualization engine engineered with bespoke geometric wireframes and hardware-accelerated micro-interactions.',
            liveUrl: 'https://krypton-defense.io',
            featured: true,
            tags: [
                'Auth',
                'FinTech',
                'Spatial UI'
            ],
            thumbnailColor: '#7c3aed'
        },
        {
            id: 'port-03',
            code: 'PRJ // NEURAL-SYNTH',
            title: 'VORTEX AI COMPUTE ENGINE',
            category: 'THREE.JS / DISTRIBUTED NODE GRAPH',
            metrics: '99.99% UPTIME // ENTERPRISE FLEX',
            description: 'Interactive 3D neural topology mapper allowing engineers to inspect live tensor weights in real-time 3D space.',
            liveUrl: 'https://vortex-ai-demo.vercel.app',
            featured: false,
            tags: [
                'AI',
                'Three.js',
                'Enterprise'
            ],
            thumbnailColor: '#0891b2'
        }
    ],
    bookingSettings: {
        enabled: true,
        calendarLink: '',
        responseTime: '< 24 hours',
        minimumBudget: '$15,000',
        availableScopes: [
            'IMPOSSIBLE WEBGL / 3D PLATFORM',
            'CUSTOM AI & DISTRIBUTED SYSTEM',
            'HIGH-END BRAND & INTERACTION DESIGN',
            'FULLSTACK PRODUCT ENGINEERING'
        ],
        availableBudgetRanges: [
            '$15,000 - $30,000',
            '$30,000 - $60,000',
            '$60,000 - $120,000',
            '$120,000+ Enterprise'
        ],
        availableCallSlots: [
            '10:00 - 10:45 AM IST',
            '02:00 - 02:45 PM IST',
            '05:00 - 05:45 PM IST',
            '09:00 - 09:45 PM IST (US East / EU Friendly)'
        ],
        callMeetingPlatforms: [
            'Google Meet (Secure Link)',
            'Zoom Enterprise',
            'Direct Encrypted Audio Call'
        ]
    }
};
const SEED_JOIN_REQUESTS = [
    {
        id: 'join-001',
        fullName: 'Ananya Deshmukh',
        email: 'ananya.d@graphicslab.io',
        portfolioUrl: 'https://ananya-glsl.art',
        githubUrl: 'https://github.com/ananya-gl',
        department: 'WebGL & Graphics',
        skills: [
            'Three.js',
            'GLSL',
            'Compute Shaders',
            'WebGPU'
        ],
        statement: 'I specialize in real-time fluid simulation and physics in browser viewports. I want to build world-class digital monuments with Technova Studio.',
        submittedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        status: 'PENDING'
    }
];
const STORAGE_KEYS = {
    MEMBERS: 'tnova_members',
    PROJECTS: 'tnova_projects',
    INQUIRIES: 'tnova_inquiries',
    ANNOUNCEMENTS: 'tnova_announcements',
    SHEETS: 'tnova_sheets',
    CMS: 'tnova_cms',
    RBAC: 'tnova_rbac',
    ACTIVE_USER: 'tnova_active_user',
    CLIENT_SESSION: 'tnova_client_session',
    JOIN_REQUESTS: 'tnova_join_requests'
};
function getStore(key, fallback) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch  {
        return fallback;
    }
}
function setStore(key, value) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem(key, JSON.stringify(value));
}
function initStore() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) setStore(STORAGE_KEYS.MEMBERS, SEED_MEMBERS);
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) setStore(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) setStore(STORAGE_KEYS.INQUIRIES, SEED_INQUIRIES);
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) setStore(STORAGE_KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    if (!localStorage.getItem(STORAGE_KEYS.SHEETS)) setStore(STORAGE_KEYS.SHEETS, SEED_SHEETS);
    if (!localStorage.getItem(STORAGE_KEYS.CMS)) setStore(STORAGE_KEYS.CMS, SEED_CMS);
    if (!localStorage.getItem(STORAGE_KEYS.RBAC)) setStore(STORAGE_KEYS.RBAC, DEFAULT_ROLE_PERMISSIONS);
    if (!localStorage.getItem(STORAGE_KEYS.JOIN_REQUESTS)) setStore(STORAGE_KEYS.JOIN_REQUESTS, SEED_JOIN_REQUESTS);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=_1ffhuxj-fdj7a._.js.map