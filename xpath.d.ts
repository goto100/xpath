/// <reference lib="dom" />

export type SelectedValue = Node | string | number | boolean | null;

export type SelectReturnType = Array<Node> | SelectedValue;
export type SelectSingleReturnType = SelectedValue;

export interface XPathSelect {
    (expression: string, node: Node): SelectReturnType;
    (expression: string, node: Node, single: false): SelectReturnType;
    (expression: string, node: Node, single: true): SelectSingleReturnType;
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

// Type guards to narrow down the type of the selected type of a returned Node object
export function isNodeLike(value: SelectedValue): value is Node;
export function isArrayOfNodes(value: SelectReturnType): value is Node[];
export function isElement(value: SelectedValue): value is Element;
export function isAttribute(value: SelectedValue): value is Attr;
export function isTextNode(value: SelectedValue): value is Text;
export function isCDATASection(value: SelectedValue): value is CDATASection;
export function isProcessingInstruction(value: SelectedValue): value is ProcessingInstruction;
export function isComment(value: SelectedValue): value is Comment;
export function isDocumentNode(value: SelectedValue): value is Document;
export function isDocumentTypeNode(value: SelectedValue): value is DocumentType;
export function isDocumentFragment(value: SelectedValue): value is DocumentFragment;

export function parse(expression: string): XPathEvaluator;

export interface XPathEvaluator {
    evaluate(options?: XPathEvaluateOptions): XPathResult;
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

export type XPathFunction = (context: XPathFunctionContext, ...args: XPathResult[]) => XPathValue;

export interface XPathFunctionContext {
    contextNode: Node;
}

/** Values that variables and custom functions may produce; nodes and arrays of nodes become node sets. */
export type XPathValue = string | number | boolean | Node | Node[] | XPathResult | null | undefined;

export interface XPathResult {
    booleanValue(): boolean;
    numberValue(): number;
    stringValue(): string;
}

export interface XPathNodeSet extends XPathResult {
    readonly size: number;
    first(): Node | null;
    toArray(): Node[];
}
