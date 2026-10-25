(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.mjs [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.mjs [app-client] (ecmascript) <export default as EyeOff>");
;
var _s = __turbopack_context__.k.signature();
// FILE PATH: app/login/page.tsx
'use client';
;
;
;
;
function LoginPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showPwd, setShowPwd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LoginPage.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initStore"])();
        }
    }["LoginPage.useEffect"], []);
    const handleLogin = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // 1. If Supabase is connected, check cloud database first
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"]) {
            try {
                const { data, error: sbError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('studio_members').select('*').ilike('email', email.trim()).eq('password', password).maybeSingle();
                if (data && !sbError) {
                    const cloudMember = {
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        role: data.role,
                        department: data.department,
                        skills: data.skills || [],
                        clearanceCode: data.clearance_code || data.clearanceCode || 'LVL-05',
                        photoInitials: data.photo_initials || data.photoInitials || data.name.slice(0, 2).toUpperCase(),
                        accentColor: data.accent_color || data.accentColor || '#dc2626',
                        privateNotes: data.private_notes || '',
                        managerNotes: data.manager_notes || '',
                        activeProjectIds: data.active_project_ids || [],
                        metrics: data.metrics || {
                            tasksCompleted: 0,
                            tasksOverdue: 0,
                            avgCompletionDays: 0,
                            hoursLoggedTotal: 0,
                            deliveryRatePct: 100
                        },
                        createdAt: data.created_at || new Date().toISOString(),
                        lastActive: new Date().toISOString()
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].ACTIVE_USER, cloudMember);
                    router.push('/team');
                    return;
                }
            } catch (err) {
                console.warn('Supabase auth fallback:', err);
            }
        }
        // 2. Fallback to LocalStorage store
        setTimeout(()=>{
            const matched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].MEMBERS, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEED_MEMBERS"]).find((u)=>u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
            if (!matched) {
                setError('ACCESS DENIED // INVALID CREDENTIALS OR CLEARANCE KEY');
                setIsLoading(false);
                return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].ACTIVE_USER, matched);
            router.push('/team');
        }, 400);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#030303] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-red-600/12 blur-[160px] pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/app/login/page.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 right-0 w-[24rem] h-[24rem] rounded-full bg-red-900/10 blur-[140px] pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/app/login/page.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/'),
                        className: "inline-flex items-center space-x-2 font-mono text-[10px] tracking-widest text-zinc-400 hover:text-white mb-8 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "w-3.5 h-3.5 text-red-500"
                            }, void 0, false, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "RETURN TO PUBLIC MATRIX"
                            }, void 0, false, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/login/page.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-red-500/40 bg-[#070707]/90 backdrop-blur-xl p-8 hud-clip shadow-[0_0_60px_rgba(220,38,38,0.15)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2 text-red-500 font-mono text-[10px] tracking-[0.25em] mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "TECHNOVA INTERNAL SECURITY GATEWAY"
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-extrabold tracking-tight uppercase mb-1",
                                children: "AUTHORIZE TEAM SESSION"
                            }, void 0, false, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-mono text-[9px] text-zinc-500 tracking-widest mb-6",
                                children: "CLEARANCE VERIFICATION REQUIRED"
                            }, void 0, false, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 border border-red-500 bg-red-950/40 p-3 font-mono text-[10px] text-red-300 flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 119,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: handleLogin,
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1.5",
                                                children: "STUDIO EMAIL"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/page.tsx",
                                                lineNumber: 126,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "email",
                                                required: true,
                                                value: email,
                                                onChange: (e)=>setEmail(e.target.value),
                                                placeholder: "member@technovastudio.dev",
                                                className: "w-full border border-white/15 bg-black px-3.5 py-3 text-sm text-white focus:border-red-500 focus:outline-none placeholder-zinc-600"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/page.tsx",
                                                lineNumber: 129,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 125,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1.5",
                                                children: "CLEARANCE PASSKEY"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: showPwd ? 'text' : 'password',
                                                        required: true,
                                                        value: password,
                                                        onChange: (e)=>setPassword(e.target.value),
                                                        placeholder: "••••••••••••",
                                                        className: "w-full border border-white/15 bg-black px-3.5 py-3 pr-10 text-sm text-white focus:border-red-500 focus:outline-none placeholder-zinc-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/login/page.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setShowPwd(!showPwd),
                                                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors",
                                                        children: showPwd ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/login/page.tsx",
                                                            lineNumber: 157,
                                                            columnNumber: 30
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/login/page.tsx",
                                                            lineNumber: 157,
                                                            columnNumber: 63
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/login/page.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/login/page.tsx",
                                                lineNumber: 143,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 139,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: isLoading,
                                        className: "w-full border border-red-500 bg-red-600/25 py-3.5 font-mono text-xs tracking-[0.25em] text-white uppercase hover:bg-red-600 transition-all hud-clip disabled:opacity-50 flex items-center justify-center space-x-2",
                                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/login/page.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "VERIFYING..."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/login/page.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/login/page.tsx",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "DECRYPT & ENTER PORTAL"
                                        }, void 0, false, {
                                            fileName: "[project]/app/login/page.tsx",
                                            lineNumber: 173,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/page.tsx",
                                        lineNumber: 162,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/login/page.tsx",
                                lineNumber: 124,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/login/page.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/login/page.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/login/page.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "mhaVPtAQK8Fz7N7z9d4Vka7miig=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
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
const supabaseUrl = ("TURBOPACK compile-time value", "https://qtiztricrvzohtabytfl.supabase.co") || '';
const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_z7hBgHKG4nlxmGUnTPd0sw_4p2bUlaD") || ("TURBOPACK compile-time value", "sb_publishable_z7hBgHKG4nlxmGUnTPd0sw_4p2bUlaD") || '';
const supabase = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey) : "TURBOPACK unreachable";
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
        name: 'Sachin (Admin)',
        email: 'sachinjajiwaldhora@gmail.com',
        password: 'NOVA-SACHIN-2025',
        role: 'admin',
        department: 'Management',
        skills: [
            'Executive Command',
            'WebGL',
            'Architecture',
            'Strategy',
            'Next.js'
        ],
        clearanceCode: 'LVL-09-OMEGA',
        photoInitials: 'SJ',
        accentColor: '#dc2626',
        privateNotes: 'Main Studio Admin & Executive Lead.',
        managerNotes: '',
        activeProjectIds: [
            'prj-001',
            'prj-003'
        ],
        metrics: {
            tasksCompleted: 48,
            tasksOverdue: 0,
            avgCompletionDays: 2.2,
            hoursLoggedTotal: 410,
            deliveryRatePct: 98
        },
        createdAt: '2025-01-01',
        lastActive: new Date().toISOString()
    },
    {
        id: 'usr-01b',
        name: 'Anuj (Admin)',
        email: 'anujb2296@gmail.com',
        password: 'NOVA-ANUJ-2025',
        role: 'admin',
        department: 'Management',
        skills: [
            'Operations',
            'System Architecture',
            'High-End Tech',
            'Team Strategy'
        ],
        clearanceCode: 'LVL-09-OMEGA',
        photoInitials: 'AB',
        accentColor: '#ef4444',
        privateNotes: 'Studio Co-Admin & Operations Director.',
        managerNotes: '',
        activeProjectIds: [
            'prj-001',
            'prj-002'
        ],
        metrics: {
            tasksCompleted: 42,
            tasksOverdue: 0,
            avgCompletionDays: 2.5,
            hoursLoggedTotal: 385,
            deliveryRatePct: 97
        },
        createdAt: '2025-01-01',
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
    const currentMembers = getStore(STORAGE_KEYS.MEMBERS, []);
    const hasSachin = currentMembers.some((m)=>m.email.toLowerCase() === 'sachinjajiwaldhora@gmail.com');
    const hasAnuj = currentMembers.some((m)=>m.email.toLowerCase() === 'anujb2296@gmail.com');
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS) || !hasSachin || !hasAnuj) {
        const merged = [
            ...SEED_MEMBERS
        ];
        for (const m of currentMembers){
            if (!merged.some((x)=>x.email.toLowerCase() === m.email.toLowerCase())) {
                merged.push(m);
            }
        }
        setStore(STORAGE_KEYS.MEMBERS, merged);
    }
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

//# sourceMappingURL=_06u5upj7onx-1._.js.map