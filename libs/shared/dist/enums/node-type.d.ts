export declare const NodeType: Readonly<{
    readonly INITIAL: "INITIAL";
    readonly MANUAL_TRIGGER: "MANUAL_TRIGGER";
    readonly HTTP_REQUEST: "HTTP_REQUEST";
    readonly GOOGLE_FORM_TRIGGER: "GOOGLE_FORM_TRIGGER";
    readonly STRIPE_TRIGGER: "STRIPE_TRIGGER";
    readonly ANTHROPIC: "ANTHROPIC";
    readonly GEMINI: "GEMINI";
    readonly OPENAI: "OPENAI";
    readonly DISCORD: "DISCORD";
    readonly SLACK: "SLACK";
}>;
export type NodeTypeEnum = (typeof NodeType)[keyof typeof NodeType];
//# sourceMappingURL=node-type.d.ts.map