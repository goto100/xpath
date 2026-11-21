/// <reference lib="dom" />

/** The value of an XPath expression that doesn't select nodes. */
export type ScalarValue = string | number | boolean;

/** What `select()` returns: the selected nodes, or the expression's value if it isn't a node set. */
export type SelectReturnType = Array<Node> | ScalarValue;
/** What `select1()` and `select(..., true)` return: the first selected node (undefined if none), or the expression's value. */
export type SelectSingleReturnType = ScalarValue | Node | undefined;

/** @deprecated Use `SelectReturnType`, `SelectSingleReturnType` or `ScalarValue`. */
export type SelectedValue = Node | string | number | boolean | null;

export interface XPathSelect {
    (expression: string, node: Node): SelectReturnType;
    (expression: string, node: Node, single: false): SelectReturnType;
    (expression: string, node: Node, single: true): SelectSingleReturnType;
}

export function evaluate(expression: string, contextNode: Node, resolver: XPathNSResolver | null, type: number, result: XPathResult | null): XPathResult;

/**
 * The result of `evaluate()`, modeled on the DOM `XPathResult`. Only the
 * property that matches `resultType` is set. Results come from `evaluate()`;
 * they can't be constructed directly.
 */
export declare class XPathResult {
    private constructor();

    static readonly ANY_TYPE: 0;
    static readonly NUMBER_TYPE: 1;
    static readonly STRING_TYPE: 2;
    static readonly BOOLEAN_TYPE: 3;
    static readonly UNORDERED_NODE_ITERATOR_TYPE: 4;
    static readonly ORDERED_NODE_ITERATOR_TYPE: 5;
    static readonly UNORDERED_NODE_SNAPSHOT_TYPE: 6;
    static readonly ORDERED_NODE_SNAPSHOT_TYPE: 7;
    static readonly ANY_UNORDERED_NODE_TYPE: 8;
    static readonly FIRST_ORDERED_NODE_TYPE: 9;

    readonly resultType: number;
    /** Set for NUMBER_TYPE results. */
    readonly numberValue: number;
    /** Set for STRING_TYPE results. */
    readonly stringValue: string;
    /** Set for BOOLEAN_TYPE results. */
    readonly booleanValue: boolean;
    /** Set for ANY_UNORDERED_NODE_TYPE and FIRST_ORDERED_NODE_TYPE results; null when nothing matched. */
    readonly singleNodeValue: Node | null;
    /** Set for the snapshot types. */
    readonly snapshotLength: number;
    /** Set for the iterator types. */
    readonly invalidIteratorState: boolean;

    /** For the iterator types: the next node, or undefined after the last one. */
    iterateNext(): Node | undefined;
    /** For the snapshot types: the node at `index`, or undefined when out of range. */
    snapshotItem(index: number): Node | undefined;
}

/**
 * Evaluate an XPath expression against a DOM node.
 */
export function select(expression: string, node: Node): SelectReturnType;
export function select(expression: string, node: Node, single: false): SelectReturnType;
export function select(expression: string, node: Node, single: true): SelectSingleReturnType;

/**
 * Evaluate an xpath expression against a DOM node, returning the first result only.
 */
export function select1(expression: string, node: Node): SelectSingleReturnType;

/**
 * Evaluate an XPath expression against a DOM node using a given namespace resolver.
 */
export function selectWithResolver(expression: string, node: Node, resolver?: XPathNSResolver | null): SelectReturnType;
export function selectWithResolver(expression: string, node: Node, resolver: XPathNSResolver | null, single: false): SelectReturnType;
export function selectWithResolver(expression: string, node: Node, resolver: XPathNSResolver | null, single: true): SelectSingleReturnType;

/**
 * Creates a `select` function that uses the given namespace prefix to URI mappings when evaluating queries.
 * @param namespaceMap an object mapping namespace prefixes to namespace URIs.  Each key is a prefix; each value is a URI.
 * @return a function with the same signature as `xpath.select`
 */
export function useNamespaces(namespaceMap: Record<string, string>): XPathSelect;

// Type guards that narrow a value to a node type. Each accepts any value: a select() or
// select1() result, a DOM property such as parentNode, null or undefined.
export function isNodeLike(value: unknown): value is Node;
export function isArrayOfNodes(value: unknown): value is Node[];
export function isElement(value: unknown): value is Element;
export function isAttribute(value: unknown): value is Attr;
export function isTextNode(value: unknown): value is Text;
export function isCDATASection(value: unknown): value is CDATASection;
export function isProcessingInstruction(value: unknown): value is ProcessingInstruction;
export function isComment(value: unknown): value is Comment;
export function isDocumentNode(value: unknown): value is Document;
export function isDocumentTypeNode(value: unknown): value is DocumentType;
export function isDocumentFragment(value: unknown): value is DocumentFragment;

export function parse(expression: string): XPathEvaluator;

export interface XPathEvaluator {
    evaluate(options?: XPathEvaluateOptions): XPathEvaluationResult;
    evaluateBoolean(options?: XPathEvaluateOptions): boolean;
    evaluateNumber(options?: XPathEvaluateOptions): number;
    evaluateString(options?: XPathEvaluateOptions): string;
    evaluateNodeSet(options?: XPathEvaluateOptions): XPathNodeSet;
    select(options?: XPathEvaluateOptions): Node[];
    select1(options?: XPathEvaluateOptions): Node | undefined;
}

export interface XPathEvaluateOptions {
    node?: Node;
    namespaces?: XPathNamespaceResolver;
    variables?: XPathVariableResolver;
    functions?: Record<string, XPathFunction> | XPathFunctionResolver;
    position?: number;
    size?: number;
    allowAnyNamespaceForNoPrefix?: boolean;
    isHtml?: boolean;
}

export type XPathNamespaceResolver = Record<string, string> | XPathNamespaceBasicResolver | {
    getNamespace: XPathNamespaceBasicResolver
};
export type XPathNamespaceBasicResolver = (prefix: string, node: Node) => string | null | undefined;

export type XPathVariableResolver = Record<string, XPathValue> | XPathVariableBasicResolver | {
    getVariable: XPathVariableBasicResolver
};
export type XPathVariableBasicResolver = (name: string, namespace: string | null) => XPathValue;

export type XPathFunctionResolver = XPathFunctionBasicResolver | {
    getFunction: XPathFunctionBasicResolver
};
export type XPathFunctionBasicResolver = (name: string, namespace: string | null) => XPathFunction | null | undefined;

export type XPathFunction = (context: XPathFunctionContext, ...args: XPathEvaluationResult[]) => XPathValue;

export interface XPathFunctionContext {
    contextNode: Node;
}

/** Values that variables and custom functions may produce; nodes and arrays of nodes become node sets. */
export type XPathValue = string | number | boolean | Node | Node[] | XPathEvaluationResult | null | undefined;

export interface XPathEvaluationResult {
    booleanValue(): boolean;
    numberValue(): number;
    stringValue(): string;
}

export interface XPathNodeSet extends XPathEvaluationResult {
    readonly size: number;
    first(): Node | null;
    toArray(): Node[];
}
